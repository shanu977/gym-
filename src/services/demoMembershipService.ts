import type { CustomerMembership, CustomerMembershipHistoryItem, MembershipBillingCycle, MembershipStatus } from '../types'

export const DEMO_MEMBERSHIPS_KEY = 'iron-peak-demo-memberships'
export const DEMO_LAST_MEMBERSHIP_KEY = 'iron-peak-last-membership'

type MembershipStore = { memberships: CustomerMembership[]; history: CustomerMembershipHistoryItem[] }

const emptyStore: MembershipStore = { memberships: [], history: [] }
const statuses: MembershipStatus[] = ['active', 'expired', 'cancelled', 'pending']

function isCycle(value: unknown): value is MembershipBillingCycle { return value === 'monthly' || value === 'yearly' }
function isStatus(value: unknown): value is MembershipStatus { return typeof value === 'string' && statuses.includes(value as MembershipStatus) }
function validDate(value: unknown) { return typeof value === 'string' && !Number.isNaN(new Date(value).getTime()) }
function isMembership(value: unknown): value is CustomerMembership {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<CustomerMembership>
  return typeof item.id === 'string' && typeof item.customerId === 'string' && typeof item.planId === 'string' && isCycle(item.billingCycle) && typeof item.price === 'number' && isStatus(item.status) && validDate(item.startDate) && validDate(item.renewalDate) && validDate(item.joinedAt) && validDate(item.createdAt) && validDate(item.updatedAt)
}
function isHistory(value: unknown): value is CustomerMembershipHistoryItem {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<CustomerMembershipHistoryItem>
  return typeof item.id === 'string' && typeof item.customerId === 'string' && typeof item.planId === 'string' && isCycle(item.billingCycle) && isStatus(item.status) && validDate(item.startDate) && validDate(item.endDate) && typeof item.amount === 'number' && validDate(item.createdAt)
}

function readStore(): MembershipStore {
  if (typeof window === 'undefined') return emptyStore
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(DEMO_MEMBERSHIPS_KEY) ?? 'null')
    if (!parsed || typeof parsed !== 'object') return emptyStore
    const value = parsed as Partial<MembershipStore>
    return { memberships: Array.isArray(value.memberships) ? value.memberships.filter(isMembership) : [], history: Array.isArray(value.history) ? value.history.filter(isHistory) : [] }
  } catch { return emptyStore }
}

function writeStore(store: MembershipStore) {
  try { window.localStorage.setItem(DEMO_MEMBERSHIPS_KEY, JSON.stringify(store)); return true } catch { return false }
}

export function getCustomerMemberships(customerId: string) { return customerId ? readStore().memberships.filter((item) => item.customerId === customerId) : [] }
export function getCustomerMembershipHistory(customerId: string) { return customerId ? readStore().history.filter((item) => item.customerId === customerId) : [] }

export function addMonths(date: Date, months: number) {
  const result = new Date(date)
  const originalDay = result.getDate()
  result.setDate(1)
  result.setMonth(result.getMonth() + months)
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate()
  result.setDate(Math.min(originalDay, lastDay))
  return result
}

export function createCustomerMembership(customerId: string, planId: string, cycle: MembershipBillingCycle, price: number) {
  const now = new Date()
  const startDate = now.toISOString()
  const renewalDate = (cycle === 'monthly' ? addMonths(now, 1) : addMonths(now, 12)).toISOString()
  const membership: CustomerMembership = { id: `ipf-membership-${Date.now()}`, customerId, planId, billingCycle: cycle, price, status: 'active', startDate, renewalDate, joinedAt: startDate, createdAt: startDate, updatedAt: startDate }
  const store = readStore()
  const prior = store.memberships.filter((item) => item.customerId === customerId && item.status === 'active')
  const history = prior.map((item) => ({ id: `ipf-history-${item.id}`, customerId, planId: item.planId, billingCycle: item.billingCycle, status: 'cancelled' as const, startDate: item.startDate, endDate: startDate, amount: item.price, createdAt: startDate }))
  const memberships = store.memberships.map((item) => prior.some((old) => old.id === item.id) ? { ...item, status: 'cancelled' as const, updatedAt: startDate } : item).concat(membership)
  const next = { memberships, history: store.history.concat(history) }
  writeStore(next)
  try { window.localStorage.setItem(DEMO_LAST_MEMBERSHIP_KEY, membership.id) } catch { /* storage can be unavailable */ }
  return membership
}

export function updateCustomerMembership(id: string, updates: Partial<Pick<CustomerMembership, 'planId' | 'billingCycle' | 'price' | 'status' | 'startDate' | 'renewalDate'>>) {
  const store = readStore()
  const existing = store.memberships.find((item) => item.id === id)
  if (!existing) return null
  const nextItem = { ...existing, ...updates, updatedAt: new Date().toISOString() }
  const next = { ...store, memberships: store.memberships.map((item) => item.id === id ? nextItem : item) }
  writeStore(next)
  return nextItem
}

export function cancelCustomerMembership(id: string) {
  const store = readStore()
  const existing = store.memberships.find((item) => item.id === id)
  if (!existing || existing.status !== 'active') return null
  const endDate = new Date().toISOString()
  const nextItem = { ...existing, status: 'cancelled' as const, updatedAt: endDate }
  const historyItem: CustomerMembershipHistoryItem = { id: `ipf-history-${existing.id}`, customerId: existing.customerId, planId: existing.planId, billingCycle: existing.billingCycle, status: 'cancelled', startDate: existing.startDate, endDate, amount: existing.price, createdAt: endDate }
  writeStore({ memberships: store.memberships.map((item) => item.id === id ? nextItem : item), history: store.history.some((item) => item.id === historyItem.id) ? store.history : store.history.concat(historyItem) })
  return nextItem
}
