import Link from 'next/link'
import LoginForm from './login-form'

export default function AdminLoginPage() {
  return (
    <main className="admin-auth-page">
      <div className="admin-auth-card">
        <p className="eyebrow">CONTROL ROOM</p>
        <h1>Quản lý món ăn</h1>
        <p>Đăng nhập để cập nhật pool mở hòm.</p>
        <LoginForm />
        <Link href="/">Quay về trang mở hòm</Link>
      </div>
    </main>
  )
}
