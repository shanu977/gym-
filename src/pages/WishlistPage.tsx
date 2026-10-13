import { ArrowRight, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageWrap } from '../components/PageShell'
import { ProductGrid } from '../components/ProductGrid'
import { products } from '../data/siteData'
import { useWishlist } from '../contexts/useWishlist'

export function WishlistPage() {
  const { wishlist, count } = useWishlist()
  const savedProducts = wishlist.map((id) => products.find((product) => product.id === id)).filter((product) => product !== undefined)
  return <PageWrap><section className="wishlist-hero"><div><span className="eyebrow">Your edit / Saved products</span><h1 className="display">Saved For Your <em>Journey.</em></h1><p>Keep the products you're considering close at hand.</p></div><div className="wishlist-count"><Heart size={18} /><strong>{count}</strong><span>{count === 1 ? 'saved piece' : 'saved pieces'}</span></div></section>{savedProducts.length > 0 ? <><div className="wishlist-toolbar"><span className="eyebrow">Your considered edit</span><p>Current availability is reflected from the store catalog.</p></div><ProductGrid products={savedProducts} /><p className="wishlist-cart-note">Add to Cart is coming next. Your saved products are safe here while you decide.</p></> : <div className="wishlist-empty"><div className="empty-heart"><Heart size={25} /></div><span className="eyebrow">A little room to choose</span><h2 className="display">Nothing saved yet.</h2><p>Tap the heart on any product that feels right for your training journey. It will stay here for your next visit.</p><Link className="button-primary" to="/shop">Explore the Store <ArrowRight size={16} /></Link></div>}</PageWrap>
}
