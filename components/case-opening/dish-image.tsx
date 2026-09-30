import Image, { type ImageProps } from 'next/image'

const OPTIMIZED_HOSTS = ['images.unsplash.com']

export function canOptimizeDishImage(src: string) {
  try {
    const url = new URL(src)
    return url.protocol === 'https:' && (
      OPTIMIZED_HOSTS.includes(url.hostname) || url.hostname.endsWith('.public.blob.vercel-storage.com')
    )
  } catch {
    return false
  }
}

type DishImageProps = Pick<ImageProps, 'alt' | 'className' | 'fill' | 'height' | 'sizes' | 'width'> & {
  src: string
}

export default function DishImage({ src, alt, className, ...props }: DishImageProps) {
  if (canOptimizeDishImage(src)) {
    return <Image src={src} alt={alt} className={className} loading="lazy" {...props} />
  }

  return <img src={src} alt={alt} className={className} loading="lazy" {...props} />
}
