import { Check, ShoppingBag, Zap } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../types'
import { QuantitySelector } from './QuantitySelector'
import { ProductVariantSelector } from './ProductVariantSelector'
import { WishlistButton } from './WishlistButton'
import { useCart } from '../contexts/useCart'

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`
export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState('')
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => Object.fromEntries(product.variants.map((variant) => [variant.name, variant.value])))
  const { addItem } = useCart()
  const max = product.stock === 'Low stock' ? 2 : product.stock === 'Out of stock' ? 0 : 10
  const notify = (message: string) => { setFeedback(message); window.setTimeout(() => setFeedback(''), 2800) }
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0
  const addToCart = () => { addItem(product.id, selectedVariants, quantity); notify(`${product.name} added to cart`) }
  return <section className="purchase-panel"><div className="purchase-price"><strong>{money(product.price)}</strong>{product.compareAtPrice && <><del>{money(product.compareAtPrice)}</del><small className="purchase-discount">{discount}% off</small></>}</div><div className="purchase-stock"><span className={`stock-dot ${product.stock === 'Out of stock' ? 'is-out' : ''}`} /> {product.stock}</div>{product.variants.length > 0 && <ProductVariantSelector variants={product.variants} onChange={setSelectedVariants} />}<div className="purchase-row"><div><span className="purchase-label">Quantity</span><QuantitySelector value={quantity} onChange={setQuantity} max={max || 1} /></div><span className="purchase-total">{money(product.price * quantity)}</span></div><div className="purchase-actions"><button className="button-primary" type="button" disabled={!max} onClick={addToCart}><ShoppingBag size={16} /> Add to Cart</button><button className="button-ghost" type="button" disabled={!max} onClick={() => notify('Buy Now is a demo action for this phase')}><Zap size={15} /> Buy Now</button></div><WishlistButton productId={product.id} productName={product.name} />{feedback && <div className="purchase-feedback" role="status"><Check size={15} /> {feedback}</div>}<p className="purchase-note">UI preview only. No order, payment or persistent cart is created.</p></section>
}
