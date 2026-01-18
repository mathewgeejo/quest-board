import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// XP & LEVEL CALCULATIONS
// ============================================

export function calculateLevel(totalXP: number): number {
  // Level thresholds from the design doc
  const thresholds = [
    0,      // Level 1
    100,    // Level 2
    350,    // Level 3
    750,    // Level 4
    1350,   // Level 5
    2150,   // Level 6
    3150,   // Level 7
    4400,   // Level 8
    5900,   // Level 9
    7700,   // Level 10
    9800,   // Level 11
    12200,  // Level 12
    15000,  // Level 13
    18200,  // Level 14
    21800,  // Level 15
    25800,  // Level 16
    30200,  // Level 17
    35000,  // Level 18
    40200,  // Level 19
    45800,  // Level 20
    52000,  // Level 21
    58800,  // Level 22
    66200,  // Level 23
    74200,  // Level 24
    82800,  // Level 25
  ]
  
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalXP >= thresholds[i]) {
      return i + 1
    }
  }
  return 1
}

export function getXPForLevel(level: number): number {
  const thresholds = [0, 100, 350, 750, 1350, 2150, 3150, 4400, 5900, 7700, 
    9800, 12200, 15000, 18200, 21800, 25800, 30200, 35000, 40200, 45800,
    52000, 58800, 66200, 74200, 82800]
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

export function formatTimeRemaining(deadline: Date): string {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  
  if (diff <= 0) return 'Expired'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

export function isDeadlineSoon(deadline: Date, hoursThreshold: number = 24): boolean {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
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
    IN_PROGRESS: '🟡',
    COMPLETED: '✅',
    EXPIRED: '⏰',
    ABANDONED: '🔄',
  }
  return icons[status] || '⬜'
}

// ============================================
// ROLE PATH HELPERS
// ============================================

export function getRolePathInfo(path: string): { name: string; icon: string; color: string } {
  const paths: Record<string, { name: string; icon: string; color: string }> = {
    DEVOPS: { name: 'DevOps Engineer', icon: '🧰', color: 'text-orange-500' },
    BACKEND: { name: 'Backend Engineer', icon: '⚙️', color: 'text-green-500' },
    FRONTEND: { name: 'Frontend Engineer', icon: '🎨', color: 'text-pink-500' },
    PRODUCT: { name: 'Product Manager', icon: '📊', color: 'text-purple-500' },
    SECURITY: { name: 'Security Engineer', icon: '🔐', color: 'text-red-500' },
    FULLSTACK: { name: 'Full Stack Developer', icon: '🎯', color: 'text-blue-500' },
  }
  return paths[path] || { name: path, icon: '📚', color: 'text-gray-500' }
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
