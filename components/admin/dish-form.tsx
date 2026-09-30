'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { DishCategory, DishRecord } from '@/lib/dishes/types'

type DishFormProps = { dish?: DishRecord | null }

const categoryOptions: Array<{ value: DishCategory; label: string }> = [
  { value: 'RICE', label: 'Cơm' }, { value: 'SOUP', label: 'Bún phở' }, { value: 'NOODLE', label: 'Mì' },
  { value: 'SNACK', label: 'Ăn vặt' }, { value: 'DRINK', label: 'Đồ uống' }, { value: 'OTHER', label: 'Khác' },
]

export default function DishForm({ dish }: DishFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: dish?.name ?? '', slug: dish?.slug ?? '', imageUrl: dish?.imageUrl ?? '', category: dish?.category ?? 'RICE' as DishCategory,
    description: dish?.description ?? '', spiceLevel: String(dish?.spiceLevel ?? 0), weight: String(dish?.weight ?? 1), isActive: dish?.isActive ?? true,
  })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  function update(key: string, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')

    const payload = { ...form, spiceLevel: Number(form.spiceLevel), weight: Number(form.weight) }
    const response = await fetch(dish ? `/api/admin/dishes/${dish.id}` : '/api/admin/dishes', {
      method: dish ? 'PATCH' : 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      setError(body.error || 'Không thể lưu món ăn.')
      setPending(false)
      return
    }

    router.push('/admin/dishes')
    router.refresh()
  }

  return (
    <form className="dish-form" onSubmit={submit}>
      <div className="form-grid">
        <label>Tên món<input value={form.name} onChange={(event) => update('name', event.target.value)} required /></label>
        <label>Slug<input value={form.slug} onChange={(event) => update('slug', event.target.value)} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required /></label>
        <label className="form-span-2">URL hình ảnh<input type="url" value={form.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} required /></label>
        <label>Nhóm món<select value={form.category} onChange={(event) => update('category', event.target.value)}>{categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label>Độ cay (0-3)<input type="number" min="0" max="3" value={form.spiceLevel} onChange={(event) => update('spiceLevel', event.target.value)} /></label>
        <label>Trọng số<input type="number" min="1" max="1000" value={form.weight} onChange={(event) => update('weight', event.target.value)} /></label>
        <label className="checkbox-label"><input type="checkbox" checked={form.isActive} onChange={(event) => update('isActive', event.target.checked)} /> Cho phép xuất hiện trong pool</label>
        <label className="form-span-2">Mô tả<textarea rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
      </div>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <div className="form-actions"><Link href="/admin/dishes" className="table-action">Hủy</Link><button className="admin-primary-link" type="submit" disabled={pending}>{pending ? 'ĐANG LƯU...' : 'LƯU MÓN'}</button></div>
    </form>
  )
}
