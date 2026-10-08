import { beforeEach, describe, expect, it, vi } from 'vitest'

const { hasAdminSessionMock, listDishesMock, createDishMock } = vi.hoisted(() => ({
  hasAdminSessionMock: vi.fn(),
  listDishesMock: vi.fn(),
  createDishMock: vi.fn(),
}))

vi.mock('@/lib/auth/admin-session', () => ({ hasAdminSession: hasAdminSessionMock }))
vi.mock('@/lib/dishes/repository', () => ({ listDishes: listDishesMock, createDish: createDishMock }))

import { GET, POST } from './route'

const input = {
  name: 'Phở bò', slug: 'pho-bo', imageUrl: 'https://images.example.com/pho.jpg', category: 'SOUP', description: 'Nước dùng thơm.', spiceLevel: 0, weight: 2, isVegetarian: false, priceLevel: 1, prepTimeMinutes: 30, mealTimes: ['DINNER'], isActive: true,
}

describe('admin dish collection routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hasAdminSessionMock.mockResolvedValue(true)
    listDishesMock.mockResolvedValue([])
    createDishMock.mockResolvedValue({ id: 'dish-1', ...input })
  })

  it('rejects unauthenticated list requests', async () => {
    hasAdminSessionMock.mockResolvedValue(false)
    const response = await GET(new Request('http://localhost/api/admin/dishes'))
    expect(response.status).toBe(401)
  })

  it('lists dishes using admin filters', async () => {
    const response = await GET(new Request('http://localhost/api/admin/dishes?query=pho&category=SOUP&isActive=false'))
    expect(response.status).toBe(200)
    expect(listDishesMock).toHaveBeenCalledWith({ query: 'pho', category: 'SOUP', isActive: false })
  })

  it('creates a validated dish', async () => {
    const response = await POST(new Request('http://localhost/api/admin/dishes', {
      method: 'POST', body: JSON.stringify(input), headers: { 'content-type': 'application/json' },
    }))
    expect(response.status).toBe(201)
    expect(createDishMock).toHaveBeenCalledWith(input)
  })

  it('rejects invalid dish input', async () => {
    const response = await POST(new Request('http://localhost/api/admin/dishes', {
      method: 'POST', body: JSON.stringify({ ...input, weight: 0 }), headers: { 'content-type': 'application/json' },
    }))
    expect(response.status).toBe(400)
  })
})
