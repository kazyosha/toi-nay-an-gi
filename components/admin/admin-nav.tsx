import Link from 'next/link'
import { logoutAction } from '@/app/admin/login/actions'

export default function AdminNav() {
  return (
    <header className="admin-header">
      <Link href="/admin" className="admin-brand">FOOD CASE <span>CONTROL</span></Link>
      <nav aria-label="Điều hướng quản trị">
        <Link href="/admin/dishes">Món ăn</Link>
        <Link href="/">Xem trang chính</Link>
        <form action={logoutAction}><button type="submit">Đăng xuất</button></form>
      </nav>
    </header>
  )
}
