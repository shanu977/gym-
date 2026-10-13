import type { ReactNode } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AuthShell({ eyebrow, title, copy, children, footer }: { eyebrow: string; title: ReactNode; copy: string; children: ReactNode; footer: ReactNode }) {
  return <div className="auth-page"><div className="auth-visual noise"><div className="auth-visual-overlay" /><div className="auth-visual-copy"><span className="eyebrow">IRON PEAK / The work starts here</span><h2 className="display">Train with<br /><em>intention.</em></h2><p>One place for your training, your essentials and the standard you are building.</p></div><div className="auth-visual-stamp"><span>IRON PEAK</span><small>TRAIN · FUEL · TRANSFORM</small></div></div><main className="auth-panel"><Link to="/" className="auth-back"><ArrowLeft size={15} /> Back to website</Link><div className="auth-content"><span className="eyebrow">{eyebrow}</span><h1 className="display">{title}</h1><p className="auth-copy">{copy}</p>{children}{footer}<div className="auth-demo-note"><ShieldCheck size={14} /><span>Frontend demo only. No real account or password is created.</span></div></div></main></div>
}
