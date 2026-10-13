import type { DemoCustomer } from '../types'

export const DEMO_ACCOUNT_KEY = 'iron-peak-demo-account'

export const defaultDemoCustomer: DemoCustomer = {
  id: 'demo-customer-001',
  firstName: 'Aarav',
  lastName: 'Mehta',
  email: 'aarav.mehta@example.com',
  phone: '+91 98765 43210',
  location: 'Mumbai, India',
  memberSince: 'January 2026',
  fitnessGoal: 'Build strength',
  trainingLevel: 'Intermediate',
  preferredTrainingTime: 'Morning',
  bio: 'Building a stronger, more consistent training practice one session at a time.',
  emailUpdates: true,
  trainingReminders: true,
}

function isDemoCustomer(value: unknown): value is DemoCustomer {
  return Boolean(value && typeof value === 'object' && typeof (value as DemoCustomer).id === 'string' && typeof (value as DemoCustomer).email === 'string')
}

export function getDemoAccount(): DemoCustomer {
  if (typeof window === 'undefined') return defaultDemoCustomer
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(DEMO_ACCOUNT_KEY) ?? 'null')
    return isDemoCustomer(parsed) ? { ...defaultDemoCustomer, ...parsed } : defaultDemoCustomer
  } catch {
    return defaultDemoCustomer
  }
}

export function saveDemoAccount(account: DemoCustomer) {
  try {
    window.localStorage.setItem(DEMO_ACCOUNT_KEY, JSON.stringify(account))
    return true
  } catch {
    return false
  }
}

export function resetDemoAccount() {
  try { window.localStorage.removeItem(DEMO_ACCOUNT_KEY) } catch { /* localStorage can be unavailable */ }
  return defaultDemoCustomer
}
