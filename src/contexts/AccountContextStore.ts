import { createContext } from 'react'
import type { DemoCustomer } from '../types'

export type AccountContextValue = { customer: DemoCustomer; exists: boolean; loading: boolean; updateProfile: (updates: Partial<DemoCustomer>) => void; resetProfile: () => DemoCustomer; refreshAccount: () => Promise<void> }
export const AccountContext = createContext<AccountContextValue | undefined>(undefined)
