import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MembershipCard } from '../components/MembershipCard'
import { MembershipComparison } from '../components/MembershipComparison'
import { MembershipToggle } from '../components/MembershipToggle'
import { SectionHeading } from '../components/SectionHeading'
import { PageWrap } from '../components/PageShell'
import { memberships } from '../data/membershipData'

export function MembershipsPage() { const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly'); return <div className="membership-listing"><section className="membership-hero"><div className="membership-hero-image"><img className="image-cover" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=85" alt="Athletes training on the Iron Peak floor" /></div><div className="hero-overlay" /><div className="container membership-hero-content"><span className="eyebrow">Memberships / Your next chapter</span><h1 className="display">Choose your<br /><em>commitment.</em></h1><p>Build a training practice around the way you want to move, grow and live.</p></div></section><PageWrap><div className="membership-toolbar"><SectionHeading eyebrow="Find your standard" title="Made for the long game." copy="Every plan gives you a place to train. Choose the level of support that keeps you moving forward." /><MembershipToggle value={cycle} onChange={setCycle} /></div><div className="membership-grid">{memberships.map((plan) => <MembershipCard key={plan.id} plan={plan} cycle={cycle} />)}</div><div className="comparison-section"><SectionHeading eyebrow="At a glance" title="Compare your access." copy="A clear view of what is included at every level." /><MembershipComparison plans={memberships} /></div><div className="membership-note"><span className="eyebrow">Need a little guidance?</span><p>Tell us where you are and we will help you find the right place to start.</p><Link className="text-link" to="/find-trainer">Find your fit <ArrowRight size={16} /></Link></div></PageWrap></div> }
