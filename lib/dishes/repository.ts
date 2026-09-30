import type { DishCategory } from './types'
import type { ValidatedDishInput } from './validation'
import { prisma } from '@/lib/db/prisma'

export async function listActiveDishes(categories: DishCategory[] = []) {
  return prisma.dish.findMany({
    where: {
      isActive: true,
      ...(categories.length > 0 ? { category: { in: categories } } : {}),
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
