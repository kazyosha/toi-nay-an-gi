import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DishReel from './dish-reel'

const dish = { id: 'pho', name: 'Phở bò', imageUrl: 'https://images.example.com/pho.jpg', category: 'SOUP' as const }

describe('DishReel', () => {
  it('marks a fresh draw as rolling so the track can ease into the result', async () => {
    render(<DishReel items={[dish]} selectedId="pho" isDrawing={false} rollKey="draw-1" />)

    await waitFor(() => expect(screen.getByTestId('dish-reel-track')).toHaveClass('reel-track-rolling'))
  })
})
