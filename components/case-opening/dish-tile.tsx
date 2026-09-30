import type { DishRecord } from '@/lib/dishes/types'

type DishTileProps = {
  dish: Pick<DishRecord, 'id' | 'name' | 'imageUrl' | 'category'>
  featured?: boolean
}

const categoryLabels: Record<DishRecord['category'], string> = {
  RICE: 'Cơm',
  NOODLE: 'Mì',
  SOUP: 'Bún phở',
  SNACK: 'Ăn vặt',
  DRINK: 'Đồ uống',
  OTHER: 'Khác',
}

export default function DishTile({ dish, featured = false }: DishTileProps) {
  return (
    <article className={`dish-tile${featured ? ' dish-tile-featured' : ''}`}>
      <div className="dish-tile-image-wrap">
        <img className="dish-tile-image" src={dish.imageUrl} alt={dish.name} />
        <span className="dish-tile-category">{categoryLabels[dish.category]}</span>
      </div>
      <p className="dish-tile-name">{dish.name}</p>
    </article>
  )
}
