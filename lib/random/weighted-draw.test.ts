import { describe, expect, it } from 'vitest'
import { buildReelItems, selectWeightedDish } from './weighted-draw'

const dishes = [
  { id: 'pho', name: 'Phở bò', weight: 1 },
  { id: 'com', name: 'Cơm tấm', weight: 3 },
] as const

describe('selectWeightedDish', () => {
  it('returns the only dish in a single-item pool', () => {
    expect(selectWeightedDish([{ id: 'pho', weight: 1 }], () => 0.9)).toEqual({ id: 'pho', weight: 1 })
  })

  it('uses relative weights to select the correct bucket', () => {
    expect(selectWeightedDish(dishes, () => 0.1).id).toBe('pho')
    expect(selectWeightedDish(dishes, () => 0.5).id).toBe('com')
    expect(selectWeightedDish(dishes, () => 0.99).id).toBe('com')
  })

  it('rejects an empty pool', () => {
    expect(() => selectWeightedDish([], () => 0.5)).toThrow('EMPTY_DISH_POOL')
  })
})

describe('buildReelItems', () => {
  it('places the selected dish at the pointer index', () => {
    const reel = buildReelItems(
      [
        { id: 'pho', name: 'Phở bò', weight: 1 },
        { id: 'com', name: 'Cơm tấm', weight: 3 },
      ],
      'com',
      9,
    )

    expect(reel).toHaveLength(9)
    expect(reel[4].id).toBe('com')
  })
})
