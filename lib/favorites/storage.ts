const STORAGE_KEY = 'toi-nay-an-gi:favorites:v1'

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function getStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

export function loadFavoriteIds(storage: StorageLike | null = getStorage()): string[] {
  if (!storage) return []
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === 'string' && id.length > 0))] : []
  } catch {
    return []
  }
}

export function toggleFavorite(id: string, storage: StorageLike | null = getStorage()) {
  const current = loadFavoriteIds(storage)
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  storage?.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function pruneFavoriteIds(validIds: Set<string>, storage: StorageLike | null = getStorage()) {
  const next = loadFavoriteIds(storage).filter((id) => validIds.has(id))
  storage?.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export const favoritesStorageKey = STORAGE_KEY
