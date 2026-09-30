import { beforeEach, describe, expect, it, vi } from 'vitest'

const { hasAdminSessionMock, updateDishMock, deleteDishMock } = vi.hoisted(() => ({
  hasAdminSessionMock: vi.fn(), updateDishMock: vi.fn(), deleteDishMock: vi.fn(),
}))

vi.mock('@/lib/auth/admin-session', () => ({ hasAdminSession: hasAdminSessionMock }))
vi.mock('@/lib/dishes/repository', () => ({ updateDish: updateDishMock, deleteDish: deleteDishMock }))

import { DELETE, PATCH } from './route'

const input = {
  name: 'Phở bò', slug: 'pho-bo', imageUrl: 'https://images.example.com/pho.jpg', category: 'SOUP', description: 'Nước dùng thơm.', spiceLevel: 0, weight: 2, isActive: true,
}

describe('admin dish item routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hasAdminSessionMock.mockResolvedValue(true)
    updateDishMock.mockResolvedValue({ id: 'dish-1', ...input })
    deleteDishMock.mockResolvedValue(undefined)
  })

  it('updates an authenticated dish', async () => {
    const response = await PATCH(new Request('http://localhost/api/admin/dishes/dish-1', {
      method: 'PATCH', body: JSON.stringify(input), headers: { 'content-type': 'application/json' },
    }), { params: Promise.resolve({ id: 'dish-1' }) })
    expect(response.status).toBe(200)
    expect(updateDishMock).toHaveBeenCalledWith('dish-1', input)
  })

  it('rejects unauthenticated updates', async () => {
    hasAdminSessionMock.mockResolvedValue(false)
    const response = await PATCH(new Request('http://localhost/api/admin/dishes/dish-1', { method: 'PATCH', body: JSON.stringify(input) }), { params: Promise.resolve({ id: 'dish-1' }) })
    expect(response.status).toBe(401)
  })

  it('deletes an authenticated dish', async () => {
    const response = await DELETE(new Request('http://localhost/api/admin/dishes/dish-1', { method: 'DELETE' }), { params: Promise.resolve({ id: 'dish-1' }) })
    expect(response.status).toBe(204)
    expect(deleteDishMock).toHaveBeenCalledWith('dish-1')
  })
})
