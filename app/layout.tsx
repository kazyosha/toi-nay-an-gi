import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tối nay ăn gì',
  description: 'Mở hòm để chọn món cho bữa ăn trong ngày.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
