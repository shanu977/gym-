import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageWrap } from '../components/PageShell'
export function CheckoutPlaceholderPage() { return <PageWrap><div className="checkout-placeholder"><span className="eyebrow">The next step</span><h1 className="display">Checkout is coming next.</h1><p>Your training essentials are ready in the demo cart. Checkout, payments and order processing will be introduced in Phase 4E.</p><Link className="button-ghost" to="/cart"><ArrowLeft size={16} /> Return to cart</Link></div></PageWrap> }
