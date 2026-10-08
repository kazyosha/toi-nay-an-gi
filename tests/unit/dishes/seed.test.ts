import { describe, expect, it } from 'vitest'

import { seedDishes } from '@/prisma/seed'

const mealTimes = ['BREAKFAST', 'LUNCH', 'DINNER', 'LATE_NIGHT'] as const

describe('sample dish catalog', () => {
  it('provides at least 20 dishes for every meal time', () => {
    for (const mealTime of mealTimes) {
      const dishesForMeal = seedDishes.filter((dish) => dish.mealTimes.includes(mealTime))

      expect(dishesForMeal.length).toBeGreaterThanOrEqual(20)
    }
  })

  it('uses unique slugs for every sample dish', () => {
    const slugs = seedDishes.map((dish) => dish.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
