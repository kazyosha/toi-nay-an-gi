'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { DishRecord } from '@/lib/dishes/types'
import DishTile from './dish-tile'

type DishReelProps = {
  items: Array<Pick<DishRecord, 'id' | 'name' | 'imageUrl' | 'category'>>
  selectedId: string
  isDrawing: boolean
}

export default function DishReel({ items, selectedId, isDrawing }: DishReelProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="reel-shell" aria-label="Reel món ăn">
      <div className="reel-pointer" aria-hidden="true" />
      <div className="reel-window">
        {items.length === 0 ? <div className="reel-empty">SELECT YOUR LOADOUT</div> : (
          <motion.div
            className="reel-track"
            animate={isDrawing && !shouldReduceMotion ? { x: ['0%', '-14%', '-7%'] } : { x: '0%' }}
            transition={isDrawing && !shouldReduceMotion ? { duration: 1.2, ease: [0.2, 0.8, 0.2, 1] } : { duration: 0.15 }}
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
