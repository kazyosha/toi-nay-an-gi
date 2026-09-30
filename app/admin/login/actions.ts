'use server'

import { redirect } from 'next/navigation'
import { clearAdminSession, createAdminSession } from '@/lib/auth/admin-session'

export type LoginState = { error?: string }

export async function loginAction(_previousState: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get('password')

  if (typeof password !== 'string' || !process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Mật khẩu quản trị không đúng.' }
  }

  await createAdminSession()
  redirect('/admin')
}

export async function logoutAction() {
  await clearAdminSession()
  redirect('/admin/login')
}
