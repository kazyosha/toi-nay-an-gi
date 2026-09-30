import { ArrowClockwise, Fire } from '@phosphor-icons/react'
import type { DishRecord } from '@/lib/dishes/types'
import DishImage from './dish-image'

type RevealPanelProps = {
  dish: Pick<DishRecord, 'name' | 'description' | 'imageUrl' | 'spiceLevel'> | null
  onDrawAgain: () => void
}

export default function RevealPanel({ dish, onDrawAgain }: RevealPanelProps) {
  if (!dish) return null

  return (
    <section className="reveal-panel" aria-live="polite" aria-label="Món được chọn">
      <div className="reveal-label">MÓN TRÚNG HÔM NAY</div>
      <div className="reveal-content">
        <DishImage src={dish.imageUrl} alt={dish.name} className="reveal-image" width={600} height={600} sizes="(max-width: 640px) 100vw, 150px" />
        <div>
          <p className="reveal-kicker">ĐÃ MỞ HÒM</p>
          <h2>{dish.name}</h2>
          <p className="reveal-description">{dish.description || 'Một lựa chọn đáng thử cho tối nay.'}</p>
          {dish.spiceLevel > 0 && (
            <p className="spice-level" aria-label={`Độ cay ${dish.spiceLevel} trên 3`}>
              {Array.from({ length: dish.spiceLevel }).map((_, index) => <Fire key={index} weight="fill" aria-hidden="true" />)}
              Cay cấp {dish.spiceLevel}
            </p>
          )}
        </div>
      </div>
      <button type="button" className="secondary-button" onClick={onDrawAgain}>
        <ArrowClockwise size={18} weight="bold" aria-hidden="true" />
        Mở lượt khác
      </button>
    </section>
  )
}
