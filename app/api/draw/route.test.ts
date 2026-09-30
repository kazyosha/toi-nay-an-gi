import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

const { listActiveDishesMock } = vi.hoisted(() => ({ listActiveDishesMock: vi.fn() }))

vi.mock('@/lib/dishes/repository', () => ({ listActiveDishes: listActiveDishesMock }))

const dish = {
  id: 'pho',
  name: 'Phở bò',
  slug: 'pho-bo',
  imageUrl: 'https://images.example.com/pho.jpg',
  category: 'SOUP',
  description: 'Nước dùng thơm.',
  spiceLevel: 0,
  weight: 1,
  isVegetarian: false,
  priceLevel: 1,
  prepTimeMinutes: 30,
  mealTimes: ['DINNER'],
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

describe('POST /api/draw', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns a reel and selected dish for valid categories', async () => {
    listActiveDishesMock.mockResolvedValue([dish])

    const response = await POST(new Request('http://localhost/api/draw', {
      method: 'POST',
      body: JSON.stringify({ categories: ['SOUP'] }),
      headers: { 'content-type': 'application/json' },
    }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.selectedDish.id).toBe('pho')
    expect(body.reelItems).toHaveLength(9)
    expect(listActiveDishesMock).toHaveBeenCalledWith(['SOUP'])
  })

  it('returns EMPTY_DISH_POOL when no active dish matches', async () => {
    listActiveDishesMock.mockResolvedValue([])

    const response = await POST(new Request('http://localhost/api/draw', {
      method: 'POST',
      body: JSON.stringify({ categories: ['SOUP'] }),
      headers: { 'content-type': 'application/json' },
    }))

    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({ code: 'EMPTY_DISH_POOL' })
  })

  it('rejects unsupported categories', async () => {
    const response = await POST(new Request('http://localhost/api/draw', {
      method: 'POST',
      body: JSON.stringify({ categories: ['DESSERT'] }),
      headers: { 'content-type': 'application/json' },
    }))

    expect(response.status).toBe(400)
  })
})
