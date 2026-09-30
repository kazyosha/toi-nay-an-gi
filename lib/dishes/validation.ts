import { z } from 'zod'
import { dishCategories } from './types'

export const DishInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  imageUrl: z.string().url().max(2048),
  category: z.enum(dishCategories),
  description: z.string().trim().max(500).optional().default(''),
  spiceLevel: z.number().int().min(0).max(3),
  weight: z.number().int().min(1).max(1000),
  isActive: z.boolean().default(true),
})

export type ValidatedDishInput = z.infer<typeof DishInputSchema>
