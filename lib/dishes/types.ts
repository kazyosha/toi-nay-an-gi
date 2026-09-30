export const dishCategories = ['RICE', 'NOODLE', 'SOUP', 'SNACK', 'DRINK', 'OTHER'] as const

export type DishCategory = (typeof dishCategories)[number]

export const mealTimes = ['BREAKFAST', 'LUNCH', 'DINNER', 'LATE_NIGHT'] as const
export type MealTime = (typeof mealTimes)[number]

export type DishRecord = {
  id: string
  name: string
  slug: string
  imageUrl: string
  category: DishCategory
  description: string | null
  spiceLevel: number
  weight: number
  isVegetarian: boolean
  priceLevel: number
  prepTimeMinutes: number
  mealTimes: MealTime[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type DishInput = {
  name: string
  slug: string
  imageUrl: string
  category: DishCategory
  description?: string
  spiceLevel: number
  weight: number
  isVegetarian?: boolean
  priceLevel?: number
  prepTimeMinutes?: number
  mealTimes?: MealTime[]
  isActive: boolean
}

export type DishListFilters = {
  query?: string
  category?: DishCategory
  isActive?: boolean
}

export type DrawFilters = {
  categories: DishCategory[]
  isVegetarian?: boolean
  priceLevels: number[]
  maxPrepTimeMinutes?: number
  mealTimes: MealTime[]
  maxSpiceLevel?: number
  includeDishIds?: string[]
  excludeDishIds: string[]
}
