import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFavorites } from './use-favorites'

describe('useFavorites', () => {
  beforeEach(() => window.localStorage.clear())

  it('toggles favorites immediately and prunes IDs not in the active pool', async () => {
    window.localStorage.setItem('toi-nay-an-gi:favorites:v1', JSON.stringify(['pho', 'disabled']))
    const { result } = renderHook(() => useFavorites(['pho']))
    await waitFor(() => expect(result.current.hydrated).toBe(true))

    expect(result.current.favoriteIds).toEqual(['pho'])
    act(() => result.current.toggle('pho'))
    expect(result.current.isFavorite('pho')).toBe(false)
  })
})
