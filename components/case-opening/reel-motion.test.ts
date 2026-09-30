import { describe, expect, it } from 'vitest'
import { REEL_DECELERATION_MS, REEL_SPIN_DURATION_MS, getReelKeyframes } from './reel-motion'

describe('reel motion timing', () => {
  it('runs at a steady pace for five seconds, then decelerates for three seconds', () => {
    expect(REEL_SPIN_DURATION_MS).toBe(8000)
    expect(REEL_DECELERATION_MS).toBe(3000)
  })

  it('keeps the motion continuous at the deceleration boundary', () => {
    expect(getReelKeyframes(-6000)).toEqual([0, -5000, -6000])
  })
})
