'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface XPBarProps {
  currentXP: number
  maxXP: number
  level: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  compact?: boolean
  className?: string
}

export function XPBar({
  currentXP,
  maxXP,
  level,
  showLabel = true,
  size = 'md',
  compact = false,
  className,
}: XPBarProps) {
  const percentage = Math.min((currentXP / maxXP) * 100, 100)

  const sizes = {
    sm: { height: 'h-2', text: 'text-xs', level: 'w-6 h-6 text-xs' },
    md: { height: 'h-4', text: 'text-sm', level: 'w-8 h-8 text-sm' },
    lg: { height: 'h-6', text: 'text-base', level: 'w-10 h-10 text-base' },
  }

  // Compact mode for navbar
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-xs font-bold text-gold">{level}</span>
        <div className="flex-1 h-1.5 rounded-full bg-dungeon-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-arcane-purple to-arcane-light"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-stone-500">{Math.round(percentage)}%</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Level Badge */}
      <motion.div
        className={cn(
          'flex items-center justify-center rounded-full font-fantasy font-bold',
          'bg-gradient-to-br from-[#f59e0b] to-[#d97706]',
          'border-2 border-[#fbbf24] shadow-[0_0_15px_rgba(245,158,11,0.5)]',
          sizes[size].level
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {level}
      </motion.div>

      {/* XP Bar Container */}
      <div className="flex-1">
        <div
          className={cn(
            'relative w-full rounded-full overflow-hidden',
            'bg-[#1a1a2e] border border-[#3a3a4a]',
            sizes[size].height
          )}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 10px,
                rgba(99, 102, 241, 0.1) 10px,
                rgba(99, 102, 241, 0.1) 20px
              )`,
            }}
          />

          {/* XP Fill */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, 
                #f59e0b 0%, 
                #fbbf24 50%, 
                #f59e0b 100%
              )`,
              backgroundSize: '200% 100%',
            }}
            initial={{ width: 0 }}
            animate={{ 
              width: `${percentage}%`,
              backgroundPosition: ['0% center', '200% center'],
            }}
            transition={{
              width: { duration: 0.8, ease: 'easeOut' },
              backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
            }}
          >
            {/* Shimmer overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                backgroundSize: '50% 100%',
                animation: 'shimmer 2s infinite',
              }}
            />
          </motion.div>

          {/* Glow effect at the edge */}
          <motion.div
            className="absolute top-0 bottom-0 w-4 rounded-full"
            style={{
              left: `calc(${percentage}% - 8px)`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%)',
              filter: 'blur(4px)',
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* XP Label */}
        {showLabel && (
          <div className={cn('flex justify-between mt-1', sizes[size].text)}>
            <span className="text-[#94a3b8]">
              <span className="text-[#fbbf24] font-semibold">{currentXP.toLocaleString()}</span>
              <span className="text-[#64748b]"> / {maxXP.toLocaleString()} XP</span>
            </span>
            <span className="text-[#64748b]">
              Level {level + 1} in {(maxXP - currentXP).toLocaleString()} XP
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Level up animation component
export function LevelUpAnimation({ level, onComplete }: { level: number; onComplete?: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Radial burst */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.8) 0%, transparent 70%)',
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 10, opacity: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        onAnimationComplete={onComplete}
      />

      {/* Level text */}
      <motion.div
        className="relative text-center"
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <motion.p
          className="text-[#fbbf24] font-fantasy text-2xl uppercase tracking-widest"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
        >
          Level Up!
        </motion.p>
        <motion.p
          className="text-white font-fantasy text-6xl font-bold"
          style={{ textShadow: '0 0 30px rgba(245, 158, 11, 0.8)' }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 1],
          }}
          transition={{ duration: 2, times: [0, 0.3, 0.5, 1] }}
        >
          {level}
        </motion.p>
      </motion.div>

      {/* Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#fbbf24]"
          style={{
            boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)',
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 1,
            opacity: 1,
          }}
          animate={{ 
            x: Math.cos((i / 12) * Math.PI * 2) * 200,
            y: Math.sin((i / 12) * Math.PI * 2) * 200,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  )
}
