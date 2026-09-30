import { describe, expect, it } from 'vitest'
import { DishInputSchema } from '@/lib/dishes/validation'

const validDish = {
  name: 'Cơm tấm sườn bì chả',
  slug: 'com-tam-suon-bi-cha',
  imageUrl: 'https://images.example.com/com-tam.jpg',
  category: 'RICE',
  description: 'Cơm tấm thơm với sườn nướng.',
  spiceLevel: 1,
  weight: 3,
  isVegetarian: false,
  priceLevel: 1,
  prepTimeMinutes: 30,
  mealTimes: ['DINNER'],
  isActive: true,
}

describe('DishInputSchema', () => {
  it('accepts a valid dish', () => {
    expect(DishInputSchema.parse(validDish)).toEqual(validDish)
  })

  it('rejects a missing name', () => {
    expect(() => DishInputSchema.parse({ ...validDish, name: '' })).toThrow()
  })

  it('rejects an invalid image URL', () => {
    expect(() => DishInputSchema.parse({ ...validDish, imageUrl: 'not-a-url' })).toThrow()
  })

  it('rejects an unknown category', () => {
    expect(() => DishInputSchema.parse({ ...validDish, category: 'DESSERT' })).toThrow()
  })

  it('rejects spice levels outside the 0 to 3 range', () => {
    expect(() => DishInputSchema.parse({ ...validDish, spiceLevel: 4 })).toThrow()
  })

  it('rejects weights below one', () => {
    expect(() => DishInputSchema.parse({ ...validDish, weight: 0 })).toThrow()
  })
})
