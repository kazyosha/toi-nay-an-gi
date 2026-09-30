type ReelItem = { id: string }

export function getPointerIndex(items: ReadonlyArray<ReelItem>, selectedId: string): number {
  if (items.length === 0) return 0

  const centerIndex = Math.floor(items.length / 2)
  if (items[centerIndex]?.id === selectedId) return centerIndex

  return Math.max(items.findIndex((item) => item.id === selectedId), 0)
}
