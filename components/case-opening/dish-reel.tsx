'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
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
  const shellRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [targetX, setTargetX] = useState(0)
  const loopCount = 6
  const selectedIndex = Math.max(items.findIndex((item) => item.id === selectedId), 0)
  const repeatedItems = Array.from({ length: loopCount }, (_, loop) => items.map((dish, index) => ({ dish, key: `${dish.id}-${loop}-${index}` }))).flat()
  const targetIndex = Math.max(items.length * (loopCount - 1) + selectedIndex, 0)

  useLayoutEffect(() => {
    const shell = shellRef.current
    const track = trackRef.current
    const firstTile = track?.firstElementChild as HTMLElement | null
    if (!shell || !track || !firstTile || !items.length) return

    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0
    const step = firstTile.getBoundingClientRect().width + gap
    const centerOffset = (shell.getBoundingClientRect().width - firstTile.getBoundingClientRect().width) / 2
    setTargetX(centerOffset - targetIndex * step)
  }, [items.length, selectedId, targetIndex, rollKey])

  return (
    <div ref={shellRef} className="reel-shell" aria-label="Reel món ăn">
      <div className="reel-pointer" aria-hidden="true" />
      <div className="reel-window">
        {items.length === 0 ? <div className="reel-empty">SELECT YOUR LOADOUT</div> : (
          <motion.div
            key={rollKey}
            ref={trackRef}
            data-testid="dish-reel-track"
            className={`reel-track${rolling ? ' reel-track-rolling' : ''}`}
            initial={rolling && !shouldReduceMotion ? { x: 0 } : { x: targetX }}
            animate={{ x: targetX }}
            transition={rolling && !shouldReduceMotion ? { duration: 2.4, ease: [0.08, 0.72, 0.16, 1] } : { duration: 0.15 }}
          >
            {repeatedItems.map(({ dish, key }) => (
              <DishTile key={key} dish={dish} featured={!isDrawing && dish.id === selectedId} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
