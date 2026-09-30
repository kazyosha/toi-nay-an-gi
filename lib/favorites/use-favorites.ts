'use client'

import { useCallback, useEffect, useState } from 'react'
import { favoritesStorageKey, loadFavoriteIds, pruneFavoriteIds, toggleFavorite } from './storage'

const FAVORITES_EVENT = 'toi-nay-an-gi:favorites-changed'

export function useFavorites(validIds?: string[]) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFavoriteIds(validIds ? pruneFavoriteIds(new Set(validIds)) : loadFavoriteIds())
      setHydrated(true)
    }, 0)
    function sync(event: StorageEvent | Event) {
      if (event.type === 'storage' && (event as StorageEvent).key !== favoritesStorageKey) return
      setFavoriteIds(validIds ? pruneFavoriteIds(new Set(validIds)) : loadFavoriteIds())
    }
    window.addEventListener('storage', sync)
    window.addEventListener(FAVORITES_EVENT, sync)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('storage', sync)
      window.removeEventListener(FAVORITES_EVENT, sync)
    }
  }, [validIds])

  const toggle = useCallback((id: string) => {
    const next = toggleFavorite(id)
    setFavoriteIds(next)
    window.dispatchEvent(new Event(FAVORITES_EVENT))
  }, [])

  return { favoriteIds, hydrated, toggle, isFavorite: (id: string) => favoriteIds.includes(id) }
}
