export const REEL_STEADY_MS = 5000
export const REEL_DECELERATION_MS = 3000
export const REEL_SPIN_DURATION_MS = REEL_STEADY_MS + REEL_DECELERATION_MS

// The first five seconds cover 5/6 of the distance. The final 1/6
// decelerates for three seconds, so speed remains continuous at the join.
export function getReelKeyframes(targetX: number): [number, number, number] {
  return [0, targetX * (5 / 6), targetX]
}
