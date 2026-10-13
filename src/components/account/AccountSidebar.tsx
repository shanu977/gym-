import { ChevronRight, Crown, Dumbbell, LayoutDashboard, LogOut, MapPin, Settings, ShoppingBag, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAccount } from '../../contexts/useAccount'

export function AccountSidebar() {
  const { customer, resetProfile } = useAccount()
  const initials = `${customer.firstName[0] ?? ''}${customer.lastName[0] ?? ''}`
  const links = [
    { label: 'Overview', path: '/account', icon: LayoutDashboard, end: true },
    { label: 'Profile & details', path: '/account/profile', icon: UserRound },
    { label: 'Membership', path: '/account/membership', icon: Crown },
    { label: 'Trainer Bookings', path: '/account/trainer-bookings', icon: Dumbbell },
    { label: 'Orders', path: '/account/orders', icon: ShoppingBag },
    { label: 'Addresses', path: '/account/addresses', icon: MapPin },
    { label: 'Settings', path: '/account/settings', icon: Settings },
  ]
  return <aside className="account-sidebar"><div className="account-identity"><div className="account-avatar">{initials}</div><div><strong>{customer.firstName} {customer.lastName}</strong><span>{customer.email}</span></div></div><nav className="account-nav" aria-label="Account navigation">{links.map(({ label, path, icon: Icon, end }) => <NavLink key={path} to={path} end={end} className={({ isActive }) => isActive ? 'is-active' : ''}><Icon size={16} />{label}<ChevronRight size={14} /></NavLink>)}</nav><div className="account-demo-note"><span className="eyebrow">Demo account</span><p>Your profile is saved locally in this browser.</p><button type="button" onClick={resetProfile}><LogOut size={14} /> Reset demo profile</button></div></aside>
}
