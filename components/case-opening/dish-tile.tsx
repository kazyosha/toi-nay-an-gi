import type { DishRecord } from '@/lib/dishes/types'
import DishImage from './dish-image'
import FavoriteToggle from './favorite-toggle'

type DishTileProps = {
  dish: Pick<DishRecord, 'id' | 'name' | 'imageUrl' | 'category'>
  featured?: boolean
  isFavorite?: boolean
  onFavoriteToggle?: () => void
}

const categoryLabels: Record<DishRecord['category'], string> = {
  RICE: 'Cơm',
  NOODLE: 'Mì',
  SOUP: 'Bún phở',
  SNACK: 'Ăn vặt',
  DRINK: 'Đồ uống',
  OTHER: 'Khác',
}

export default function DishTile({ dish, featured = false, isFavorite = false, onFavoriteToggle }: DishTileProps) {
  return (
    <article className={`dish-tile${featured ? ' dish-tile-featured' : ''}`}>
      <div className="dish-tile-image-wrap">
        <DishImage
          className="dish-tile-image"
          src={dish.imageUrl}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 96px, 128px"
        />
        <span className="dish-tile-category">{categoryLabels[dish.category]}</span>
        {onFavoriteToggle && <FavoriteToggle active={isFavorite} onToggle={onFavoriteToggle} label={dish.name} />}
      </div>
      <p className="dish-tile-name">{dish.name}</p>
    </article>
  )
}
