import type { CartLine } from '../../contexts/CartContext'
import { apiRequest } from './client'

type CartItemResponse = { id: string; productId: string; productSlug?: string; variantId: string | null; variants: Record<string, string>; quantity: number; unitPricePaise: number; compareAtPricePaise: number | null; availableQuantity: number; available: boolean }
export type CustomerCartResponse = { id: string | null; items: CartItemResponse[]; itemCount: number; totalUnits: number; subtotalPaise: number; savingsPaise: number; shippingPaise: number; taxPaise: number; totalPaise: number }

function mapItem(item: CartItemResponse): CartLine {
  return { productId: item.productSlug ?? item.productId, variantId: Object.entries(item.variants).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => `${name}:${value}`).join('|') || 'default', variants: item.variants, quantity: item.quantity, serverItemId: item.id, unitPricePaise: item.unitPricePaise, compareAtPricePaise: item.compareAtPricePaise, availableQuantity: item.availableQuantity, available: item.available }
}

export async function getCustomerCart() { const response = await apiRequest<{ cart: CustomerCartResponse }>('/customer/cart'); return { ...response.cart, items: response.cart.items.map(mapItem) } }
export async function addCustomerCartItem(productId: string, variants: Record<string, string>, quantity: number) { await apiRequest('/customer/cart/items', { method: 'POST', body: JSON.stringify({ productId, variants, quantity }) }); return getCustomerCart() }
export async function updateCustomerCartItem(id: string, quantity: number) { await apiRequest(`/customer/cart/items/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }); return getCustomerCart() }
export async function removeCustomerCartItem(id: string) { await apiRequest<undefined>(`/customer/cart/items/${encodeURIComponent(id)}`, { method: 'DELETE' }); return getCustomerCart() }
export async function clearCustomerCart() { await apiRequest<undefined>('/customer/cart', { method: 'DELETE' }); return getCustomerCart() }
