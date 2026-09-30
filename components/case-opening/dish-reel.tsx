'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { DishRecord } from '@/lib/dishes/types'
import DishTile from './dish-tile'
import { getPointerIndex } from './reel-target'

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
  const windowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [targetX, setTargetX] = useState(0)
  const loopCount = 6
  const selectedIndex = getPointerIndex(items, selectedId)
  const repeatedItems = Array.from({ length: loopCount }, (_, loop) => items.map((dish, index) => ({ dish, key: `${dish.id}-${loop}-${index}` }))).flat()
  const targetIndex = Math.max(items.length * (loopCount - 1) + selectedIndex, 0)
  // Keep the reel parked on the winning tile after the spin completes.
  // Resetting to 0 here makes the track snap back to its first item.
  const animationX = targetX

  useLayoutEffect(() => {
    const window = windowRef.current
    const track = trackRef.current
    const targetTile = track?.children[targetIndex] as HTMLElement | undefined
    if (!window || !track || !targetTile || !items.length) return

    const windowRect = window.getBoundingClientRect()
    const targetRect = targetTile.getBoundingClientRect()
    const targetCenter = targetRect.left + targetRect.width / 2
    const windowCenter = windowRect.left + windowRect.width / 2
    setTargetX(windowCenter - targetCenter)
  }, [items.length, selectedId, targetIndex, rollKey])

  return (
    <div ref={shellRef} className="reel-shell" aria-label="Reel món ăn">
      <div className="reel-pointer" aria-hidden="true" />
      <div ref={windowRef} className={`reel-window${rolling ? ' reel-window-rolling' : ''}`}>
        <div className="reel-target-line" data-testid="reel-target-line" aria-hidden="true" />
        {items.length === 0 ? <div className="reel-empty">SELECT YOUR LOADOUT</div> : (
          <motion.div
            key={rollKey}
            ref={trackRef}
            data-testid="dish-reel-track"
            className={`reel-track${rolling ? ' reel-track-rolling' : ''}`}
            initial={{ x: 0 }}
            animate={{ x: animationX }}
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
