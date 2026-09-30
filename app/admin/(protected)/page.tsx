import Link from 'next/link'

export default function AdminPage() {
  return (
    <main className="admin-page">
      <p className="eyebrow">CONTROL ROOM</p>
      <h1>Pool món ăn</h1>
      <p className="admin-intro">Quản lý những món đang xuất hiện trong vòng quay tối nay.</p>
      <Link className="admin-primary-link" href="/admin/dishes">Mở danh sách món</Link>
    </main>
  )
}
