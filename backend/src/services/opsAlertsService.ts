import type { PrismaClient } from '@prisma/client'
import { getEnterpriseAnalyticsOverview } from './analyticsService'

export type OpsAlertSeverity = 'critical' | 'warning' | 'info'

export type OpsAlertItem = {
  id: number
  type: 'system'
  title: string
  message: string
  read: boolean
  timestamp: string
  severity: OpsAlertSeverity
  source_key: string | null
  muted_until: string | null
  acknowledged_at: string | null
}

export type OpsAlertsSnapshot = {
  generated_at: string
  period_days: number
  alerts: OpsAlertItem[]
  stats: {
    total: number
    critical: number
    warning: number
    info: number
    top_source: string
    top_source_count: number
  }
}

type AlertWithWeight = OpsAlertItem & {
  sort_weight: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function hashToInt(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function severityWeight(severity: OpsAlertSeverity): number {
  if (severity === 'critical') return 300
  if (severity === 'warning') return 200
  return 100
}

function toAlertId(sourceKey: string, title: string): number {
  return Number(hashToInt(`${sourceKey}:${title}`).toString().slice(0, 9))
}

export async function getOpsAlertsSnapshot(
  db: PrismaClient,
  input?: {
    days?: number
    limit?: number
  },
): Promise<OpsAlertsSnapshot> {
  const days = clamp(Number.isFinite(input?.days as number) ? Math.floor(Number(input?.days)) : 7, 7, 365)
  const limit = clamp(Number.isFinite(input?.limit as number) ? Math.floor(Number(input?.limit)) : 200, 10, 500)

  const overview = await getEnterpriseAnalyticsOverview(db, days)
  const generatedAt = overview.generated_at

  const alerts: AlertWithWeight[] = []
  const dedupe = new Set<string>()

  const push = (params: {
    severity: OpsAlertSeverity
    title: string
    message: string
    source_key: string
    sort_weight?: number
  }) => {
    const dedupeKey = `${params.source_key}:${params.title}`
    if (dedupe.has(dedupeKey)) return
    dedupe.add(dedupeKey)

    alerts.push({
      id: toAlertId(params.source_key, params.title),
      type: 'system',
      title: params.title,
      message: params.message,
      read: false,
      timestamp: generatedAt,
      severity: params.severity,
      source_key: params.source_key,
      muted_until: null,
      acknowledged_at: null,
      sort_weight: params.sort_weight ?? severityWeight(params.severity),
    })
  }

  if (overview.kpis.fee_recovery_rate < 70) {
    push({
      severity: 'critical',
      title: 'Fee recovery below critical threshold',
      message: `Recovery is ${overview.kpis.fee_recovery_rate.toFixed(1)}% for last ${overview.period_days} days.`,
      source_key: 'kpi.fee_recovery',
      sort_weight: 390,
    })
  } else if (overview.kpis.fee_recovery_rate < 85) {
    push({
      severity: 'warning',
      title: 'Fee recovery slipping',
      message: `Recovery is ${overview.kpis.fee_recovery_rate.toFixed(1)}%, monitor outstanding collections.`,
      source_key: 'kpi.fee_recovery',
      sort_weight: 280,
    })
  }

  if (overview.kpis.attendance_rate < 65) {
    push({
      severity: 'critical',
      title: 'Attendance rate critically low',
      message: `School attendance is ${overview.kpis.attendance_rate.toFixed(1)}% in the selected window.`,
      source_key: 'kpi.attendance',
      sort_weight: 370,
    })
  } else if (overview.kpis.attendance_rate < 80) {
    push({
      severity: 'warning',
      title: 'Attendance drift detected',
      message: `Attendance is ${overview.kpis.attendance_rate.toFixed(1)}%, intervention may be required.`,
      source_key: 'kpi.attendance',
      sort_weight: 270,
    })
  }

  if (overview.kpis.exam_average_score < 40) {
    push({
      severity: 'critical',
      title: 'Academic performance in danger zone',
      message: `Average exam score is ${overview.kpis.exam_average_score.toFixed(1)}%.`,
      source_key: 'kpi.exam_avg',
      sort_weight: 360,
    })
  } else if (overview.kpis.exam_average_score < 55) {
    push({
      severity: 'warning',
      title: 'Academic performance below benchmark',
      message: `Average exam score is ${overview.kpis.exam_average_score.toFixed(1)}%.`,
      source_key: 'kpi.exam_avg',
      sort_weight: 260,
    })
  }

  const monthly = overview.trends.fees_by_month
  if (monthly.length >= 2) {
    const prev = monthly[monthly.length - 2]
    const curr = monthly[monthly.length - 1]
    if (prev.collected > 0) {
      const changePct = ((curr.collected - prev.collected) / prev.collected) * 100
      if (changePct <= -35) {
        push({
          severity: 'critical',
          title: 'Monthly collections dropped sharply',
          message: `Collections dropped ${Math.abs(changePct).toFixed(1)}% vs previous month (${prev.month} -> ${curr.month}).`,
          source_key: 'trend.collections_drop',
          sort_weight: 350,
        })
      } else if (changePct <= -20) {
        push({
          severity: 'warning',
          title: 'Monthly collections trending down',
          message: `Collections dropped ${Math.abs(changePct).toFixed(1)}% vs previous month.`,
          source_key: 'trend.collections_drop',
          sort_weight: 250,
        })
      }
    }
    if (curr.due > curr.collected && curr.due > 0) {
      push({
        severity: curr.due > curr.collected * 1.5 ? 'critical' : 'warning',
        title: 'Outstanding dues exceed recent collections',
        message: `Current month due is ₹${Math.round(curr.due).toLocaleString('en-IN')} vs collected ₹${Math.round(curr.collected).toLocaleString('en-IN')}.`,
        source_key: 'trend.due_pressure',
        sort_weight: 240,
      })
    }
  }

  const weakAttendanceClasses = [...overview.class_analytics]
    .filter((x) => x.attendance_rate < 75)
    .sort((a, b) => a.attendance_rate - b.attendance_rate)
    .slice(0, 6)

  for (const cls of weakAttendanceClasses) {
    push({
      severity: cls.attendance_rate < 60 ? 'critical' : 'warning',
      title: `Class attendance risk: ${cls.class_name}`,
      message: `Attendance ${cls.attendance_rate.toFixed(1)}% with ${cls.students} active students.`,
      source_key: 'class.attendance',
      sort_weight: 220,
    })
  }

  const weakRecoveryClasses = [...overview.class_analytics]
    .filter((x) => x.fee_recovery_rate < 70)
    .sort((a, b) => a.fee_recovery_rate - b.fee_recovery_rate)
    .slice(0, 6)

  for (const cls of weakRecoveryClasses) {
    push({
      severity: cls.fee_recovery_rate < 50 ? 'critical' : 'warning',
      title: `Fee recovery risk: ${cls.class_name}`,
      message: `Recovery ${cls.fee_recovery_rate.toFixed(1)}%, outstanding ₹${Math.round(cls.outstanding).toLocaleString('en-IN')}.`,
      source_key: 'class.fee_recovery',
      sort_weight: 215,
    })
  }

  for (const risk of overview.risk_students.slice(0, 12)) {
    const severity: OpsAlertSeverity =
      risk.risk_score >= 85 || risk.risk_level === 'high'
        ? 'critical'
        : risk.risk_score >= 60 || risk.risk_level === 'medium'
          ? 'warning'
          : 'info'

    push({
      severity,
      title: `Intervention required: ${risk.student_name}`,
      message: `Risk ${risk.risk_score}/100, due ₹${Math.round(risk.fee_due_amount).toLocaleString('en-IN')}, absent ${risk.absent_days} day(s).`,
      source_key: 'student.intervention',
      sort_weight: severityWeight(severity) + Math.round(risk.risk_score),
    })
  }

  const weakSubjects = [...overview.trends.exam_performance_by_subject]
    .filter((x) => x.avg_percentage < 55)
    .sort((a, b) => a.avg_percentage - b.avg_percentage)
    .slice(0, 5)

  for (const subject of weakSubjects) {
    push({
      severity: subject.avg_percentage < 40 ? 'critical' : 'warning',
      title: `Subject underperformance: ${subject.subject}`,
      message: `Average ${subject.avg_percentage.toFixed(1)}% across ${subject.attempts} attempts.`,
      source_key: 'subject.performance',
      sort_weight: 205,
    })
  }

  const sorted = alerts
    .sort((a, b) => b.sort_weight - a.sort_weight || b.id - a.id)
    .slice(0, limit)

  const sourceCounts = new Map<string, number>()
  let critical = 0
  let warning = 0
  let info = 0

  for (const alert of sorted) {
    if (alert.severity === 'critical') critical += 1
    else if (alert.severity === 'warning') warning += 1
    else info += 1

    const key = alert.source_key || 'unknown'
    sourceCounts.set(key, (sourceCounts.get(key) || 0) + 1)
  }

  let top_source = 'none'
  let top_source_count = 0
  for (const [source, count] of sourceCounts.entries()) {
    if (count > top_source_count) {
      top_source = source
      top_source_count = count
    }
  }

  return {
    generated_at: generatedAt,
    period_days: overview.period_days,
    alerts: sorted.map(({ sort_weight: _omit, ...row }) => row),
    stats: {
      total: sorted.length,
      critical,
      warning,
      info,
      top_source,
      top_source_count,
    },
  }
}