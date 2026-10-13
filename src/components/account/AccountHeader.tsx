import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAccount } from '../../contexts/useAccount'
import type { ReactNode } from 'react'

export function AccountHeader({ eyebrow, title, copy, action }: { eyebrow: string; title: ReactNode; copy: string; action?: { label: string; to: string } }) {
  const { customer } = useAccount()
  return <div className="account-header"><div><span className="eyebrow">{eyebrow}</span><h1 className="display">{title}</h1><p>{copy}</p></div>{action && <Link className="button-primary" to={action.to}>{action.label}<ArrowRight size={15} /></Link>}<span className="account-header-mark">{customer.firstName.slice(0, 1)}</span></div>
}
