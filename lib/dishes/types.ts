export const dishCategories = ['RICE', 'NOODLE', 'SOUP', 'SNACK', 'DRINK', 'OTHER'] as const

export type DishCategory = (typeof dishCategories)[number]

export type DishRecord = {
  id: string
  name: string
  slug: string
  imageUrl: string
  category: DishCategory
  description: string | null
  spiceLevel: number
  weight: number
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
  isActive: boolean
}

export type DishListFilters = {
  query?: string
  category?: DishCategory
  isActive?: boolean
}
