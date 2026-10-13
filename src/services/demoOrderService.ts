import type { DemoOrder, DemoOrderItem, DeliveryMethod, PaymentMethod } from '../types'

export const DEMO_ORDERS_KEY = 'iron-peak-demo-orders'
export const LAST_ORDER_KEY = 'iron-peak-last-order'
const statuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === 'object') }
function stringValue(value: unknown, fallback = '') { return typeof value === 'string' ? value : fallback }
function numberValue(value: unknown, fallback = 0) { return typeof value === 'number' && Number.isFinite(value) ? value : fallback }
function isDate(value: unknown) { return typeof value === 'string' && !Number.isNaN(new Date(value).getTime()) }
function normalizeItem(value: unknown): DemoOrderItem | null {
  if (!isRecord(value) || typeof value.productId !== 'string' || typeof value.name !== 'string' || typeof value.brand !== 'string' || typeof value.image !== 'string') return null
  const variants = isRecord(value.variants) ? Object.fromEntries(Object.entries(value.variants).filter((entry): entry is [string, string] => typeof entry[0] === 'string' && typeof entry[1] === 'string')) : {}
  const quantity = Math.max(1, Math.floor(numberValue(value.quantity, 1)))
  return { productId: value.productId, name: value.name, brand: value.brand, image: value.image, variants, quantity, unitPrice: numberValue(value.unitPrice), lineTotal: numberValue(value.lineTotal, numberValue(value.unitPrice) * quantity), ...(typeof value.compareAtPrice === 'number' ? { compareAtPrice: value.compareAtPrice } : {}) }
}

export function normalizeDemoOrder(value: unknown): DemoOrder | null {
  if (!isRecord(value) || typeof value.id !== 'string' || !isDate(value.createdAt) || !Array.isArray(value.items)) return null
  const id = stringValue(value.id); const createdAt = stringValue(value.createdAt)
  const items = value.items.map(normalizeItem).filter((item): item is DemoOrderItem => Boolean(item))
  if (!items.length || !isRecord(value.customer) || !isRecord(value.shippingAddress)) return null
  const address = value.shippingAddress
  const customer = value.customer
  const deliveryMethod: DeliveryMethod = value.deliveryMethod === 'express' ? 'express' : 'standard'
  const paymentMethod: PaymentMethod = value.paymentMethod === 'upi' || value.paymentMethod === 'cod' ? value.paymentMethod : 'card'
  const status = statuses.includes(value.status as typeof statuses[number]) ? value.status as DemoOrder['status'] : 'Confirmed'
  return { id, customerId: typeof value.customerId === 'string' && value.customerId ? value.customerId : null, createdAt, customer: { fullName: stringValue(customer.fullName), email: stringValue(customer.email), mobile: stringValue(customer.mobile) }, shippingAddress: { addressLine: stringValue(address.addressLine), city: stringValue(address.city), state: stringValue(address.state), postalCode: stringValue(address.postalCode), country: stringValue(address.country) }, deliveryMethod, paymentMethod, items, subtotal: numberValue(value.subtotal), savings: numberValue(value.savings), shipping: numberValue(value.shipping), tax: numberValue(value.tax), total: numberValue(value.total), status, ...(isDate(value.estimatedDelivery) ? { estimatedDelivery: stringValue(value.estimatedDelivery) } : {}) }
}

function readOrders(): DemoOrder[] {
  if (typeof window === 'undefined') return []
  try { const parsed: unknown = JSON.parse(window.localStorage.getItem(DEMO_ORDERS_KEY) ?? '[]'); return Array.isArray(parsed) ? parsed.map(normalizeDemoOrder).filter((order): order is DemoOrder => Boolean(order)) : [] } catch { return [] }
}

export function getAllDemoOrders() { return readOrders() }
export function getOrdersForCustomer(customerId: string) { return customerId ? readOrders().filter((order) => order.customerId === customerId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [] }
export function saveDemoOrder(order: DemoOrder) { const normalized = normalizeDemoOrder(order); if (!normalized) return false; try { const orders = readOrders().filter((entry) => entry.id !== normalized.id); window.localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify([...orders, normalized])); window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(normalized)); return true } catch { return false } }
export function getDemoOrder(id: string) { return readOrders().find((order) => order.id === id) }
export function getDemoOrderById(id: string) { return id ? getDemoOrder(id) : undefined }
export function getLastDemoOrder() { if (typeof window === 'undefined') return undefined; try { return normalizeDemoOrder(JSON.parse(window.localStorage.getItem(LAST_ORDER_KEY) ?? 'null')) ?? undefined } catch { return undefined } }
export function createDemoOrderId() { const date = new Date().toISOString().slice(0, 10).replaceAll('-', ''); return `IPF-${date}-${Math.random().toString(36).slice(2, 6).toUpperCase()}` }
