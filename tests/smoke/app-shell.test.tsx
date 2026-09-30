import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Home from '@/app/page'

vi.mock('@/lib/dishes/repository', () => ({
  listActiveDishes: vi.fn().mockResolvedValue([]),
}))

describe('public app shell', () => {
  it('shows the product name, primary draw action, and category controls', async () => {
    render(await Home())

    expect(screen.getByText('Tối nay ăn gì')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mở hòm/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /nhóm món/i })).toBeInTheDocument()
  })
})
