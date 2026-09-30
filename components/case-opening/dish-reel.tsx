'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { DishRecord } from '@/lib/dishes/types'
import DishTile from './dish-tile'

type DishReelProps = {
  items: Array<Pick<DishRecord, 'id' | 'name' | 'imageUrl' | 'category'>>
  selectedId: string
  isDrawing: boolean
  rollKey?: string
}

export default function DishReel({ items, selectedId, isDrawing, rollKey = '' }: DishReelProps) {
  const shouldReduceMotion = useReducedMotion()
  const rolling = isDrawing || Boolean(rollKey)

  return (
    <div className="reel-shell" aria-label="Reel món ăn">
      <div className="reel-pointer" aria-hidden="true" />
      <div className="reel-window">
        {items.length === 0 ? <div className="reel-empty">SELECT YOUR LOADOUT</div> : (
          <motion.div
            key={rollKey}
            data-testid="dish-reel-track"
            className={`reel-track${rolling ? ' reel-track-rolling' : ''}`}
            initial={rolling && !shouldReduceMotion ? { x: '9%' } : { x: '0%' }}
            animate={rolling && !shouldReduceMotion ? { x: ['9%', '-88%', '-58%'] } : { x: '0%' }}
            transition={rolling && !shouldReduceMotion ? { duration: 1.5, times: [0, 0.7, 1], ease: ['easeIn', 'linear', [0.16, 1, 0.3, 1]] } : { duration: 0.2 }}
          >
            {items.map((dish, index) => (
              <DishTile key={`${dish.id}-${index}`} dish={dish} featured={!isDrawing && dish.id === selectedId} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
