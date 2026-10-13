import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
export function ProductBreadcrumbs({ category, name }: { category: string; name: string }) { return <nav className="product-breadcrumbs" aria-label="Breadcrumb"><Link to="/shop">Shop</Link><ChevronRight size={14} /><Link to={`/shop?category=${encodeURIComponent(category)}`}>{category}</Link><ChevronRight size={14} /><span>{name}</span></nav> }
