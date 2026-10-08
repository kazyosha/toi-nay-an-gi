'use client'

import { Sparkle, X } from '@phosphor-icons/react'
import { useEffect, type CSSProperties } from 'react'
import type { DishRecord } from '@/lib/dishes/types'
import { playApplauseSound, playCelebrationSound } from '@/lib/audio/celebration-sound'
import DishImage from './dish-image'

type CelebrationDish = Pick<DishRecord, 'name' | 'description' | 'imageUrl' | 'spiceLevel'>

type CelebrationModalProps = {
  dish: CelebrationDish
  onClose: () => void
}

const sparkIndexes = Array.from({ length: 12 }, (_, index) => index)

export default function CelebrationModal({ dish, onClose }: CelebrationModalProps) {
  useEffect(() => {
    playCelebrationSound()
    playApplauseSound()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="celebration-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="celebration-modal" role="dialog" aria-modal="true" aria-label="Chúc mừng món ăn được chọn">
        <div className="celebration-fireworks" aria-hidden="true">
          {[0, 1].map((burst) => (
            <div className={`celebration-burst celebration-burst-${burst + 1}`} key={burst}>
              {sparkIndexes.map((index) => (
                <span
                  className="celebration-spark"
                  data-testid="celebration-spark"
                  key={index}
                  style={{ '--i': index } as CSSProperties}
                />
              ))}
            </div>
          ))}
        </div>

        <button type="button" className="celebration-close" aria-label="Đóng lời chúc mừng" onClick={onClose}>
          <X size={18} weight="bold" aria-hidden="true" />
        </button>
        <div className="celebration-icon"><Sparkle size={26} weight="fill" aria-hidden="true" /></div>
        <p className="celebration-kicker">MỞ HÒM // MÓN TRÚNG</p>
        <p className="celebration-title">Chúc mừng!</p>
        <DishImage src={dish.imageUrl} alt={dish.name} className="celebration-image" width={150} height={150} />
        <h2>{dish.name}</h2>
        <p className="celebration-description">{dish.description || 'Một lựa chọn đáng thử cho bữa ăn này.'}</p>
        <button type="button" className="primary-button celebration-action" onClick={onClose}>Đóng</button>
      </section>
    </div>
  )
}
