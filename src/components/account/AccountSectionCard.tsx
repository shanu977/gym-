import type { ReactNode } from 'react'

export function AccountSectionCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) { return <section className="account-card account-section-card"><span className="eyebrow">{eyebrow}</span><h2 className="display">{title}</h2>{children}</section> }
