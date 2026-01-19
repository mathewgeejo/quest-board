'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Lock } from 'lucide-react'

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

interface AchievementBadgeProps {
  name: string
  description?: string
  icon: string
  rarity: BadgeRarity
  unlocked: boolean
  unlockedAt?: Date
  progress?: { current: number; total: number }
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  className?: string
  onClick?: () => void
}

const rarityConfig = {
  common: {
    gradient: 'from-gray-400 to-gray-600',
    glow: 'rgba(156, 163, 175, 0.4)',
    border: 'border-gray-400',
    text: 'text-gray-400',
    label: 'Common',
  },
  uncommon: {
    gradient: 'from-green-400 to-green-600',
    glow: 'rgba(74, 222, 128, 0.4)',
    border: 'border-green-400',
    text: 'text-green-400',
    label: 'Uncommon',
  },
  rare: {
    gradient: 'from-blue-400 to-blue-600',
    glow: 'rgba(96, 165, 250, 0.4)',
    border: 'border-blue-400',
    text: 'text-blue-400',
    label: 'Rare',
  },
  epic: {
    gradient: 'from-purple-400 to-purple-600',
    glow: 'rgba(192, 132, 252, 0.4)',
    border: 'border-purple-400',
    text: 'text-purple-400',
    label: 'Epic',
  },
  legendary: {
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    glow: 'rgba(251, 191, 36, 0.5)',
    border: 'border-yellow-400',
    text: 'text-yellow-400',
    label: 'Legendary',
  },
}

const sizeConfig = {
  sm: { badge: 'w-12 h-12', icon: 'text-xl', ring: 'w-14 h-14' },
  md: { badge: 'w-16 h-16', icon: 'text-2xl', ring: 'w-[72px] h-[72px]' },
  lg: { badge: 'w-24 h-24', icon: 'text-4xl', ring: 'w-[104px] h-[104px]' },
}

export function AchievementBadge({
  name,
  description,
  icon,
  rarity,
  unlocked,
  progress,
  size = 'md',
  showTooltip = true,
  className,
  onClick,
}: AchievementBadgeProps) {
  const config = rarityConfig[rarity]
  const sizes = sizeConfig[size]

  return (
    <motion.div
      className={cn('relative group cursor-pointer', className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Outer glow ring for legendary */}
      {unlocked && rarity === 'legendary' && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-r from-yellow-400/50 via-amber-500/50 to-orange-500/50'
          )}
          style={{ filter: 'blur(8px)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Animated ring */}
      <div
        className={cn(
          'absolute rounded-full',
          sizes.ring,
          'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        )}
      >
        {unlocked ? (
          <motion.div
            className={cn(
              'w-full h-full rounded-full',
              `bg-gradient-to-br ${config.gradient}`
            )}
            style={{ padding: 2 }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="w-full h-full rounded-full bg-dungeon-900" />
          </motion.div>
        ) : (
          <div
            className={cn(
              'w-full h-full rounded-full border-2 border-dashed',
              'border-dungeon-600 opacity-50'
            )}
          />
        )}
      </div>

      {/* Badge */}
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center',
          sizes.badge,
          unlocked
            ? `bg-gradient-to-br ${config.gradient}`
            : 'bg-dungeon-800 border border-dungeon-600',
          unlocked && 'shadow-lg'
        )}
        style={
          unlocked
            ? {
                boxShadow: `0 0 20px ${config.glow}, inset 0 1px 2px rgba(255,255,255,0.3)`,
              }
            : {}
        }
      >
        {/* Inner circle */}
        <div
          className={cn(
            'absolute inset-1 rounded-full',
            unlocked
              ? 'bg-dungeon-900/80 backdrop-blur-sm'
              : 'bg-dungeon-900'
          )}
        />

        {/* Icon or lock */}
        <div className="relative z-10">
          {unlocked ? (
            <span className={cn(sizes.icon)}>{icon}</span>
          ) : (
            <Lock
              className={cn(
                'text-dungeon-500',
                size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7'
              )}
            />
          )}
        </div>

        {/* Shine effect */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Progress ring for locked badges */}
      {!unlocked && progress && (
        <svg
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            sizes.ring
          )}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-dungeon-700"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className={config.text}
            strokeDasharray={`${(progress.current / progress.total) * 289} 289`}
            initial={{ strokeDashoffset: 289 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          className={cn(
            'absolute bottom-full left-1/2 -translate-x-1/2 mb-3',
            'px-3 py-2 rounded-lg',
            'bg-dungeon-800/95 backdrop-blur-sm border',
            config.border,
            'opacity-0 group-hover:opacity-100 pointer-events-none',
            'transition-opacity duration-200',
            'min-w-[160px] max-w-[200px]',
            'z-20'
          )}
        >
          <div className="text-center">
            <p className="font-semibold text-stone-100 text-sm">{name}</p>
            <p className={cn('text-xs font-medium', config.text)}>
              {config.label}
            </p>
            {description && (
              <p className="text-xs text-stone-400 mt-1">{description}</p>
            )}
            {!unlocked && progress && (
              <p className="text-xs text-stone-500 mt-1">
                {progress.current}/{progress.total}
              </p>
            )}
          </div>
          {/* Arrow */}
          <div
            className={cn(
              'absolute top-full left-1/2 -translate-x-1/2',
              'w-0 h-0',
              'border-l-[6px] border-l-transparent',
              'border-r-[6px] border-r-transparent',
              'border-t-[6px] border-t-dungeon-800'
            )}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

// Badge display grid for inventory/achievements page
interface BadgeGridProps {
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    rarity: BadgeRarity
    unlocked: boolean
    progress?: { current: number; total: number }
  }>
  onBadgeClick?: (badgeId: string) => void
}

export function BadgeGrid({ badges, onBadgeClick }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {badges.map((badge) => (
        <AchievementBadge
          key={badge.id}
          {...badge}
          size="md"
          onClick={() => onBadgeClick?.(badge.id)}
        />
      ))}
    </div>
  )
}
