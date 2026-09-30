import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DishReel from './dish-reel'

const dish = { id: 'pho', name: 'Phở bò', imageUrl: 'https://images.example.com/pho.jpg', category: 'SOUP' as const }

describe('DishReel', () => {
  it('marks a fresh draw as rolling so the track can ease into the result', async () => {
    render(<DishReel items={[dish]} selectedId="pho" isDrawing={false} rollKey="draw-1" />)

    await waitFor(() => expect(screen.getByTestId('dish-reel-track')).toHaveClass('reel-track-rolling'))
  })

  it('shows a center target while the reel is moving', () => {
    render(<DishReel items={[dish]} selectedId="pho" isDrawing rollKey="draw-rolling" />)

    expect(screen.getByTestId('reel-target-line')).toBeInTheDocument()
  })

  it('renders a long continuous strip instead of leaving empty reel space', () => {
    render(<DishReel items={[dish]} selectedId="pho" isDrawing={false} rollKey="draw-2" />)

    expect(screen.getAllByRole('article').length).toBeGreaterThan(3)
  })

  it('lazy-loads reel images so offscreen dishes do not block the first paint', () => {
    render(<DishReel items={[dish]} selectedId="pho" isDrawing={false} />)

    expect(screen.getAllByRole('img')[0]).toHaveAttribute('loading', 'lazy')
  })
})
