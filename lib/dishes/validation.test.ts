import { describe, expect, it } from 'vitest'
import { DishInputSchema } from './validation'

const baseDish = {
  name: 'Cơm gà',
  slug: 'com-ga',
  imageUrl: 'https://example.com/com-ga.jpg',
  category: 'RICE' as const,
  spiceLevel: 1,
  weight: 1,
  isActive: true,
}

describe('DishInputSchema preferences', () => {
  it('applies safe defaults for new dish preference fields', () => {
    expect(DishInputSchema.parse(baseDish)).toMatchObject({
      isVegetarian: false,
      priceLevel: 1,
      prepTimeMinutes: 30,
      mealTimes: ['DINNER'],
    })
  })

  it('accepts valid preferences and rejects invalid ranges or meal times', () => {
    expect(DishInputSchema.parse({
      ...baseDish,
      isVegetarian: true,
      priceLevel: 3,
      prepTimeMinutes: 45,
      mealTimes: ['BREAKFAST', 'LUNCH'],
    }).mealTimes).toEqual(['BREAKFAST', 'LUNCH'])

    expect(() => DishInputSchema.parse({ ...baseDish, priceLevel: 4 })).toThrow()
    expect(() => DishInputSchema.parse({ ...baseDish, prepTimeMinutes: 0 })).toThrow()
    expect(() => DishInputSchema.parse({ ...baseDish, mealTimes: ['MIDNIGHT'] })).toThrow()
  })
})
