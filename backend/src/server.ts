import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env'
import { dbPing } from './db/pool'
import { requireAuth } from './middleware/auth'
import { requestLogger } from './middleware/requestLogger'
import { getDashboardSummary } from './services/dashboardService'

// Route modules
import authRoutes from './routes/auth.routes'
import studentsRoutes from './routes/students.routes'
import feesRoutes from './routes/fees.routes'
import attendanceRoutes from './routes/attendance.routes'
import certificatesRoutes from './routes/certificates.routes'
import noticesRoutes from './routes/notices.routes'
import timetableRoutes from './routes/timetable.routes'
import auditRoutes from './routes/audit.routes'
import storageRoutes from './routes/storage.routes'
import examsRoutes from './routes/exams.routes'
import calendarRoutes from './routes/calendar.routes'

const app = express()

// ── Security Middleware ──────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: env.nodeEnv === 'production' ? undefined : false,
}))

// Fix #7: Lock down CORS in production
const allowedOrigins = env.nodeEnv === 'production'
  ? (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5173']

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

// Fix #9: Body size limit (1MB max)
app.use(express.json({ limit: '1mb' }))
app.use(requestLogger)

// ── Health & DB ──────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    data: {
      status: 'ok',
      service: 'erp-backend',
      env: env.nodeEnv,
      ts: new Date().toISOString(),
    },
  })
})

app.get('/api/db/ping', async (_req, res) => {
  try {
    const data = await dbPing()
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database ping failed'
    res.status(500).json({ error: { code: 'DB_PING_FAILED', message } })
  }
})

// ── Dashboard ────────────────────────────────────────────────────────
app.get('/api/dashboard/summary', requireAuth, async (_req, res) => {
  try {
    const data = await getDashboardSummary()
    res.json({ data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load dashboard summary'
    res.status(500).json({ error: { code: 'DASHBOARD_SUMMARY_FAILED', message } })
  }
})

// ── Modular Route Mounts ─────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/students', studentsRoutes)
app.use('/api/fees', feesRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/certificates', certificatesRoutes)
app.use('/api/notices', noticesRoutes)
app.use('/api/timetable', timetableRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/storage', storageRoutes)
app.use('/api/exams', examsRoutes)
app.use('/api/calendar', calendarRoutes)

// ── Global Error Handler ─────────────────────────────────────────────
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body contains invalid JSON',
      },
    })
    return
  }
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  console.error('[UnhandledError]', error)
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.nodeEnv === 'production' ? 'An unexpected error occurred' : message,
    },
  })
})

// ── Start ─────────────────────────────────────────────────────────────
app.listen(env.port, () => {
  console.log(`ERP backend running on port ${env.port}`)
})
