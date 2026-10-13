import type { Membership, MembershipHistoryItem } from '../types'

export const memberships: Membership[] = [
  { id: 'essential', name: 'Essential', shortDescription: 'The focused foundation for a consistent training practice.', monthlyPrice: 4900, yearlyPrice: 49900, yearlySavings: 8900, benefits: ['Open gym access', 'Premium changing rooms', 'Progress tracking app', 'Community events'], gymAccess: 'Full gym floor', equipmentAccess: 'Standard + free weights', groupClasses: '2 / month', personalTraining: 'Add-on available', trainerAccess: 'Digital guidance', lockerAccess: 'Day-use locker', nutritionSupport: 'Starter guide', guestPasses: '1 / quarter', accessHours: '06:00 — 22:00', terms: 'Monthly plan renews every 30 days. Cancel with 7 days notice.' },
  { id: 'performance', name: 'Performance', shortDescription: 'A complete system for members ready to make progress compound.', monthlyPrice: 8900, yearlyPrice: 89900, yearlySavings: 16900, popular: true, benefits: ['Unlimited gym access', 'Weekly coach-led session', 'Recovery suite access', 'Priority program booking', 'Nutrition check-in'], gymAccess: 'Unlimited access', equipmentAccess: 'Full floor + performance zone', groupClasses: 'Unlimited', personalTraining: '1 session / month', trainerAccess: 'Priority matching', lockerAccess: 'Dedicated locker', nutritionSupport: 'Monthly check-in', guestPasses: '2 / month', accessHours: '05:00 — 23:00', terms: 'Monthly plan renews every 30 days. Yearly plan renews annually.' },
  { id: 'elite', name: 'Elite', shortDescription: 'The most personal expression of the Iron Peak standard.', monthlyPrice: 18900, yearlyPrice: 189900, yearlySavings: 36900, benefits: ['Unlimited gym access', '4 personal sessions / month', 'Custom programming', 'Full recovery suite', 'Priority booking', 'Nutrition strategy'], gymAccess: 'Unlimited access', equipmentAccess: 'Full floor + private studio', groupClasses: 'Unlimited + private', personalTraining: '4 sessions / month', trainerAccess: 'Dedicated trainer', lockerAccess: 'Private locker', nutritionSupport: 'Dedicated nutrition plan', guestPasses: '4 / month', accessHours: '05:00 — 23:00', terms: 'Monthly plan renews every 30 days. Yearly plan renews annually.' },
]

export const membershipHistory: MembershipHistoryItem[] = [
  { plan: 'Essential', startDate: '01 Jan 2025', endDate: '31 Dec 2025', billingCycle: 'Yearly', amount: 49900, status: 'Completed' },
  { plan: 'Essential', startDate: '01 Oct 2024', endDate: '31 Dec 2024', billingCycle: 'Monthly', amount: 14700, status: 'Completed' },
]

export const formatINR = (amount: number) => `₹${amount.toLocaleString('en-IN')}`
