import type { DemoCustomer } from '../types'
import { getCustomerProfile, updateCustomerProfile } from './api/customerProfileApi'
import { getDemoAccount, resetDemoAccount, saveDemoAccount } from './demoAccountService'

export const isCustomerProfileApiEnabled = import.meta.env.PROD || import.meta.env.VITE_CUSTOMER_PROFILE_API === 'true'

export function readAccount(): DemoCustomer {
  return getDemoAccount()
}

export async function loadAccount(): Promise<DemoCustomer | null> {
  if (!isCustomerProfileApiEnabled) return null
  return getCustomerProfile()
}

export function saveAccount(account: DemoCustomer, updates: Partial<DemoCustomer>) {
  saveDemoAccount(account)
  if (isCustomerProfileApiEnabled) void updateCustomerProfile(updates)
}

export function resetAccount() {
  return resetDemoAccount()
}
