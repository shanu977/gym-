import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { WishlistButton } from './WishlistButton'
import { AddToCartButton } from './AddToCartButton'

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=85'

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0
  return <article className="product-card store-product-card"><div className="product-image"><Link className="product-card-link" to={`/shop/${product.id}`} aria-label={`View ${product.name}`}><img className="image-cover" src={product.image} alt={product.name} onError={(e) => { const target = e.currentTarget; if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE }} /><div className="product-card-badges">{product.tag && <span>{product.tag}</span>}{product.stock === 'Low stock' && <span className="stock-badge">Low stock</span>}{product.stock === 'Out of stock' && <span className="stock-badge" style={{ background: '#7c2d12', color: '#fef2f2' }}>Out of stock</span>}</div></Link><WishlistButton productId={product.id} productName={product.name} variant="card" /></div><div className="product-info"><span className="eyebrow">{product.brand} / {product.category}</span><h3 className="display"><Link to={`/shop/${product.id}`}>{product.name}</Link></h3><p className="product-short-description">{product.shortDescription}</p><div className="product-rating"><span><Star size={13} fill="currentColor" /> {product.rating} <small>({product.reviewCount})</small></span><span className="stock-status">{product.stock}</span></div><div className="product-price"><strong>{money(product.price)}</strong>{product.compareAtPrice && <><del>{money(product.compareAtPrice)}</del><small>{discount}% off</small></>}</div><div className="product-card-actions"><Link className="button-ghost" to={`/shop/${product.id}`}>View product</Link><AddToCartButton product={product} /></div></div></article>
}
