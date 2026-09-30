'use client'

import { useState } from 'react'

export default function DeleteDishButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false)

  async function remove() {
    if (!window.confirm('Xóa món này khỏi database?')) return
    setPending(true)
    await fetch(`/api/admin/dishes/${id}`, { method: 'DELETE' })
    window.location.reload()
  }

  return <button type="button" className="table-action table-action-danger" onClick={remove} disabled={pending}>{pending ? 'ĐANG XÓA' : 'Xóa'}</button>
}
