import type { DishCategory, DrawFilters } from './types'
import type { ValidatedDishInput } from './validation'
import { prisma } from '@/lib/db/prisma'

export async function listActiveDishes(filters: Partial<DrawFilters> | DishCategory[] = {}) {
  const normalized = Array.isArray(filters) ? { categories: filters } : filters

  return prisma.dish.findMany({
    where: {
      isActive: true,
      ...(normalized.categories?.length ? { category: { in: normalized.categories } } : {}),
      ...(typeof normalized.isVegetarian === 'boolean' ? { isVegetarian: normalized.isVegetarian } : {}),
      ...(normalized.priceLevels?.length ? { priceLevel: { in: normalized.priceLevels } } : {}),
      ...(normalized.maxPrepTimeMinutes ? { prepTimeMinutes: { lte: normalized.maxPrepTimeMinutes } } : {}),
      ...(normalized.mealTimes?.length ? { mealTimes: { hasSome: normalized.mealTimes } } : {}),
      ...(typeof normalized.maxSpiceLevel === 'number' ? { spiceLevel: { lte: normalized.maxSpiceLevel } } : {}),
      ...((normalized.includeDishIds?.length || normalized.excludeDishIds?.length) ? {
        AND: [
          ...(normalized.includeDishIds?.length ? [{ id: { in: normalized.includeDishIds } }] : []),
          ...(normalized.excludeDishIds?.length ? [{ id: { notIn: normalized.excludeDishIds } }] : []),
        ],
      } : {}),
    },
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
}

export async function listDishes(filters: {
  query?: string
  category?: DishCategory
  isActive?: boolean
}) {
  return prisma.dish.findMany({
    where: {
      ...(filters.query ? { name: { contains: filters.query, mode: 'insensitive' as const } } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(typeof filters.isActive === 'boolean' ? { isActive: filters.isActive } : {}),
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getDish(id: string) {
  return prisma.dish.findUnique({ where: { id } })
}

function toDishData(input: ValidatedDishInput) {
  return { ...input, description: input.description || null }
}

export async function createDish(input: ValidatedDishInput) {
  return prisma.dish.create({ data: toDishData(input) })
}

export async function updateDish(id: string, input: ValidatedDishInput) {
  return prisma.dish.update({ where: { id }, data: toDishData(input) })
}

export async function deleteDish(id: string) {
  await prisma.dish.delete({ where: { id } })
}
