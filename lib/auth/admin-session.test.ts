import { beforeEach, describe, expect, it, vi } from 'vitest'

const { cookieStore } = vi.hoisted(() => ({
  cookieStore: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('next/headers', () => ({ cookies: vi.fn(async () => cookieStore) }))

import { clearAdminSession, createAdminSession, hasAdminSession } from './admin-session'

describe('admin session', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.ADMIN_SESSION_SECRET = 'test-session-secret'
  })

  it('creates an httpOnly session cookie', async () => {
    await createAdminSession()

    expect(cookieStore.set).toHaveBeenCalledWith(expect.objectContaining({
      name: 'food-case-admin',
      httpOnly: true,
      sameSite: 'lax',
    }))
  })

  it('accepts a valid unexpired session cookie', async () => {
    const token = await createAdminSession()
    cookieStore.get.mockReturnValue({ value: token })

    expect(await hasAdminSession()).toBe(true)
  })

  it('rejects a missing or tampered cookie', async () => {
    cookieStore.get.mockReturnValue({ value: 'tampered.token' })
    expect(await hasAdminSession()).toBe(false)

    cookieStore.get.mockReturnValue(undefined)
    expect(await hasAdminSession()).toBe(false)
  })

  it('clears the session cookie', async () => {
    await clearAdminSession()
    expect(cookieStore.delete).toHaveBeenCalledWith('food-case-admin')
  })
})
