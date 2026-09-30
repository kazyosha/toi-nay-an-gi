import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('public app shell', () => {
  it('shows the product name, primary draw action, and category controls', () => {
    render(<Home />)

    expect(screen.getByText('Tối nay ăn gì')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mở hòm/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /nhóm món/i })).toBeInTheDocument()
  })
})
