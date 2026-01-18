import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-500/10 text-green-600 dark:text-green-400',
        warning: 'border-transparent bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
        info: 'border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// Rarity badge for achievements
interface RarityBadgeProps {
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  className?: string
}

function RarityBadge({ rarity, className }: RarityBadgeProps) {
  const rarityStyles = {
    COMMON: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-300',
    UNCOMMON: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-300',
    RARE: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-300',
    EPIC: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-300',
    LEGENDARY: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-300',
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        rarityStyles[rarity],
        className
      )}
    >
      {rarity.charAt(0) + rarity.slice(1).toLowerCase()}
    </span>
  )
}

// Difficulty badge for quests
interface DifficultyBadgeProps {
  difficulty: 'TUTORIAL' | 'EASY' | 'MEDIUM' | 'HARD' | 'EPIC' | 'LEGENDARY'
  className?: string
}

function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const difficultyStyles = {
    TUTORIAL: 'bg-green-500/10 text-green-600 dark:text-green-400',
    EASY: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    MEDIUM: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    HARD: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    EPIC: 'bg-red-500/10 text-red-600 dark:text-red-400',
    LEGENDARY: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  }
  
  const difficultyIcons = {
    TUTORIAL: '📖',
    EASY: '⭐',
    MEDIUM: '⭐⭐',
    HARD: '⭐⭐⭐',
    EPIC: '🔥',
    LEGENDARY: '👑',
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        difficultyStyles[difficulty],
        className
      )}
    >
      <span>{difficultyIcons[difficulty]}</span>
      {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
    </span>
  )
}

export { Badge, badgeVariants, RarityBadge, DifficultyBadge }
