import { describe, expect, it } from 'vitest'
import { addDrawHistory, clearDrawHistory, getTodayHistoryIds, loadDrawHistory } from './storage'
import type { DrawHistoryEntry } from './types'

const entry = {
  drawnAt: '2026-09-30T10:00:00.000Z',
  dish: { id: 'pho', name: 'Phở bò', imageUrl: 'https://example.com/pho.jpg', category: 'SOUP' as const },
  filters: { categories: ['SOUP' as const], priceLevels: [], mealTimes: [], excludeDishIds: [] },
}

function makeStorage(initial = '') {
  let value = initial
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => { value = next },
    removeItem: () => { value = '' },
  }
}

describe('draw history storage', () => {
  it('recovers from invalid data and keeps newest entries within the limit', () => {
    const storage = makeStorage('{invalid')
    expect(loadDrawHistory(storage)).toEqual([])

    let history: DrawHistoryEntry[] = []
    for (let index = 0; index < 15; index += 1) {
      history = addDrawHistory({ ...entry, drawnAt: `2026-09-${String(index + 1).padStart(2, '0')}T10:00:00.000Z` }, storage)
    }
    expect(history).toHaveLength(12)
    expect(history[0].drawnAt).toBe('2026-09-15T10:00:00.000Z')
  })

  it('returns IDs drawn today and clears the device history', () => {
    const storage = makeStorage()
    addDrawHistory(entry, storage)
    addDrawHistory({ ...entry, dish: { ...entry.dish, id: 'com' }, drawnAt: '2026-09-29T10:00:00.000Z' }, storage)

    expect(getTodayHistoryIds(loadDrawHistory(storage), new Date('2026-09-30T12:00:00.000Z'))).toEqual(['pho'])
    clearDrawHistory(storage)
    expect(loadDrawHistory(storage)).toEqual([])
  })
})
