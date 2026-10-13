import type { Prisma } from "@prisma/client";

export const customerProfileSelect = {
  id: true,
  email: true,
  roles: true,
  createdAt: true,
  updatedAt: true,
  profile: {
    select: {
      firstName: true,
      lastName: true,
      phone: true,
      location: true,
      fitnessGoal: true,
      trainingLevel: true,
      preferredTrainingTime: true,
      bio: true,
      emailUpdates: true,
      trainingReminders: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.UserSelect;

export type CustomerProfileRecord = Prisma.UserGetPayload<{ select: typeof customerProfileSelect }>;

export function toCustomerProfileResponse(user: CustomerProfileRecord) {
  return {
    account: {
      id: user.id,
      email: user.email,
      roles: user.roles,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    profile: user.profile ? {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      phone: user.profile.phone,
      location: user.profile.location,
      fitnessGoal: user.profile.fitnessGoal,
      trainingLevel: user.profile.trainingLevel,
      preferredTrainingTime: user.profile.preferredTrainingTime,
      bio: user.profile.bio,
      emailUpdates: user.profile.emailUpdates,
      trainingReminders: user.profile.trainingReminders,
      createdAt: user.profile.createdAt.toISOString(),
      updatedAt: user.profile.updatedAt.toISOString(),
    } : null,
  };
}
