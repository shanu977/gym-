import { createContext } from 'react'
import type { CustomerMembership, CustomerMembershipHistoryItem, MembershipBillingCycle } from '../types'

export type MembershipContextValue = { currentMembership: CustomerMembership | null; history: CustomerMembershipHistoryItem[]; joinMembership: (planId: string, cycle: MembershipBillingCycle, price: number) => CustomerMembership | null; cancelMembership: () => void; renewMembership: () => void; refreshMembership: () => void }
export const MembershipContext = createContext<MembershipContextValue | undefined>(undefined)
