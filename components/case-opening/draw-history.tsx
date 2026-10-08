'use client'

import type { DrawHistoryEntry } from '@/lib/history/types'
import FavoriteToggle from './favorite-toggle'

type DrawHistoryProps = {
  history: DrawHistoryEntry[]
  onClear: () => void
  favoriteIds?: string[]
  onFavoriteToggle?: (id: string) => void
}

export default function DrawHistory({ history, onClear, favoriteIds = [], onFavoriteToggle }: DrawHistoryProps) {
  if (history.length === 0) return null

  return (
    <section className="draw-history" aria-labelledby="draw-history-title">
      <div className="draw-history-heading"><div><p className="eyebrow">NHỮNG LẦN GẦN ĐÂY</p><h2 id="draw-history-title">Món đã quay</h2></div><button type="button" className="table-action" onClick={onClear}>Xóa lịch sử</button></div>
      <div className="draw-history-list">{history.slice(0, 6).map((entry) => <article className="draw-history-item" key={`${entry.dish.id}-${entry.drawnAt}`}><img src={entry.dish.imageUrl} alt="" /><div><strong>{entry.dish.name}</strong><span>{new Date(entry.drawnAt).toLocaleDateString('vi-VN')}</span></div>{onFavoriteToggle && <FavoriteToggle active={favoriteIds.includes(entry.dish.id)} onToggle={() => onFavoriteToggle(entry.dish.id)} label={entry.dish.name} />}</article>)}</div>
    </section>
  )
}
