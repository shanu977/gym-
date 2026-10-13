import { apiRequest } from './client'

type WishlistItemResponse = { id: string; productId: string; productSlug?: string; createdAt: string }
const keyFor = (item: WishlistItemResponse) => item.productSlug ?? item.productId

export async function getCustomerWishlist() {
  const response = await apiRequest<{ items: WishlistItemResponse[] }>('/customer/wishlist')
  return response.items.map(keyFor)
}

export async function addCustomerWishlistItem(productId: string) {
  await apiRequest<{ item: WishlistItemResponse }>('/customer/wishlist/items', { method: 'POST', body: JSON.stringify({ productId }) })
}

export async function removeCustomerWishlistItem(productId: string) {
  await apiRequest<undefined>(`/customer/wishlist/items/${encodeURIComponent(productId)}`, { method: 'DELETE' })
}

export function checkCustomerWishlistItem(productId: string) {
  return apiRequest<{ saved: boolean }>(`/customer/wishlist/check/${encodeURIComponent(productId)}`)
}
