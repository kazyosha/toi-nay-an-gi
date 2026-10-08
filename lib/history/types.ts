import type { DishCategory, DrawFilters } from '@/lib/dishes/types'

export type DrawHistoryEntry = {
  drawnAt: string
  dish: {
    id: string
    name: string
    imageUrl: string
    category: DishCategory
    description?: string | null
    spiceLevel?: number
  }
  filters: DrawFilters
}
