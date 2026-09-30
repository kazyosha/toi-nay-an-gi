import { redirect } from 'next/navigation'
import AdminNav from '@/components/admin/admin-nav'
import { hasAdminSession } from '@/lib/auth/admin-session'

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!(await hasAdminSession())) redirect('/admin/login')

  return <><AdminNav />{children}</>
}
