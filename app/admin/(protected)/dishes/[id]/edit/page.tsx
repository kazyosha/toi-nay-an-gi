import { notFound } from 'next/navigation'
import DishForm from '@/components/admin/dish-form'
import { getDish } from '@/lib/dishes/repository'

export const dynamic = 'force-dynamic'

export default async function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const dish = await getDish((await params).id)
  if (!dish) notFound()
  return <main className="admin-page"><p className="eyebrow">EDIT DROP</p><h1>Sửa món</h1><p className="admin-intro">Cập nhật thông tin và xác suất tương đối của món.</p><DishForm dish={dish} /></main>
}
