import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Membership } from '../types'
import { formatINR } from '../data/membershipData'

export function MembershipCard({ plan, cycle }: { plan: Membership; cycle: 'monthly' | 'yearly' }) { const price = cycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12); return <article className={`membership-card ${plan.popular ? 'is-popular' : ''}`}>{plan.popular && <span className="plan-badge">Most chosen</span>}<span className="eyebrow">{plan.name}</span><h3 className="display">{formatINR(price)}</h3><p className="membership-period">per month / billed {cycle === 'monthly' ? 'monthly' : 'yearly'}</p><p className="membership-description">{plan.shortDescription}</p>{cycle === 'yearly' && <span className="saving-line">Save {formatINR(plan.yearlySavings)} yearly</span>}<div className="membership-card-benefits">{plan.benefits.slice(0, 5).map((benefit) => <p key={benefit}><Check size={14} />{benefit}</p>)}</div><Link to={`/memberships/${plan.id}?cycle=${cycle}`} className={plan.popular ? 'button-primary' : 'button-ghost'}>Choose plan <ArrowRight size={15} /></Link></article> }
