import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useAccount } from './useAccount'
import { MembershipContext } from './MembershipContextStore'
import { cancelCustomerMembership, createCustomerMembership, getCustomerMembershipHistory, getCustomerMemberships, updateCustomerMembership } from '../services/demoMembershipService'
import type { MembershipBillingCycle } from '../types'

export function MembershipProvider({ children }: { children: ReactNode }) {
  const { customer } = useAccount()
  const [version, setVersion] = useState(0)
  const memberships = useMemo(() => version >= 0 ? getCustomerMemberships(customer.id) : [], [customer.id, version])
  const history = useMemo(() => version >= 0 ? getCustomerMembershipHistory(customer.id) : [], [customer.id, version])
  const refreshMembership = useCallback(() => { setVersion((current) => current + 1) }, [])
  const joinMembership = useCallback((planId: string, cycle: MembershipBillingCycle, price: number) => { if (!customer.id) return null; const created = createCustomerMembership(customer.id, planId, cycle, price); refreshMembership(); return created }, [customer.id, refreshMembership])
  const cancelMembership = useCallback(() => { const current = memberships.find((item) => item.status === 'active'); if (!current) return; cancelCustomerMembership(current.id); refreshMembership() }, [memberships, refreshMembership])
  const renewMembership = useCallback(() => { const current = memberships.find((item) => item.status === 'active'); if (!current) return; const start = new Date(); const renewal = new Date(start); if (current.billingCycle === 'monthly') renewal.setMonth(renewal.getMonth() + 1); else renewal.setFullYear(renewal.getFullYear() + 1); updateCustomerMembership(current.id, { startDate: start.toISOString(), renewalDate: renewal.toISOString() }); refreshMembership() }, [memberships, refreshMembership])
  const currentMembership = memberships.find((item) => item.status === 'active') ?? null
  const value = useMemo(() => ({ currentMembership, history, joinMembership, cancelMembership, renewMembership, refreshMembership }), [currentMembership, history, joinMembership, cancelMembership, renewMembership, refreshMembership])
  return <MembershipContext.Provider value={value}>{children}</MembershipContext.Provider>
}
