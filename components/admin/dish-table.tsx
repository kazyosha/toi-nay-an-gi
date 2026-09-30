'use client'

import Link from 'next/link'
import type { DishRecord } from '@/lib/dishes/types'
import DeleteDishButton from './delete-dish-button'

const categoryLabels: Record<DishRecord['category'], string> = { RICE: 'Cơm', NOODLE: 'Mì', SOUP: 'Bún phở', SNACK: 'Ăn vặt', DRINK: 'Đồ uống', OTHER: 'Khác' }

export default function DishTable({ dishes }: { dishes: DishRecord[] }) {
  return (
    <div className="dish-table-wrap">
      <table className="dish-table">
        <thead><tr><th>Món ăn</th><th>Nhóm</th><th>Trọng số</th><th>Pool</th><th>Thao tác</th></tr></thead>
        <tbody>
          {dishes.map((dish) => <tr key={dish.id}>
            <td><div className="table-dish"><img src={dish.imageUrl} alt="" /><span>{dish.name}<small>{dish.slug}</small></span></div></td>
            <td>{categoryLabels[dish.category]}</td><td>{dish.weight}</td>
            <td><span className={`status-dot ${dish.isActive ? 'status-active' : 'status-inactive'}`}>{dish.isActive ? 'Đang bật' : 'Đã tắt'}</span></td>
            <td><div className="table-actions"><Link className="table-action" href={`/admin/dishes/${dish.id}/edit`}>Sửa</Link><DeleteDishButton id={dish.id} /></div></td>
          </tr>)}
        </tbody>
      </table>
      {dishes.length === 0 && <div className="admin-empty">Chưa có món nào trong database. Thêm món đầu tiên để mở pool.</div>}
    </div>
  )
}
