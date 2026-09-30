import { z } from 'zod'
import { hasAdminSession } from '@/lib/auth/admin-session'
import { createDish, listDishes } from '@/lib/dishes/repository'
import { dishCategories, type DishCategory } from '@/lib/dishes/types'
import { DishInputSchema } from '@/lib/dishes/validation'

const categorySchema = z.enum(dishCategories)

function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(request: Request) {
  if (!(await hasAdminSession())) return unauthorized()

  const url = new URL(request.url)
  const query = url.searchParams.get('query') || undefined
  const categoryValue = url.searchParams.get('category') || undefined
  const activeValue = url.searchParams.get('isActive')
  const category = categoryValue ? categorySchema.parse(categoryValue) : undefined
  const isActive = activeValue === null ? undefined : activeValue === 'true'

  const dishes = await listDishes({ query, category: category as DishCategory | undefined, isActive })
  return Response.json({ dishes })
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return unauthorized()

  try {
    const input = DishInputSchema.parse(await request.json())
    const dish = await createDish(input)
    return Response.json({ dish }, { status: 201 })
  } catch {
    return Response.json({ error: 'Dữ liệu món ăn không hợp lệ.' }, { status: 400 })
  }
}
