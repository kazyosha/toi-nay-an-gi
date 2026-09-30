'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { addDrawHistory, clearDrawHistory, drawHistoryStorageKey, getTodayHistoryIds, loadDrawHistory } from './storage'
import type { DrawHistoryEntry } from './types'

const HISTORY_EVENT = 'toi-nay-an-gi:draw-history-changed'

export function useDrawHistory() {
  const [history, setHistory] = useState<DrawHistoryEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setHistory(loadDrawHistory())
      setHydrated(true)
    }, 0)

    function sync(event: StorageEvent | Event) {
      if (event.type === 'storage' && (event as StorageEvent).key !== drawHistoryStorageKey) return
      setHistory(loadDrawHistory())
    }

    window.addEventListener('storage', sync)
    window.addEventListener(HISTORY_EVENT, sync)
    return () => {
      window.clearTimeout(hydrationTimer)
      window.removeEventListener('storage', sync)
      window.removeEventListener(HISTORY_EVENT, sync)
    }
  }, [])

  const add = useCallback((entry: DrawHistoryEntry) => {
    const next = addDrawHistory(entry)
    setHistory(next)
    window.dispatchEvent(new Event(HISTORY_EVENT))
  }, [])

  const clear = useCallback(() => {
    clearDrawHistory()
    setHistory([])
    window.dispatchEvent(new Event(HISTORY_EVENT))
  }, [])

  const todayIds = useMemo(() => getTodayHistoryIds(history), [history])

  return { history, hydrated, todayIds, add, clear }
}
