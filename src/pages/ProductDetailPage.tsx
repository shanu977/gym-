import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageWrap } from '../components/PageShell'
import { ProductBreadcrumbs } from '../components/ProductBreadcrumbs'
import { ProductGallery } from '../components/ProductGallery'
import { ProductInformation } from '../components/ProductInformation'
import { ProductPurchasePanel } from '../components/ProductPurchasePanel'
import { ProductReviews } from '../components/ProductReviews'
import { RelatedProducts } from '../components/RelatedProducts'
import { products, productReviews } from '../data/siteData'

export function ProductDetailPage() {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)
  if (!product) return <PageWrap><div className="product-not-found"><span className="eyebrow">Store / 404</span><h1 className="display">Product not found.</h1><p>That piece of the edit has moved on, or the link is not quite right.</p><Link className="button-primary" to="/shop"><ArrowLeft size={16} /> Return to store</Link></div></PageWrap>
  const reviews = productReviews[product.id] ?? [{ reviewer: 'Iron Peak team', rating: product.rating, text: 'Demo feedback for this product will appear here as the store develops.', date: '18 Sep 2026' }]
  const related = products.filter((item) => item.id !== product.id && (item.category === product.category || item.tags.some((tag) => product.tags.includes(tag)))).slice(0, 3)
  const completeStack = products.filter((item) => item.id !== product.id && (item.category !== product.category || item.tags.includes('recovery'))).slice(0, 3)
  return <PageWrap><ProductBreadcrumbs category={product.category} name={product.name} /><div className="product-detail-hero"><ProductGallery product={product} /><div className="product-detail-copy"><span className="eyebrow">{product.brand}</span><h1 className="display">{product.name}</h1><p className="detail-short-description">{product.shortDescription}</p><div className="detail-rating"><span className="star-row">{[1, 2, 3, 4, 5].map((star) => <span key={star}>★</span>)}</span><strong>{product.rating}</strong><span>({product.reviewCount} reviews)</span></div><div className="detail-tags">{product.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div><ProductPurchasePanel product={product} /></div></div><ProductInformation product={product} /><ProductReviews product={product} reviews={reviews} /><RelatedProducts title="Complete Your Stack" products={completeStack} />{related.length > 0 && <RelatedProducts title="You May Also Like" products={related} />}<div className="detail-back-link"><Link className="text-link" to="/shop"><ArrowRight size={16} /> Back to the store</Link></div></PageWrap>
}
