import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { products } from '../data/siteData'
import { ApiError } from '../services/api/client'
import { addCustomerCartItem, clearCustomerCart, getCustomerCart, removeCustomerCartItem, updateCustomerCartItem } from '../services/api/customerCartApi'
import { useAuth } from './useAuth'
import { CART_STORAGE_KEY, getVariantId } from './cartUtils'

export type CartLine = { productId: string; variantId: string; variants: Record<string, string>; quantity: number; serverItemId?: string; unitPricePaise?: number; compareAtPricePaise?: number | null; availableQuantity?: number; available?: boolean }
export type CartContextValue = { items: CartLine[]; totalUnits: number; itemCount: number; addItem: (productId: string, variants?: Record<string, string>, quantity?: number) => void; updateQuantity: (productId: string, variantId: string, quantity: number) => void; removeItem: (productId: string, variantId: string) => void; clearCart: () => void }
const CartContext = createContext<CartContextValue | undefined>(undefined)
export const isCustomerCartApiEnabled = import.meta.env.PROD || import.meta.env.VITE_CUSTOMER_CART_API === 'true'

function validVariants(productId: string, variants: Record<string, string>) { const product = products.find((item) => item.id === productId || item.slug === productId); if (!product) return {}; return Object.fromEntries(product.variants.map((variant) => [variant.name, variants[variant.name] === variant.value ? variant.value : variant.value])) }
function maxQuantity(productId: string) { const product = products.find((item) => item.id === productId || item.slug === productId); return product?.stock === 'Out of stock' ? 0 : product?.stock === 'Low stock' ? 2 : 10 }
function readCart(): CartLine[] { if (typeof window === 'undefined') return []; try { const parsed: unknown = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? '[]'); if (!Array.isArray(parsed)) return []; return parsed.flatMap((item) => { if (!item || typeof item !== 'object') return []; const candidate = item as Partial<CartLine>; if (typeof candidate.productId !== 'string' || !products.some((product) => product.id === candidate.productId || product.slug === candidate.productId)) return []; const variants = validVariants(candidate.productId, candidate.variants && typeof candidate.variants === 'object' ? candidate.variants : {}); const quantity = Math.max(1, Math.min(maxQuantity(candidate.productId) || 1, Number(candidate.quantity) || 1)); return [{ productId: candidate.productId, variants, variantId: getVariantId(variants), quantity }] }) } catch { return [] } }
const unauthenticated = (error: unknown) => error instanceof ApiError && error.status === 401

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartLine[]>(readCart); const itemsRef = useRef(items)
  useEffect(() => { itemsRef.current = items }, [items])
  useEffect(() => { try { window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)) } catch { /* localStorage can be unavailable */ } }, [items])
  useEffect(() => { if (!isCustomerCartApiEnabled) return; void getCustomerCart().then((cart) => setItems(cart.items)).catch(() => undefined) }, [isAuthenticated])
  const addItem = useCallback((productId: string, variants: Record<string, string> = {}, quantity = 1) => {
    const product = products.find((item) => item.id === productId || item.slug === productId); if (!product || product.stock === 'Out of stock') return
    const safeVariants = validVariants(productId, variants); const variantId = getVariantId(safeVariants); const max = maxQuantity(productId); const previous = itemsRef.current; const existing = previous.find((item) => item.productId === productId && item.variantId === variantId); const next = existing ? previous.map((item) => item === existing ? { ...item, quantity: Math.min(max, item.quantity + Math.max(1, quantity)) } : item) : [...previous, { productId, variants: safeVariants, variantId, quantity: Math.min(max, Math.max(1, quantity)) }]
    setItems(next)
    if (isCustomerCartApiEnabled) void addCustomerCartItem(productId, safeVariants, Math.max(1, quantity)).then((cart) => setItems(cart.items)).catch((error) => { if (!unauthenticated(error)) setItems(previous) })
  }, [])
  const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    const previous = itemsRef.current; const item = previous.find((entry) => entry.productId === productId && entry.variantId === variantId); if (!item) return; const next = previous.map((entry) => entry === item ? { ...entry, quantity: Math.max(1, Math.min(maxQuantity(productId) || 1, quantity)) } : entry); setItems(next)
    if (isCustomerCartApiEnabled && item.serverItemId) void updateCustomerCartItem(item.serverItemId, quantity).then((cart) => setItems(cart.items)).catch((error) => { if (!unauthenticated(error)) setItems(previous) })
  }, [])
  const removeItem = useCallback((productId: string, variantId: string) => {
    const previous = itemsRef.current; const item = previous.find((entry) => entry.productId === productId && entry.variantId === variantId); if (!item) return; setItems(previous.filter((entry) => entry !== item));
    if (isCustomerCartApiEnabled && item.serverItemId) void removeCustomerCartItem(item.serverItemId).then((cart) => setItems(cart.items)).catch((error) => { if (!unauthenticated(error)) setItems(previous) })
  }, [])
  const clearCart = useCallback(() => { const previous = itemsRef.current; setItems([]); if (isCustomerCartApiEnabled && previous.some((item) => item.serverItemId)) void clearCustomerCart().then((cart) => setItems(cart.items)).catch((error) => { if (!unauthenticated(error)) setItems(previous) }) }, [])
  const value = useMemo<CartContextValue>(() => ({ items, totalUnits: items.reduce((total, item) => total + item.quantity, 0), itemCount: items.length, addItem, updateQuantity, removeItem, clearCart }), [items, addItem, updateQuantity, removeItem, clearCart])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export { CartContext }
