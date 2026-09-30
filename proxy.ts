import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const hasCookie = Boolean(request.cookies.get('food-case-admin')?.value)
  const isLogin = request.nextUrl.pathname === '/admin/login'
  const isApi = request.nextUrl.pathname.startsWith('/api/admin')

  if (!hasCookie && !isLogin) {
    if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
