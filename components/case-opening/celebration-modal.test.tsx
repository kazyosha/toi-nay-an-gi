import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CelebrationModal from './celebration-modal'

const dish = {
  name: 'Bánh xèo',
  description: 'Vỏ bánh giòn, nhân tôm thịt.',
  imageUrl: 'https://images.example.com/banh-xeo.jpg',
  spiceLevel: 1,
}

describe('CelebrationModal', () => {
  it('celebrates the selected dish and can be dismissed', () => {
    const onClose = vi.fn()
    render(<CelebrationModal dish={dish} onClose={onClose} />)

    expect(screen.getByRole('dialog', { name: /chúc mừng/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bánh xèo' })).toBeInTheDocument()
    expect(screen.getAllByTestId('celebration-spark')).toHaveLength(24)

    fireEvent.click(screen.getByRole('button', { name: /^Đóng$/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
