import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CaseStage from './case-stage'

const dish = {
  id: 'pho',
  name: 'Phở bò',
  slug: 'pho-bo',
  imageUrl: 'https://images.example.com/pho.jpg',
  category: 'SOUP',
  description: 'Nước dùng thơm.',
  spiceLevel: 0,
  weight: 1,
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('CaseStage', () => {
  const initialDishes = [{ ...dish, category: 'SOUP' as const }]

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reelItems: Array.from({ length: 9 }, () => dish), selectedDish: dish }),
    }))
  })

  afterEach(() => vi.unstubAllGlobals())

  it('renders the idle case opener with category controls', () => {
    render(<CaseStage />)

    expect(screen.getByRole('heading', { name: /để chiếc hòm quyết định/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /nhóm món/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mở hòm/i })).toBeEnabled()
  })

  it('loads a visible preview strip on first render', async () => {
    render(<CaseStage />)

    await waitFor(() => expect(within(screen.getByLabelText('Reel món ăn')).getAllByRole('article').length).toBeGreaterThan(0))
    expect(fetch).toHaveBeenCalledWith('/api/draw', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ categories: [] }),
    }))
  })

  it('renders server-provided dishes without waiting for a client request', () => {
    render(<CaseStage initialDishes={initialDishes} />)

    expect(within(screen.getByLabelText('Reel món ăn')).getAllByRole('article').length).toBeGreaterThan(0)
  })

  it('shows loading then reveals the selected dish after a draw', async () => {
    render(<CaseStage />)
    fireEvent.click(screen.getByRole('button', { name: /mở hòm/i }))

    expect(screen.getByText(/đang quay/i)).toBeInTheDocument()

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Phở bò' })).toBeInTheDocument(), { timeout: 4000 })
    expect(screen.getByText('Nước dùng thơm.')).toBeInTheDocument()
  })

  it('sends selected categories to the draw endpoint', async () => {
    render(<CaseStage />)
    fireEvent.click(screen.getByRole('button', { name: 'Bún phở' }))
    fireEvent.click(screen.getByRole('button', { name: /mở hòm/i }))

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/draw', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ categories: ['SOUP'] }),
    })))
  })

  it('shows a contextual message when the pool is empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ code: 'EMPTY_DISH_POOL', message: 'Chưa có món phù hợp để mở hòm.' }),
    }))

    render(<CaseStage />)
    fireEvent.click(screen.getByRole('button', { name: /mở hòm/i }))

    await waitFor(() => expect(screen.getByText('Chưa có món phù hợp để mở hòm.')).toBeInTheDocument())
  })
})
