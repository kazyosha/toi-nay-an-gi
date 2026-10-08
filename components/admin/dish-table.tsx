'use client'

import { CaretLeft, CaretRight, MagnifyingGlass, X } from '@phosphor-icons/react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { dishCategories, type DishCategory, type DishRecord } from '@/lib/dishes/types'
import { useFavorites } from '@/lib/favorites/use-favorites'
import FavoriteToggle from '@/components/case-opening/favorite-toggle'
import DeleteDishButton from './delete-dish-button'

const categoryLabels: Record<DishRecord['category'], string> = { RICE: 'Cơm', NOODLE: 'Mì', SOUP: 'Bún phở', SNACK: 'Ăn vặt', DRINK: 'Đồ uống', OTHER: 'Khác' }

export default function DishTable({ dishes }: { dishes: DishRecord[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<DishCategory | ''>('')
  const [favoriteMode, setFavoriteMode] = useState(false)
  const [sort, setSort] = useState('updated-desc')
  const [page, setPage] = useState(1)
  const pageSize = 5
  const validDishIds = useMemo(() => dishes.map((dish) => dish.id), [dishes])
  const { favoriteIds, toggle: toggleFavorite, isFavorite } = useFavorites(validDishIds)

  const filteredDishes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi-VN')
    const result = dishes.filter((dish) => {
      if (category && dish.category !== category) return false
      if (favoriteMode && !favoriteIds.includes(dish.id)) return false
      if (!normalizedQuery) return true
      return `${dish.name} ${dish.slug}`.toLocaleLowerCase('vi-VN').includes(normalizedQuery)
    })

    return [...result].sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name, 'vi')
      if (sort === 'name-desc') return b.name.localeCompare(a.name, 'vi')
      if (sort === 'weight-desc') return b.weight - a.weight || a.name.localeCompare(b.name, 'vi')
      if (sort === 'status') return Number(b.isActive) - Number(a.isActive) || a.name.localeCompare(b.name, 'vi')
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [category, dishes, favoriteIds, favoriteMode, query, sort])

  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleDishes = filteredDishes.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="dish-inventory">
      <div className="dish-table-toolbar">
        <label className="admin-search">
          <MagnifyingGlass size={20} aria-hidden="true" />
          <span className="sr-only">Tìm món ăn</span>
          <input type="search" role="searchbox" placeholder="Tìm theo tên hoặc slug..." value={query} onChange={(event) => setQuery(event.target.value)} />
          {query && <button type="button" aria-label="Xóa tìm kiếm" onClick={() => setQuery('')}><X size={17} /></button>}
        </label>
        <label className="admin-sort">Sắp xếp
          <select aria-label="Sắp xếp" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="updated-desc">Mới cập nhật</option>
            <option value="name-asc">Tên A → Z</option>
            <option value="name-desc">Tên Z → A</option>
            <option value="weight-desc">Trọng số cao nhất</option>
            <option value="status">Đang bật trước</option>
          </select>
        </label>
        <label className="admin-sort admin-category-filter">Danh mục
          <select aria-label="Danh mục" value={category} onChange={(event) => { setCategory(event.target.value as DishCategory | ''); setPage(1) }}>
            <option value="">Tất cả danh mục</option>
            {dishCategories.map((value) => <option key={value} value={value}>{categoryLabels[value]}</option>)}
          </select>
        </label>
        <label className="admin-sort">Lọc món
          <select aria-label="Lọc món" value={favoriteMode ? 'favorites' : 'all'} onChange={(event) => { setFavoriteMode(event.target.value === 'favorites'); setPage(1) }}>
            <option value="all">Tất cả món</option>
            <option value="favorites">Món yêu thích ({favoriteIds.length})</option>
          </select>
        </label>
      </div>

      <div className="dish-table-summary"><span>{filteredDishes.length} món trong kho</span><span>Tối đa {pageSize} món / trang</span></div>
      <div className="dish-table-wrap">
      <table className="dish-table">
        <thead><tr><th>Món ăn</th><th>Nhóm</th><th>Trọng số</th><th>Pool</th><th>Thao tác</th></tr></thead>
        <tbody>
          {visibleDishes.map((dish) => <tr key={dish.id}>
            <td><div className="table-dish"><img src={dish.imageUrl} alt="" /><span>{dish.name}<small>{dish.slug}</small></span></div></td>
            <td>{categoryLabels[dish.category]}</td><td>{dish.weight}</td>
            <td><span className={`status-dot ${dish.isActive ? 'status-active' : 'status-inactive'}`}>{dish.isActive ? 'Đang bật' : 'Đã tắt'}</span></td>
            <td><div className="table-actions"><FavoriteToggle active={isFavorite(dish.id)} onToggle={() => toggleFavorite(dish.id)} label={dish.name} /><Link className="table-action" href={`/admin/dishes/${dish.id}/edit`}>Sửa</Link><DeleteDishButton id={dish.id} /></div></td>
          </tr>)}
        </tbody>
      </table>
      {filteredDishes.length === 0 && <div className="admin-empty">Không tìm thấy món phù hợp.</div>}
      </div>
      <div className="dish-table-pagination">
        <span>Trang {currentPage} / {totalPages}</span>
        <div>
          <button type="button" aria-label="Trang trước" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><CaretLeft size={18} /></button>
          <button type="button" aria-label="Trang sau" disabled={currentPage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}><CaretRight size={18} /></button>
        </div>
      </div>
    </div>
  )
}
