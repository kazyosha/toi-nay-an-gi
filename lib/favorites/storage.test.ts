import { describe, expect, it } from 'vitest'
import { loadFavoriteIds, toggleFavorite } from './storage'

function makeStorage(initial = '') {
  let value = initial
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => { value = next },
    removeItem: () => { value = '' },
  }
}

describe('favorites storage', () => {
  it('toggles IDs, removes duplicates and recovers from invalid data', () => {
    const storage = makeStorage('["pho","pho",3]')
    expect(loadFavoriteIds(storage)).toEqual(['pho'])
    expect(toggleFavorite('com', storage)).toEqual(['pho', 'com'])
    expect(toggleFavorite('pho', storage)).toEqual(['com'])
    expect(toggleFavorite('com', storage)).toEqual([])
  })
})
