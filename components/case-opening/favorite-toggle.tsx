'use client'

import { Heart } from '@phosphor-icons/react'

type FavoriteToggleProps = {
  active: boolean
  onToggle: () => void
  label: string
}

export default function FavoriteToggle({ active, onToggle, label }: FavoriteToggleProps) {
  return <button type="button" className={`favorite-toggle${active ? ' favorite-toggle-active' : ''}`} aria-label={active ? `Bỏ yêu thích ${label}` : `Thêm yêu thích ${label}`} aria-pressed={active} onClick={(event) => { event.stopPropagation(); onToggle() }}><Heart size={16} weight={active ? 'fill' : 'regular'} aria-hidden="true" /></button>
}
