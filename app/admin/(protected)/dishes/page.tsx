import Link from 'next/link'
import { listDishes } from '@/lib/dishes/repository'
import DishTable from '@/components/admin/dish-table'

export const dynamic = 'force-dynamic'

export default async function AdminDishesPage() {
  const dishes = await listDishes({})

  return (
    <main className="admin-page">
      <div className="admin-page-heading"><div><p className="eyebrow">DANH SÁCH MÓN</p><h1>Món ăn</h1></div><Link className="admin-primary-link" href="/admin/dishes/new" prefetch><span aria-hidden="true">+</span><span>Thêm món</span></Link></div>
      <p className="admin-intro">Bật, tắt và cân chỉnh trọng số cho những món xuất hiện khi mở hòm.</p>
      <DishTable dishes={dishes} />
    </main>
  )
}
