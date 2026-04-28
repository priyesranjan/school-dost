import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from '../LoginPage.vue'

const loginWithPassword = vi.fn()

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    loading: false,
    loginWithPassword,
  }),
}))

const roleCases = [
  { role: 'superadmin', email: 'superadmin@platform.test' },
  { role: 'admin', email: 'admin@school.test' },
  { role: 'accountant', email: 'accountant@school.test' },
  { role: 'teacher', email: 'teacher@school.test' },
  { role: 'receptionist', email: 'reception@school.test' },
  { role: 'student', email: 'student@school.test' },
  { role: 'parent', email: 'parent@school.test' },
  { role: 'hod', email: 'hod@school.test' },
] as const

function mountLoginPage() {
  return mount(LoginPage, {
    global: {
      stubs: {
        AppCard: { template: '<div><slot /></div>' },
      },
    },
  })
}

describe('LoginPage role buttons', () => {
  it('renders one backend-login button for every role', () => {
    const wrapper = mountLoginPage()

    for (const { role, email } of roleCases) {
      expect(wrapper.find(`[data-role="${role}"]`).exists()).toBe(true)
      expect(wrapper.text()).toContain(email)
    }
  })

  it.each(roleCases)('logs in with the reset password for $role', async ({ role, email }) => {
    localStorage.clear()
    loginWithPassword.mockClear()
    const wrapper = mountLoginPage()

    await wrapper.find(`[data-role="${role}"]`).trigger('click')

    expect(loginWithPassword).toHaveBeenCalledWith(email, 'test123')
    if (role === 'superadmin') {
      expect(localStorage.getItem('dev_tenant_slug')).toBeNull()
    } else {
      expect(localStorage.getItem('dev_tenant_slug')).toBe('delhi-public-school')
    }
  })
})
