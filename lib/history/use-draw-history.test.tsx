import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useDrawHistory } from './use-draw-history'

const entry = {
  drawnAt: '2026-09-30T10:00:00.000Z',
  dish: { id: 'pho', name: 'Phở bò', imageUrl: 'https://example.com/pho.jpg', category: 'SOUP' as const },
  filters: { categories: [], priceLevels: [], mealTimes: [], excludeDishIds: [] },
}

describe('useDrawHistory', () => {
  beforeEach(() => window.localStorage.clear())

  it('hydrates and updates history without a page reload', async () => {
    const { result } = renderHook(() => useDrawHistory())
    await waitFor(() => expect(result.current.hydrated).toBe(true))

    act(() => result.current.add(entry))
    expect(result.current.history[0].dish.id).toBe('pho')

    act(() => result.current.clear())
    expect(result.current.history).toEqual([])
  })
})
