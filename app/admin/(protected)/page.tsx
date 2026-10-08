import Link from 'next/link'

export default function AdminPage() {
  return (
    <main className="admin-page">
      <p className="eyebrow">TRUNG TÂM QUẢN TRỊ</p>
      <h1>Pool món ăn</h1>
      <p className="admin-intro">Quản lý những món đang xuất hiện trong vòng quay cho các bữa ăn trong ngày.</p>
      <Link className="admin-primary-link admin-primary-link-large" href="/admin/dishes" prefetch>
        <span>Mở danh sách món</span><span aria-hidden="true">→</span>
      </Link>
    </main>
  )
}
