import type { ReactNode } from 'react'

export function PageWrap({ children }: { children: ReactNode }) {
  return <div className="page-wrap section"><div className="container">{children}</div></div>
}

export function PageIntro({ eyebrow, title, copy, image, children }: { eyebrow: string; title: ReactNode; copy: string; image: string; children: ReactNode }) {
  return <><section className="page-hero noise"><img className="image-cover" src={image} alt="" /><div className="hero-overlay" /><div className="container page-hero-content"><span className="eyebrow">{eyebrow}</span><h1 className="display">{title}</h1><p>{copy}</p></div></section><div className="container section">{children}</div></>
}
