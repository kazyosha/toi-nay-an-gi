type WeightedItem = { id: string; weight: number }

export function selectWeightedDish<T extends WeightedItem>(items: ReadonlyArray<T>, random: () => number = Math.random): T {
  if (items.length === 0) {
    throw new Error('EMPTY_DISH_POOL')
  }

  const totalWeight = items.reduce((total, item) => total + item.weight, 0)
  const target = Math.min(Math.max(random(), 0), 0.999999999) * totalWeight
  let cursor = 0

  for (const item of items) {
    cursor += item.weight
    if (target < cursor) return item
  }

  return items[items.length - 1]
}

export function buildReelItems<T extends WeightedItem>(items: ReadonlyArray<T>, selectedId: string, length = 9): T[] {
  if (items.length === 0) throw new Error('EMPTY_DISH_POOL')
  if (length < 3 || length % 2 === 0) throw new Error('REEL_LENGTH_MUST_BE_ODD')

  const uniqueItems = Array.from(new Map(items.map((item) => [item.id, item])).values())
  const selected = uniqueItems.find((item) => item.id === selectedId)
  if (!selected) throw new Error('SELECTED_DISH_NOT_FOUND')

  const pointerIndex = Math.floor(length / 2)
  const alternatives = uniqueItems.filter((item) => item.id !== selectedId)
  return Array.from({ length }, (_, index) => {
    if (index === pointerIndex) return selected
    if (alternatives.length === 0) return selected

    const alternativeIndex = index < pointerIndex ? index : index - 1
    return alternatives[alternativeIndex % alternatives.length]
  })
}
