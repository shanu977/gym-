import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../types'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=85'

export function ProductGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0)
  const images = product.images.length ? product.images : [product.image]
  const move = (direction: number) => setSelected((current) => (current + direction + images.length) % images.length)
  return <div className="detail-gallery"><div className="detail-main-image"><img key={images[selected]} className="image-cover" src={images[selected]} alt={`${product.name} image ${selected + 1}`} onError={(e) => { const target = e.currentTarget; if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE }} />{images.length > 1 && <><button className="gallery-control gallery-prev" type="button" onClick={() => move(-1)} aria-label="Previous product image"><ChevronLeft size={19} /></button><button className="gallery-control gallery-next" type="button" onClick={() => move(1)} aria-label="Next product image"><ChevronRight size={19} /></button></>}</div><div className="gallery-thumbnails">{images.map((image, index) => <button className={selected === index ? 'is-active' : ''} type="button" key={image} onClick={() => setSelected(index)} aria-label={`Show product image ${index + 1}`}><img className="image-cover" src={image} alt="" onError={(e) => { const target = e.currentTarget; if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE }} /></button>)}</div></div>
}
