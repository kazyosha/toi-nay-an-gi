import { beforeEach, describe, expect, it, vi } from 'vitest'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    dish: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/db/prisma', () => ({ prisma: prismaMock }))

import { createDish, deleteDish, listActiveDishes, listDishes, updateDish } from '@/lib/dishes/repository'

const input = {
  name: 'Phở bò',
  slug: 'pho-bo',
  imageUrl: 'https://images.example.com/pho.jpg',
  category: 'SOUP' as const,
  description: 'Nước dùng thơm.',
  spiceLevel: 0,
  weight: 2,
  isVegetarian: false,
  priceLevel: 1,
  prepTimeMinutes: 30,
  mealTimes: ['DINNER'],
  isActive: true,
}

describe('dish repository', () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists only active dishes in selected categories', async () => {
    prismaMock.dish.findMany.mockResolvedValue([])

    await listActiveDishes(['SOUP', 'NOODLE'])

    expect(prismaMock.dish.findMany).toHaveBeenCalledWith({
      where: { isActive: true, category: { in: ['SOUP', 'NOODLE'] } },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: true,
        description: true,
        spiceLevel: true,
        weight: true,
        isVegetarian: true,
        priceLevel: true,
        prepTimeMinutes: true,
        mealTimes: true,
      },
    })
  })

  it('lists all active dishes when no category filter is provided', async () => {
    prismaMock.dish.findMany.mockResolvedValue([])

    await listActiveDishes([])

    expect(prismaMock.dish.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: true,
        description: true,
        spiceLevel: true,
        weight: true,
        isVegetarian: true,
        priceLevel: true,
        prepTimeMinutes: true,
        mealTimes: true,
      },
    })
  })

  it('combines advanced pool filters and ID constraints', async () => {
    prismaMock.dish.findMany.mockResolvedValue([])

    await listActiveDishes({
      categories: ['RICE'],
      isVegetarian: true,
      priceLevels: [1, 2],
      maxPrepTimeMinutes: 45,
      mealTimes: ['LUNCH'],
      maxSpiceLevel: 1,
      includeDishIds: ['dish-1'],
      excludeDishIds: ['dish-2'],
    })

    expect(prismaMock.dish.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        isActive: true,
        category: { in: ['RICE'] },
        isVegetarian: true,
        priceLevel: { in: [1, 2] },
        prepTimeMinutes: { lte: 45 },
        mealTimes: { hasSome: ['LUNCH'] },
        spiceLevel: { lte: 1 },
        AND: [{ id: { in: ['dish-1'] } }, { id: { notIn: ['dish-2'] } }],
      },
    }))
  })

  it('applies admin search and status filters', async () => {
    prismaMock.dish.findMany.mockResolvedValue([])

    await listDishes({ query: 'pho', category: 'SOUP', isActive: false })

    expect(prismaMock.dish.findMany).toHaveBeenCalledWith({
      where: {
        name: { contains: 'pho', mode: 'insensitive' },
        category: 'SOUP',
        isActive: false,
      },
      orderBy: { updatedAt: 'desc' },
    })
  })

  it('creates, updates, and deletes a dish through Prisma', async () => {
    prismaMock.dish.create.mockResolvedValue(input)
    prismaMock.dish.update.mockResolvedValue(input)
    prismaMock.dish.delete.mockResolvedValue(input)

    await createDish(input)
    await updateDish('dish-1', input)
    await deleteDish('dish-1')

    expect(prismaMock.dish.create).toHaveBeenCalledWith({ data: { ...input, description: 'Nước dùng thơm.' } })
    expect(prismaMock.dish.update).toHaveBeenCalledWith({ where: { id: 'dish-1' }, data: { ...input, description: 'Nước dùng thơm.' } })
    expect(prismaMock.dish.delete).toHaveBeenCalledWith({ where: { id: 'dish-1' } })
  })
})
