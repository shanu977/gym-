import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  phone: z.string().trim().min(1).max(32).nullable().optional(),
  location: optionalText(160),
  fitnessGoal: optionalText(120),
  trainingLevel: optionalText(80),
  preferredTrainingTime: optionalText(80),
  bio: z.string().trim().max(5000).nullable().optional(),
  emailUpdates: z.boolean().optional(),
  trainingReminders: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "At least one profile field is required",
  path: [],
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
