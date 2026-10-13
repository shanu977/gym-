import type { ReactNode } from 'react'

type SectionHeadingProps = { eyebrow: string; title: ReactNode; copy?: string; align?: 'left' | 'center' }
export function SectionHeading({ eyebrow, title, copy, align = 'left' }: SectionHeadingProps) { return <div className={`section-heading ${align === 'center' ? 'section-heading-center' : ''}`}><span className="eyebrow">{eyebrow}</span><h2 className="display">{title}</h2>{copy && <p className="body-copy">{copy}</p>}</div> }
