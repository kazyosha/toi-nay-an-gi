'use client'

import type { DrawHistoryEntry } from '@/lib/history/types'

type DrawHistoryProps = {
  history: DrawHistoryEntry[]
  onClear: () => void
}

export default function DrawHistory({ history, onClear }: DrawHistoryProps) {
  if (history.length === 0) return null

  return (
    <section className="draw-history" aria-labelledby="draw-history-title">
      <div className="draw-history-heading"><div><p className="eyebrow">NHỮNG LẦN GẦN ĐÂY</p><h2 id="draw-history-title">Món đã quay</h2></div><button type="button" className="table-action" onClick={onClear}>Xóa lịch sử</button></div>
      <div className="draw-history-list">{history.slice(0, 6).map((entry) => <article className="draw-history-item" key={`${entry.dish.id}-${entry.drawnAt}`}><img src={entry.dish.imageUrl} alt="" /><div><strong>{entry.dish.name}</strong><span>{new Date(entry.drawnAt).toLocaleDateString('vi-VN')}</span></div></article>)}</div>
    </section>
  )
}
