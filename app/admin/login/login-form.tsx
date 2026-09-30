'use client'

import { useActionState } from 'react'
import { loginAction, type LoginState } from './actions'

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {})

  return (
    <form className="admin-login-form" action={action}>
      <label htmlFor="password">Mật khẩu quản trị</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required />
      <button type="submit" disabled={pending}>{pending ? 'ĐANG KIỂM TRA...' : 'ĐĂNG NHẬP'}</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  )
}
