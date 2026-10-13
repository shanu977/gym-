import { useContext } from 'react'
import { MembershipContext } from './MembershipContextStore'

export function useMembership() {
  const context = useContext(MembershipContext)
  if (!context) throw new Error('useMembership must be used inside MembershipProvider')
  return context
}
