// Export types for use throughout the app

export type RolePath = 'FRONTEND' | 'BACKEND' | 'DEVOPS' | 'FULLSTACK' | 'DATA'

export type Difficulty = 'TUTORIAL' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'LEGENDARY'

export type QuestStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'

export type BadgeRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'

export type BadgeType = 
  | 'QUEST_COMPLETION'
  | 'STREAK'
  | 'XP_MILESTONE'
  | 'LEVEL_MILESTONE'
  | 'TREE_COMPLETION'
  | 'SPEED_RUN'
  | 'COLLECTION'
  | 'SPECIAL'

export type TreeLayer = 'FOUNDATION' | 'CORE' | 'ADVANCED' | 'SPECIALIST' | 'MASTERY'

export type NotificationType = 
  | 'QUEST_COMPLETE'
  | 'BADGE_EARNED'
  | 'LEVEL_UP'
  | 'STREAK_REMINDER'
  | 'NEW_QUEST'
  | 'SYSTEM'

export interface User {
  id: string
  name: string
  email: string
  username?: string | null
  image?: string | null
  bio?: string | null
  rolePath?: RolePath | null
  totalXP: number
  currentLevel: number
  currentStreak: number
  longestStreak: number
  lastActivityDate?: Date | null
  questsCompleted: number
  createdAt: Date
  updatedAt: Date
}

export interface QuestTree {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  layer: TreeLayer
  order: number
  prerequisiteTreeIds: string[]
  rolePathPrimary?: RolePath | null
  rolePathSecondary?: RolePath | null
  totalQuests: number
  createdAt: Date
  updatedAt: Date
  quests?: Quest[]
}

export interface Quest {
  id: string
  title: string
  slug: string
  description: string
  difficulty: Difficulty
  estimatedTime: number
  baseXP: number
  treeId: string
  tree?: QuestTree
  prerequisiteQuestIds: string[]
  tasks: QuestTask[]
  learningObjectives: string[]
  resources: QuestResource[]
  createdAt: Date
  updatedAt: Date
  userProgress?: UserQuestProgress
}

export interface QuestTask {
  id: string
  type: 'READ' | 'CODE' | 'QUIZ' | 'PROJECT'
  title: string
  description: string
  content?: string
  order: number
}

export interface QuestResource {
  id: string
  type: 'ARTICLE' | 'VIDEO' | 'DOCUMENTATION' | 'TOOL'
  title: string
  url: string
}

export interface UserQuestProgress {
  id: string
  userId: string
  questId: string
  quest?: Quest
  status: QuestStatus
  completedTasks: string[]
  startedAt?: Date | null
  completedAt?: Date | null
  xpEarned: number
  timeSpent: number
  createdAt: Date
  updatedAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  type: BadgeType
  rarity: BadgeRarity
  criteria: Record<string, any>
  xpBonus: number
  createdAt: Date
  userBadge?: UserBadge
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  badge?: Badge
  earnedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  data?: Record<string, any>
  createdAt: Date
}

export interface LeaderboardEntry {
  id: string
  userId: string
  user?: User
  totalXP: number
  questsCompleted: number
  currentStreak: number
  rank: number
  period: 'ALL_TIME' | 'MONTHLY' | 'WEEKLY' | 'DAILY'
  updatedAt: Date
}

export interface XPTransaction {
  id: string
  userId: string
  amount: number
  source: 'QUEST' | 'BADGE' | 'BONUS' | 'STREAK'
  sourceId?: string | null
  description: string
  createdAt: Date
}

// API Response types
export interface DashboardStats {
  user: User
  recentBadges: UserBadge[]
  activeQuests: UserQuestProgress[]
  xpHistory: { date: string; xp: number }[]
  questStats: {
    total: number
    completed: number
    inProgress: number
  }
  nextLevel: {
    level: number
    currentXP: number
    requiredXP: number
    progress: number
  }
}

export interface QuestWithProgress extends Quest {
  userProgress: UserQuestProgress | null
  isAvailable: boolean
  prerequisitesMet: boolean
}

export interface TreeWithProgress extends QuestTree {
  completedQuests: number
  progress: number
}
