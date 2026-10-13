export type NavItem = { label: string; path: string }
export type Trainer = { id: string; name: string; discipline: string; image: string; accent: string; experience: string; experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced'; rating: string; reviewCount: number; certifications: string[]; trainingTypes: string[]; supportedGoals: string[]; availability: string; availabilityDays: string[]; preferredTimes: string[]; personalTraining: boolean; fee: string; bio: string; approach: string }
export type Program = { id: string; title: string; category: string; goal: string; trainingType: string; difficulty: string; duration: string; sessionsPerWeek: string; description: string; image: string; icon: 'dumbbell' | 'flame' | 'activity' | 'person' | 'target'; benefits: string[]; included: string[]; trainerId: string; featured?: boolean }
export type ProductCategory =
  | 'Whey Protein'
  | 'Creatine'
  | 'Pre Workout'
  | 'Amino Acids'
  | 'Fat Loss'
  | 'Anabolic'
  | 'Health & Wellness'
  | 'Protein Foods'
  | 'Accessories'
export type ProductStock = 'In stock' | 'Low stock' | 'Out of stock'
export type ProductVariant = { name: string; value: string }
export type ProductReview = { reviewer: string; rating: number; text: string; date: string }
export type Product = { id: string; slug: string; name: string; brand: string; category: ProductCategory; description: string; shortDescription: string; images: string[]; image: string; price: number; compareAtPrice?: number; rating: number; reviewCount: number; stock: ProductStock; featured?: boolean; bestseller?: boolean; tags: string[]; variants: ProductVariant[]; specifications: Record<string, string>; benefits: string[]; reviews?: ProductReview[]; tag?: string }
export type Membership = { id: string; name: string; shortDescription: string; monthlyPrice: number; yearlyPrice: number; yearlySavings: number; popular?: boolean; benefits: string[]; gymAccess: string; equipmentAccess: string; groupClasses: string; personalTraining: string; trainerAccess: string; lockerAccess: string; nutritionSupport: string; guestPasses: string; accessHours: string; terms: string }
export type MembershipHistoryItem = { plan: string; startDate: string; endDate: string; billingCycle: 'Monthly' | 'Yearly'; amount: number; status: 'Completed' | 'Expired' }
export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'pending'
export type MembershipBillingCycle = 'monthly' | 'yearly'
export type CustomerMembership = { id: string; customerId: string; planId: string; billingCycle: MembershipBillingCycle; price: number; status: MembershipStatus; startDate: string; renewalDate: string; joinedAt: string; createdAt: string; updatedAt: string }
export type CustomerMembershipHistoryItem = { id: string; customerId: string; planId: string; billingCycle: MembershipBillingCycle; status: MembershipStatus; startDate: string; endDate: string; amount: number; createdAt: string }
export type ShippingAddress = { addressLine: string; city: string; state: string; postalCode: string; country: string }
export type DeliveryMethod = 'standard' | 'express'
export type PaymentMethod = 'card' | 'upi' | 'cod'
export type CheckoutFormData = { fullName: string; email: string; mobile: string; shippingAddress: ShippingAddress; deliveryMethod: DeliveryMethod; paymentMethod: PaymentMethod; cardholderName: string; cardNumber: string; expiry: string; cvv: string; upiId: string }
export type DemoOrderItem = { productId: string; name: string; brand: string; image: string; variants: Record<string, string>; quantity: number; unitPrice: number; lineTotal: number; compareAtPrice?: number }
export type DemoOrder = { id: string; customerId?: string | null; createdAt: string; customer: { fullName: string; email: string; mobile: string }; shippingAddress: ShippingAddress; deliveryMethod: DeliveryMethod; paymentMethod: PaymentMethod; items: DemoOrderItem[]; subtotal: number; savings: number; shipping: number; tax: number; total: number; status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; estimatedDelivery?: string }
export type DemoCustomer = { id: string; firstName: string; lastName: string; email: string; phone: string; location: string; memberSince: string; fitnessGoal: string; trainingLevel: string; preferredTrainingTime: string; bio: string; emailUpdates: boolean; trainingReminders: boolean }
export type AuthUser = { userId: string; email: string; sessionCreatedAt: string }
export type LoginCredentials = { email: string; password: string; rememberSession: boolean }
export type SignupData = { firstName: string; lastName: string; email: string; mobile: string; password: string; confirmPassword: string; acceptedTerms: boolean }
export type AuthResult = { success: boolean; error?: string }
export type TrainerBookingStatus = 'confirmed' | 'completed' | 'cancelled'
export type TrainerBookingSessionType = 'Personal Training' | 'Strength Coaching' | 'Weight Loss Coaching' | 'Nutrition Guidance' | 'Mobility & Recovery'
export type TrainerSnapshot = { id: string; name: string; image: string; specialization: string }
export type TrainerBooking = { id: string; customerId: string; trainer: TrainerSnapshot; sessionType: TrainerBookingSessionType; bookingDate: string; startTime: string; endTime: string; duration: number; status: TrainerBookingStatus; customerNotes: string; customerGoal: string; createdAt: string }
export type AddressType = 'Home' | 'Work' | 'Other'
export type CustomerAddress = { id: string; customerId: string; fullName: string; mobile: string; addressLine1: string; addressLine2: string; landmark: string; city: string; state: string; postalCode: string; country: string; addressType: AddressType; isDefault: boolean; createdAt: string; updatedAt: string }
export type TrainingGoal = 'Strength' | 'Muscle Gain' | 'Weight Loss' | 'General Fitness' | 'Endurance' | 'Mobility'
export type PreferredTrainingTime = 'Morning' | 'Afternoon' | 'Evening' | 'Flexible'
export type PreferredSessionType = 'Personal Training' | 'Group Classes' | 'Self-Guided' | 'Mixed'
export type CustomerPreferences = { customerId: string; trainingGoal: TrainingGoal; preferredTrainingTime: PreferredTrainingTime; preferredSessionType: PreferredSessionType; communicationEmail: boolean; communicationSms: boolean; communicationPromotions: boolean; updatedAt: string }
