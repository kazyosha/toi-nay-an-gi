import { describe, expect, it } from 'vitest'
import { getPointerIndex } from './reel-target'

describe('getPointerIndex', () => {
  it('uses the center occurrence when the selected dish appears more than once', () => {
    const items = [
      { id: 'pho' },
      { id: 'rice' },
      { id: 'noodles' },
      { id: 'rice' },
      { id: 'soup' },
      { id: 'rolls' },
      { id: 'drink' },
    ]

    expect(getPointerIndex(items, 'rice')).toBe(3)
  })

  it('falls back to the first match when the center is not the selected dish', () => {
    expect(getPointerIndex([{ id: 'rice' }, { id: 'pho' }, { id: 'soup' }], 'rice')).toBe(0)
  })
})
