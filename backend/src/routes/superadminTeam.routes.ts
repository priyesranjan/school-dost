/**
 * Superadmin Team Management Routes
 *
 * These routes allow managing the platform team (other SuperAdmins).
 * Special protection exists for the 'Root' administrator.
 */

import { Router } from 'express'
import { requireAuth, requireRole, requireRoot } from '../middleware/auth'
import { getPlatformPrisma } from '../db/platformPool'
import { hashPassword } from '../services/authTokenService'

const router = Router()

function singleParam(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

// All team management routes require authentication and superadmin role
router.use(requireAuth)
router.use(requireRole(['superadmin'] as any))

/**
 * GET /api/superadmin/team
 * List all platform administrators
 */
router.get('/', async (req, res) => {
  try {
    const platformDb = getPlatformPrisma()
    const team = await (platformDb as any).superAdmin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isRoot: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ data: team })
  } catch (err) {
    res.status(500).json({ error: { code: 'LIST_TEAM_FAILED', message: 'Failed to list team members' } })
  }
})

/**
 * POST /api/superadmin/team
 * Add a new SuperAdmin (Master/Root only)
 */
router.post('/', requireRoot, async (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: { code: 'VALIDATION_FAILED', message: 'name, email, and password are required' } })
    }

    const platformDb = getPlatformPrisma()
    const passwordHash = await hashPassword(password)

    const newAdmin = await (platformDb as any).superAdmin.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        isRoot: false, // Only seeded via script can be root
      },
    })

    res.status(201).json({ data: { id: newAdmin.id, email: newAdmin.email } })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email or phone already in use' } })
    }
    res.status(500).json({ error: { code: 'CREATE_FAILED', message: 'Failed to create platform administrator' } })
  }
})

/**
 * DELETE /api/superadmin/team/:id
 * Remove a SuperAdmin (Master/Root only, cannot delete Root)
 */
router.delete('/:id', requireRoot, async (req, res) => {
  try {
    const id = BigInt(singleParam(req.params.id))
    const platformDb = getPlatformPrisma()

    const target = await (platformDb as any).superAdmin.findUnique({ where: { id } })
    if (!target) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Administrator not found' } })
    }

    if (target.isRoot) {
      return res.status(403).json({
        error: { code: 'ROOT_PROTECTED', message: 'Master SuperAdmin account cannot be deleted.' },
      })
    }

    await (platformDb as any).superAdmin.delete({ where: { id } })
    res.json({ data: { success: true } })
  } catch (err) {
    res.status(500).json({ error: { code: 'DELETE_FAILED', message: 'Failed to delete administrator' } })
  }
})

/**
 * PATCH /api/superadmin/team/:id
 * Toggle status or update details
 * Protection: Only Root can update a Root user's details.
 */
router.patch('/:id', async (req, res) => {
  try {
    const id = BigInt(singleParam(req.params.id))
    const platformDb = getPlatformPrisma()
    const { name, isActive, password } = req.body

    const target = await (platformDb as any).superAdmin.findUnique({ where: { id } })
    if (!target) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Administrator not found' } })
    }

    // Protection Logic
    if (target.isRoot && !req.auth?.isRoot) {
      return res.status(403).json({
        error: { code: 'ROOT_PROTECTED', message: 'Only the Master SuperAdmin can modify their own account.' },
      })
    }

    const data: any = {}
    if (name !== undefined) data.name = name
    if (isActive !== undefined) data.isActive = isActive
    if (password) data.passwordHash = await hashPassword(password)

    await (platformDb as any).superAdmin.update({
      where: { id },
      data,
    })

    res.json({ data: { success: true } })
  } catch (err) {
    res.status(500).json({ error: { code: 'UPDATE_FAILED', message: 'Failed to update administrator' } })
  }
})

export default router
