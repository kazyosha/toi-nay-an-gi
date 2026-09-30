'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { DishRecord } from '@/lib/dishes/types'
import DishTile from './dish-tile'
import { getPointerIndex } from './reel-target'
import { getReelKeyframes, REEL_SPIN_DURATION_MS } from './reel-motion'

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
  const repeatedItems = useMemo(
    () => Array.from({ length: loopCount }, (_, loop) => items.map((dish, index) => ({ dish, key: `${dish.id}-${loop}-${index}` }))).flat(),
    [items],
  )
  const targetIndex = Math.max(items.length * (loopCount - 1) + selectedIndex, 0)
  // Keep the reel parked on the winning tile after the spin completes.
  // Resetting to 0 here makes the track snap back to its first item.
  const animationX = targetX
  const spinKeyframes = useMemo(() => getReelKeyframes(animationX), [animationX])

  useLayoutEffect(() => {
    const window = windowRef.current
    const track = trackRef.current
    const targetTile = track?.children[targetIndex] as HTMLElement | undefined
    if (!window || !track || !targetTile || !items.length) return

    // Use layout coordinates rather than getBoundingClientRect: the latter
    // includes the current transform and would recalculate the target as 0
    // when the animation switches from drawing to revealed.
    const targetCenter = targetTile.offsetLeft + targetTile.offsetWidth / 2
    const windowCenter = window.clientWidth / 2
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
            initial={{ x: rolling ? 0 : animationX }}
            animate={{ x: rolling && !shouldReduceMotion ? spinKeyframes : animationX }}
            transition={rolling && !shouldReduceMotion ? {
              duration: REEL_SPIN_DURATION_MS / 1000,
              ease: ['linear', [0.33, 1, 0.68, 1]],
              times: [0, 0.625, 1],
            } : { duration: 0.15 }}
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
