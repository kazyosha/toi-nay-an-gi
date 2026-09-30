import { z } from 'zod'
import { listActiveDishes } from '@/lib/dishes/repository'
import { dishCategories, type DishCategory } from '@/lib/dishes/types'
import { buildReelItems, selectWeightedDish } from '@/lib/random/weighted-draw'

const DrawInputSchema = z.object({
  categories: z.array(z.enum(dishCategories)).default([]),
})

export async function POST(request: Request) {
  let input: z.infer<typeof DrawInputSchema>

  try {
    input = DrawInputSchema.parse(await request.json())
  } catch {
    return Response.json({ code: 'INVALID_DRAW_INPUT', message: 'Lựa chọn nhóm món không hợp lệ.' }, { status: 400 })
  }

  const dishes = await listActiveDishes(input.categories as DishCategory[])
  if (dishes.length === 0) {
    return Response.json({ code: 'EMPTY_DISH_POOL', message: 'Chưa có món phù hợp để mở hòm.' }, { status: 422 })
  }

  const selectedDish = selectWeightedDish(dishes)
  const reelItems = buildReelItems(dishes, selectedDish.id)

  return Response.json({ reelItems, selectedDish }, { headers: { 'Cache-Control': 'no-store' } })
}
