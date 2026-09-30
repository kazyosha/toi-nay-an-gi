'use client'

import type { DrawFilters, MealTime } from '@/lib/dishes/types'

type AdvancedFilterState = Pick<DrawFilters, 'isVegetarian' | 'priceLevels' | 'maxPrepTimeMinutes' | 'mealTimes' | 'maxSpiceLevel'>

type AdvancedFiltersProps = {
  value: AdvancedFilterState
  onChange: (value: AdvancedFilterState) => void
  disabled?: boolean
}

const mealTimeOptions: Array<{ value: MealTime; label: string }> = [
  { value: 'BREAKFAST', label: 'Buổi sáng' },
  { value: 'LUNCH', label: 'Buổi trưa' },
  { value: 'DINNER', label: 'Buổi tối' },
  { value: 'LATE_NIGHT', label: 'Đêm muộn' },
]

export default function AdvancedFilters({ value, onChange, disabled = false }: AdvancedFiltersProps) {
  function update(next: Partial<AdvancedFilterState>) {
    onChange({ ...value, ...next })
  }

  function togglePrice(price: number) {
    const priceLevels = value.priceLevels.includes(price)
      ? value.priceLevels.filter((item) => item !== price)
      : [...value.priceLevels, price].sort()
    update({ priceLevels })
  }

  function toggleMealTime(mealTime: MealTime) {
    const mealTimes = value.mealTimes.includes(mealTime)
      ? value.mealTimes.filter((item) => item !== mealTime)
      : [...value.mealTimes, mealTime]
    update({ mealTimes })
  }

  return (
    <details className="advanced-filter-panel">
      <summary>Bộ lọc nâng cao <span aria-hidden="true">⌄</span></summary>
      <div className="advanced-filter-grid">
        <label className="filter-check"><input type="checkbox" checked={value.isVegetarian === true} disabled={disabled} onChange={(event) => update({ isVegetarian: event.target.checked ? true : undefined })} /> Chỉ món chay</label>
        <label className="filter-select">Thời gian tối đa
          <select value={value.maxPrepTimeMinutes ?? ''} disabled={disabled} onChange={(event) => update({ maxPrepTimeMinutes: event.target.value ? Number(event.target.value) : undefined })}>
            <option value="">Mọi thời gian</option><option value="15">15 phút</option><option value="30">30 phút</option><option value="45">45 phút</option><option value="60">60 phút</option>
          </select>
        </label>
        <fieldset><legend>Mức giá</legend><div className="filter-choice-row">{[1, 2, 3].map((price) => <button key={price} type="button" className={`filter-choice${value.priceLevels.includes(price) ? ' filter-choice-active' : ''}`} aria-pressed={value.priceLevels.includes(price)} disabled={disabled} onClick={() => togglePrice(price)}>{'$'.repeat(price)}</button>)}</div></fieldset>
        <label className="filter-select">Độ cay tối đa
          <select value={value.maxSpiceLevel ?? ''} disabled={disabled} onChange={(event) => update({ maxSpiceLevel: event.target.value ? Number(event.target.value) : undefined })}>
            <option value="">Mọi độ cay</option><option value="0">Không cay</option><option value="1">Nhẹ</option><option value="2">Vừa</option><option value="3">Cay</option>
          </select>
        </label>
        <fieldset className="filter-meal-times"><legend>Buổi ăn</legend><div className="filter-choice-row filter-meal-row">{mealTimeOptions.map((option) => <button key={option.value} type="button" className={`filter-choice${value.mealTimes.includes(option.value) ? ' filter-choice-active' : ''}`} aria-pressed={value.mealTimes.includes(option.value)} disabled={disabled} onClick={() => toggleMealTime(option.value)}>{option.label}</button>)}</div></fieldset>
      </div>
    </details>
  )
}
