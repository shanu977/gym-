import { LogOut, Menu, Moon, Sun, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BrandIcon } from './BrandIcon'
import { navItems } from '../data/siteData'
import { useWishlist } from '../contexts/useWishlist'
import { useCart } from '../contexts/useCart'
import { useAccount } from '../contexts/useAccount'
import { useAuth } from '../contexts/useAuth'
import { useTheme } from '../contexts/useTheme'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { count } = useWishlist()
  const { totalUnits } = useCart()
  const { customer } = useAccount()
  const { isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const close = () => setOpen(false)
  const signOut = () => { close(); logout(); navigate('/') }
  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  useEffect(() => {
    if (!open) return
    document.body.classList.add('nav-open')
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.classList.remove('nav-open'); window.removeEventListener('keydown', onKey) }
  }, [open])

  return <header className="navbar"><div className="container nav-inner"><Link to="/" className="wordmark" onClick={close}><span className="wordmark-brand"><BrandIcon size={24} /><span>IRON PEAK</span></span><small>FITNESS / EST. 2024</small></Link><nav id="site-menu" className={`nav-links ${open ? 'is-open' : ''}`}>{navItems.map((item) => <NavLink key={item.path} to={item.path} onClick={close}>{item.label}</NavLink>)}<NavLink className="nav-wishlist" to="/wishlist" onClick={close}>Wishlist {count > 0 && <span>{count}</span>}</NavLink><NavLink className="nav-cart" to="/cart" onClick={close}>Cart {totalUnits > 0 && <span aria-label={`${totalUnits} items in cart`}>{totalUnits}</span>}</NavLink>{isAuthenticated ? <><NavLink className="nav-account" to="/account" onClick={close}><span className="nav-avatar">{customer.firstName[0]}</span>{customer.firstName}</NavLink><button className="nav-logout" type="button" onClick={signOut}><LogOut size={14} /> Logout</button></> : <><NavLink className="nav-login" to="/login" onClick={close}><UserRound size={14} /> Login</NavLink><Link className="nav-signup" to="/signup" onClick={close}>Sign up</Link></>}<Link to="/contact" className="nav-cta" onClick={close}>Start your journey <span>→</span></Link></nav><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button><button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-controls="site-menu" aria-expanded={open}>{open ? <X size={22} /> : <Menu size={22} />}</button></div></header>
}
