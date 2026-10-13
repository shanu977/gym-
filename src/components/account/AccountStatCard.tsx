import type { LucideIcon } from 'lucide-react'

export function AccountStatCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: LucideIcon }) { return <article className="account-stat-card"><div className="account-stat-icon"><Icon size={18} /></div><span className="eyebrow">{label}</span><strong>{value}</strong><p>{detail}</p></article> }
