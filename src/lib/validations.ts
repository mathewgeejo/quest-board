import { z } from 'zod'

// ============================================
// AUTH SCHEMAS
// ============================================

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>

// ============================================
// QUEST SCHEMAS
// ============================================

export const acceptQuestSchema = z.object({
  questId: z.string().min(1, 'Quest ID is required'),
})

export const completeTaskSchema = z.object({
  progressId: z.string().min(1, 'Progress ID is required'),
  taskId: z.string().min(1, 'Task ID is required'),
})

export const submitQuestSchema = z.object({
  progressId: z.string().min(1, 'Progress ID is required'),
  artifactUrl: z.string().url('Invalid URL').optional(),
  notes: z.string().optional(),
})

export const abandonQuestSchema = z.object({
  progressId: z.string().min(1, 'Progress ID is required'),
})

export type AcceptQuestInput = z.infer<typeof acceptQuestSchema>
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>
export type SubmitQuestInput = z.infer<typeof submitQuestSchema>
export type AbandonQuestInput = z.infer<typeof abandonQuestSchema>

// ============================================
// USER SCHEMAS
// ============================================

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

export const selectRolePathSchema = z.object({
  rolePath: z.enum(['DEVOPS', 'BACKEND', 'FRONTEND', 'PRODUCT', 'SECURITY', 'FULLSTACK']),
})

export const updateSettingsSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  showOnLeaderboard: z.boolean().optional(),
  timezone: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type SelectRolePathInput = z.infer<typeof selectRolePathSchema>
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>

// ============================================
// ARTIFACT SCHEMAS
// ============================================

export const createArtifactSchema = z.object({
  questId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['REPOSITORY', 'DEPLOYMENT', 'DOCUMENT', 'VIDEO', 'PRESENTATION', 'CONFIGURATION', 'OTHER']),
  url: z.string().url('Invalid URL'),
  repoUrl: z.string().url('Invalid repository URL').optional(),
  liveUrl: z.string().url('Invalid live URL').optional(),
})

export type CreateArtifactInput = z.infer<typeof createArtifactSchema>
