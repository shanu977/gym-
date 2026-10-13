import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { WishlistButton } from './WishlistButton'
import { AddToCartButton } from './AddToCartButton'
const money = (value: number) => `₹${value.toLocaleString('en-IN')}`
export function RelatedProducts({ title, products }: { title: string; products: Product[] }) { return <section className="related-products"><div className="related-heading"><div><span className="eyebrow">Continue the edit</span><h2 className="display">{title}</h2></div><Link className="text-link" to="/shop">View all <ArrowUpRight size={15} /></Link></div><div className="related-grid">{products.map((product) => <article key={product.id} className="related-card"><Link to={`/shop/${product.id}`}><div className="related-image"><img className="image-cover" src={product.image} alt={product.name} /></div><span className="eyebrow">{product.brand}</span><h3 className="display">{product.name}</h3><strong>{money(product.price)}</strong></Link><div className="related-card-actions"><WishlistButton productId={product.id} productName={product.name} variant="card" /><AddToCartButton product={product} compact /></div></article>)}</div></section> }
