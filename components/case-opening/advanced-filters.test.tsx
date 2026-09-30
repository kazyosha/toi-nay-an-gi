import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import AdvancedFilters from './advanced-filters'
import type { AdvancedFilterState } from './advanced-filters'

describe('AdvancedFilters', () => {
  it('emits vegetarian, price, prep time, meal time and spice changes', () => {
    const onChange = vi.fn()
    function Harness() {
      const [value, setValue] = useState<AdvancedFilterState>({ priceLevels: [], mealTimes: [] })
      return <AdvancedFilters value={value} onChange={(next) => { onChange(next); setValue(next) }} />
    }
    render(<Harness />)

    fireEvent.click(screen.getByText('Bộ lọc nâng cao'))
    fireEvent.click(screen.getByLabelText('Chỉ món chay'))
    fireEvent.click(screen.getByRole('button', { name: '$$' }))
    fireEvent.change(screen.getByLabelText('Thời gian tối đa'), { target: { value: '45' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buổi tối' }))
    fireEvent.change(screen.getByLabelText('Độ cay tối đa'), { target: { value: '1' } })

    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({
      isVegetarian: true,
      priceLevels: [2],
      maxPrepTimeMinutes: 45,
      mealTimes: ['DINNER'],
      maxSpiceLevel: 1,
    }))
  })
})
