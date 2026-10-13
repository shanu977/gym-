import type { DemoCustomer } from '../../types'
import { apiRequest } from './client'

export type CustomerProfileResponse = {
  account: { id: string; email: string; roles: string[]; createdAt: string; updatedAt: string }
  profile: {
    firstName: string; lastName: string; phone: string | null; location: string | null; fitnessGoal: string | null
    trainingLevel: string | null; preferredTrainingTime: string | null; bio: string | null
    emailUpdates: boolean; trainingReminders: boolean; createdAt: string; updatedAt: string
  } | null
}

export type CustomerProfileUpdate = Partial<Omit<DemoCustomer, 'id' | 'email' | 'memberSince'>>

export function mapCustomerProfile(response: CustomerProfileResponse): DemoCustomer {
  const profile = response.profile
  return {
    id: response.account.id,
    firstName: profile?.firstName ?? '',
    lastName: profile?.lastName ?? '',
    email: response.account.email,
    phone: profile?.phone ?? '',
    location: profile?.location ?? '',
    memberSince: new Date(response.account.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    fitnessGoal: profile?.fitnessGoal ?? '',
    trainingLevel: profile?.trainingLevel ?? '',
    preferredTrainingTime: profile?.preferredTrainingTime ?? '',
    bio: profile?.bio ?? '',
    emailUpdates: profile?.emailUpdates ?? true,
    trainingReminders: profile?.trainingReminders ?? true,
  }
}

export function getCustomerProfile() { return apiRequest<CustomerProfileResponse>('/customer/profile').then(mapCustomerProfile) }

export function updateCustomerProfile(updates: CustomerProfileUpdate) {
  const keys = ['firstName', 'lastName', 'phone', 'location', 'fitnessGoal', 'trainingLevel', 'preferredTrainingTime', 'bio', 'emailUpdates', 'trainingReminders'] as const
  const editable = Object.fromEntries(keys.filter((key) => key in updates).map((key) => [key, updates[key]]))
  return apiRequest<CustomerProfileResponse>('/customer/profile', { method: 'PATCH', body: JSON.stringify(editable) }).then(mapCustomerProfile)
}
