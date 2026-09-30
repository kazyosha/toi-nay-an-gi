import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DishTable from './dish-table'

const dishes = Array.from({ length: 6 }, (_, index) => ({
  id: `dish-${index}`,
  name: index === 5 ? 'Phở bò' : `Món ${index + 1}`,
  slug: `mon-${index + 1}`,
  imageUrl: `https://images.example.com/${index}.jpg`,
  category: index === 5 ? 'SOUP' as const : 'RICE' as const,
  description: null,
  spiceLevel: 0,
  weight: index + 1,
  isVegetarian: false,
  priceLevel: 1,
  prepTimeMinutes: 30,
  mealTimes: ['DINNER' as const],
  isActive: index % 2 === 0,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
}))

describe('DishTable', () => {
  it('shows five dishes per page and supports search and pagination', () => {
    render(<DishTable dishes={dishes} />)

    expect(screen.getAllByRole('row')).toHaveLength(6)
    expect(screen.getByText('Trang 1 / 2')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Phở' } })
    expect(screen.getAllByRole('row')).toHaveLength(2)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Trang sau' }))
    expect(screen.getByText('Phở bò')).toBeInTheDocument()
  })

  it('sorts by the selected field', () => {
    render(<DishTable dishes={dishes} />)

    fireEvent.change(screen.getByLabelText('Sắp xếp'), { target: { value: 'weight-desc' } })
    const rows = screen.getAllByRole('row')
    expect(rows[1]).toHaveTextContent('Phở bò')
  })

  it('filters dishes by category without reloading the list', () => {
    render(<DishTable dishes={dishes} />)

    fireEvent.change(screen.getByLabelText('Danh mục'), { target: { value: 'SOUP' } })

    expect(screen.getAllByRole('row')).toHaveLength(2)
    expect(screen.getByText('Phở bò')).toBeInTheDocument()
    expect(screen.getByText('1 món trong kho')).toBeInTheDocument()
  })
})
