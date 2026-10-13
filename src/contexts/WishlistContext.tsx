import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { products } from '../data/siteData'
import { addCustomerWishlistItem, getCustomerWishlist, removeCustomerWishlistItem } from '../services/api/customerWishlistApi'
import { useAuth } from './useAuth'

const STORAGE_KEY = 'iron-peak-wishlist'
export const isCustomerWishlistApiEnabled = import.meta.env.PROD || import.meta.env.VITE_CUSTOMER_WISHLIST_API === 'true'
type WishlistContextValue = { wishlist: string[]; count: number; isSaved: (productId: string) => boolean; toggleWishlist: (productId: string) => void; removeFromWishlist: (productId: string) => void; clearWishlist: () => void }
const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

function readWishlist() {
  if (typeof window === 'undefined') return []
  try { const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]'); if (!Array.isArray(parsed)) return []; return parsed.filter((id): id is string => typeof id === 'string' && products.some((product) => product.id === id)) } catch { return [] }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [wishlist, setWishlist] = useState<string[]>(readWishlist)
  const wishlistRef = useRef(wishlist)
  useEffect(() => { wishlistRef.current = wishlist }, [wishlist])
  useEffect(() => { if (!isCustomerWishlistApiEnabled) return; void getCustomerWishlist().then((next) => setWishlist(next.filter((id) => products.some((product) => product.id === id || product.slug === id)))).catch(() => undefined) }, [isAuthenticated])
  useEffect(() => { try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist)) } catch { /* localStorage can be unavailable in privacy-restricted browsers */ } }, [wishlist])
  const toggleWishlist = useCallback((productId: string) => {
    if (!products.some((product) => product.id === productId || product.slug === productId)) return
    const saved = wishlistRef.current.includes(productId)
    setWishlist((current) => saved ? current.filter((id) => id !== productId) : [...current, productId])
    if (isCustomerWishlistApiEnabled) {
      const request = saved ? removeCustomerWishlistItem(productId) : addCustomerWishlistItem(productId)
      void request.catch(() => setWishlist((current) => saved ? [...current, productId] : current.filter((id) => id !== productId)))
    }
  }, [])
  const removeFromWishlist = useCallback((productId: string) => { if (!wishlistRef.current.includes(productId)) return; setWishlist((current) => current.filter((id) => id !== productId)); if (isCustomerWishlistApiEnabled) void removeCustomerWishlistItem(productId).catch(() => setWishlist((current) => [...current, productId])) }, [])
  const clearWishlist = useCallback(() => { const current = wishlistRef.current; setWishlist([]); if (isCustomerWishlistApiEnabled) void Promise.all(current.map(removeCustomerWishlistItem)).catch(() => setWishlist(current)) }, [])
  const value = useMemo<WishlistContextValue>(() => ({ wishlist, count: wishlist.length, isSaved: (productId) => wishlist.includes(productId), toggleWishlist, removeFromWishlist, clearWishlist }), [wishlist, toggleWishlist, removeFromWishlist, clearWishlist])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export { WishlistContext }
