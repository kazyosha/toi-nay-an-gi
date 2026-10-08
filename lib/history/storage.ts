import type { DrawHistoryEntry } from './types'

const STORAGE_KEY = 'toi-nay-an-gi:draw-history:v1'
const MAX_ENTRIES = 12

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function getStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

function isEntry(value: unknown): value is DrawHistoryEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<DrawHistoryEntry>
  return typeof entry.drawnAt === 'string'
    && typeof entry.dish?.id === 'string'
    && typeof entry.dish.name === 'string'
    && typeof entry.dish.imageUrl === 'string'
    && Array.isArray(entry.filters?.categories)
}

export function loadDrawHistory(storage: StorageLike | null = getStorage()): DrawHistoryEntry[] {
  if (!storage) return []
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter(isEntry).slice(0, MAX_ENTRIES) : []
  } catch {
    return []
  }
}

export function addDrawHistory(entry: DrawHistoryEntry, storage: StorageLike | null = getStorage()) {
  const history = [entry, ...loadDrawHistory(storage)].slice(0, MAX_ENTRIES)
  storage?.setItem(STORAGE_KEY, JSON.stringify(history))
  return history
}

export function clearDrawHistory(storage: StorageLike | null = getStorage()) {
  storage?.removeItem(STORAGE_KEY)
}

export function getTodayHistoryIds(history: DrawHistoryEntry[], now = new Date()) {
  const today = now.toDateString()
  return [...new Set(history.filter((entry) => new Date(entry.drawnAt).toDateString() === today).map((entry) => entry.dish.id))]
}

export const drawHistoryStorageKey = STORAGE_KEY
