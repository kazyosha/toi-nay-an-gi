'use client'

import type { DishCategory } from '@/lib/dishes/types'

type CategoryFilterProps = {
  selected: DishCategory[]
  onChange: (categories: DishCategory[]) => void
}

const options: Array<{ label: string; value?: DishCategory }> = [
  { label: 'Tất cả' },
  { label: 'Cơm', value: 'RICE' },
  { label: 'Bún phở', value: 'SOUP' },
  { label: 'Mì', value: 'NOODLE' },
  { label: 'Ăn vặt', value: 'SNACK' },
  { label: 'Đồ uống', value: 'DRINK' },
]

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="category-filter" role="group" aria-label="Nhóm món">
      {options.map((option) => {
        const value = option.value
        const isAll = value === undefined
        const isSelected = isAll ? selected.length === 0 : selected.includes(value)

        return (
          <button
            type="button"
            key={option.label}
            className={`category-button${isSelected ? ' category-button-active' : ''}`}
            aria-pressed={isSelected}
            onClick={() => {
              if (value === undefined) {
                onChange([])
                return
              }

              onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value])
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
