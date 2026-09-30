import { describe, expect, it } from 'vitest'
import { canOptimizeDishImage } from './dish-image'

describe('canOptimizeDishImage', () => {
  it('allows the image hosts configured for Next image optimization', () => {
    expect(canOptimizeDishImage('https://images.unsplash.com/photo.jpg')).toBe(true)
    expect(canOptimizeDishImage('https://store.public.blob.vercel-storage.com/dishes/a.webp')).toBe(true)
  })

  it('falls back for user-provided image hosts', () => {
    expect(canOptimizeDishImage('https://example.com/dish.jpg')).toBe(false)
  })
})
