import { Check, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../types'
import { useCart } from '../contexts/useCart'

export function AddToCartButton({ product, variants, quantity = 1, compact = false }: { product: Product; variants?: Record<string, string>; quantity?: number; compact?: boolean }) { const { addItem } = useCart(); const [added, setAdded] = useState(false); const disabled = product.stock === 'Out of stock'; const add = () => { addItem(product.id, variants, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 2200) }; return <button className={compact ? 'related-add-button' : 'button-primary'} type="button" disabled={disabled} onClick={add}>{added ? <><Check size={15} /> Added</> : <><ShoppingBag size={15} /> {disabled ? 'Out of stock' : 'Add to Cart'}</>}</button> }
