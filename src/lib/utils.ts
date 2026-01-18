import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// XP & LEVEL CALCULATIONS
// ============================================

export function calculateLevel(totalXP: number): number {
  // Lower XP thresholds for faster progression
  const thresholds = [
    0,      // Level 1
    50,     // Level 2
    125,    // Level 3
    225,    // Level 4
    350,    // Level 5
    500,    // Level 6
    700,    // Level 7
    950,    // Level 8
    1250,   // Level 9
    1600,   // Level 10
    2000,   // Level 11
    2500,   // Level 12
    3100,   // Level 13
    3800,   // Level 14
    4600,   // Level 15
    5500,   // Level 16
    6500,   // Level 17
    7700,   // Level 18
    9000,   // Level 19
    10500,  // Level 20
    12200,  // Level 21
    14100,  // Level 22
    16200,  // Level 23
    18500,  // Level 24
    21000,  // Level 25
  ]
  
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalXP >= thresholds[i]) {
      return i + 1
    }
  }
  return 1
}

export function getXPForLevel(level: number): number {
  const thresholds = [0, 50, 125, 225, 350, 500, 700, 950, 1250, 1600, 
    2000, 2500, 3100, 3800, 4600, 5500, 6500, 7700, 9000, 10500,
    12200, 14100, 16200, 18500, 21000]
  return thresholds[level - 1] || 0
}

export function getXPProgress(totalXP: number): { current: number; required: number; percentage: number } {
  const currentLevel = calculateLevel(totalXP)
  const currentLevelXP = getXPForLevel(currentLevel)
  const nextLevelXP = getXPForLevel(currentLevel + 1)
  
  const current = totalXP - currentLevelXP
  const required = nextLevelXP - currentLevelXP
  const percentage = required > 0 ? Math.round((current / required) * 100) : 100
  
  return { current, required, percentage }
}

// ============================================
// XP CALCULATIONS BY DIFFICULTY
// ============================================

export function calculateQuestXP(
  baseXP: number,
  difficulty: string,
  completedEarly: boolean,
  streakCount: number,
  firstTry: boolean
): { total: number; breakdown: { base: number; early: number; streak: number; firstTry: number } } {
  // Difficulty multipliers
  const difficultyMultipliers: Record<string, number> = {
    NOVICE: 1,
    APPRENTICE: 1.2,
    JOURNEYMAN: 1.5,
    EXPERT: 2,
    MASTER: 2.5,
  }
  
  const multiplier = difficultyMultipliers[difficulty] || 1
  const adjustedBase = Math.round(baseXP * multiplier)
  
  // Bonuses
  const earlyBonus = completedEarly ? Math.round(adjustedBase * 0.25) : 0
  const streakBonus = Math.min(streakCount, 7) * Math.round(adjustedBase * 0.1)
  const firstTryBonus = firstTry ? Math.round(adjustedBase * 0.15) : 0
  
  const total = adjustedBase + earlyBonus + streakBonus + firstTryBonus
  
  return {
    total,
    breakdown: {
      base: adjustedBase,
      early: earlyBonus,
      streak: streakBonus,
      firstTry: firstTryBonus,
    },
  }
}

// ============================================
// DATE & TIME UTILITIES
// ============================================

export function formatTimeRemaining(deadline: Date | string | null | undefined): string {
  if (!deadline) return 'No deadline'
  
  const now = new Date()
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const diff = deadlineDate.getTime() - now.getTime()
  
  if (diff <= 0) return 'Expired'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

export function isDeadlineSoon(deadline: Date | string | null | undefined, hoursThreshold: number = 24): boolean {
  if (!deadline) return false
  
  const now = new Date()
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const diff = deadlineDate.getTime() - now.getTime()
  return diff > 0 && diff <= hoursThreshold * 60 * 60 * 1000
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return formatDate(date)
}

// ============================================
// DIFFICULTY HELPERS
// ============================================

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    NOVICE: 'text-green-500',
    APPRENTICE: 'text-blue-500',
    JOURNEYMAN: 'text-yellow-500',
    EXPERT: 'text-orange-500',
    MASTER: 'text-red-500',
  }
  return colors[difficulty] || 'text-gray-500'
}

export function getDifficultyBgColor(difficulty: string): string {
  const colors: Record<string, string> = {
    NOVICE: 'bg-green-500/20 text-green-400',
    APPRENTICE: 'bg-blue-500/20 text-blue-400',
    JOURNEYMAN: 'bg-yellow-500/20 text-yellow-400',
    EXPERT: 'bg-orange-500/20 text-orange-400',
    MASTER: 'bg-red-500/20 text-red-400',
  }
  return colors[difficulty] || 'bg-gray-500/20 text-gray-400'
}

export function getDifficultyStars(difficulty: string): number {
  const stars: Record<string, number> = {
    NOVICE: 1,
    APPRENTICE: 2,
    JOURNEYMAN: 3,
    EXPERT: 4,
    MASTER: 5,
  }
  return stars[difficulty] || 1
}

// ============================================
// STATUS HELPERS
// ============================================

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NOT_STARTED: 'text-gray-400',
    IN_PROGRESS: 'text-yellow-500',
    COMPLETED: 'text-green-500',
    EXPIRED: 'text-red-500',
    ABANDONED: 'text-gray-500',
  }
  return colors[status] || 'text-gray-400'
}

export function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    NOT_STARTED: '⬜',
    IN_PROGRESS: 'circle-dot',
    COMPLETED: 'check-circle',
    EXPIRED: 'timer',
    ABANDONED: 'circle',
  }
  return icons[status] || 'circle'
}

// ============================================
// ROLE PATH HELPERS
// ============================================

export function getRolePathInfo(path: string): { name: string; icon: string; color: string; description: string } {
  const paths: Record<string, { name: string; icon: string; color: string; description: string }> = {
    DEVOPS: { name: 'DevOps Engineer', icon: 'wrench', color: '#f97316', description: 'Infrastructure, CI/CD, and automation' },
    BACKEND: { name: 'Backend Engineer', icon: 'server', color: '#22c55e', description: 'APIs, databases, and server logic' },
    FRONTEND: { name: 'Frontend Engineer', icon: 'palette', color: '#ec4899', description: 'UI/UX, web apps, and user experience' },
    PRODUCT: { name: 'Product Manager', icon: 'bar-chart', color: '#a855f7', description: 'Strategy, planning, and analytics' },
    SECURITY: { name: 'Security Engineer', icon: 'shield', color: '#ef4444', description: 'Security, compliance, and protection' },
    FULLSTACK: { name: 'Full Stack Developer', icon: 'rocket', color: '#3b82f6', description: 'End-to-end development' },
  }
  return paths[path] || { name: path, icon: 'book', color: '#6b7280', description: 'Learning path' }
}

// ============================================
// BADGE HELPERS
// ============================================

export function getBadgeRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    COMMON: 'from-gray-400 to-gray-500',
    UNCOMMON: 'from-green-400 to-green-500',
    RARE: 'from-blue-400 to-blue-500',
    EPIC: 'from-purple-400 to-purple-500',
    LEGENDARY: 'from-yellow-400 to-orange-500',
  }
  return colors[rarity] || 'from-gray-400 to-gray-500'
}

// ============================================
// VALIDATION
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isStrongPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain an uppercase letter' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain a lowercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain a number' }
  }
  return { valid: true, message: '' }
}

// ============================================
// MISC UTILITIES
// ============================================

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular
  return plural || `${singular}s`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
