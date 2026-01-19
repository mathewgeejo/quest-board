'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Lock, Check, Sparkles } from 'lucide-react'

interface SkillRuneProps {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  status: 'locked' | 'available' | 'unlocked'
  progress?: number
  color?: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

export function SkillRune({
  id,
  name,
  description,
  icon,
  status,
  progress = 0,
  color = '#6366f1',
  size = 'md',
  onClick,
  className,
}: SkillRuneProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const isLocked = status === 'locked'
  const isUnlocked = status === 'unlocked'
  const isAvailable = status === 'available'

  const sizes = {
    sm: { outer: 'w-12 h-12', inner: 'w-8 h-8', icon: 16 },
    md: { outer: 'w-16 h-16', inner: 'w-12 h-12', icon: 20 },
    lg: { outer: 'w-20 h-20', inner: 'w-14 h-14', icon: 24 },
  }

  return (
    <div className={cn('relative', className)}>
      <motion.button
        className={cn(
          'relative rounded-full flex items-center justify-center',
          'transition-all duration-300',
          sizes[size].outer,
          isLocked && 'cursor-not-allowed opacity-50',
          !isLocked && 'cursor-pointer'
        )}
        onClick={isLocked ? undefined : onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={isLocked ? {} : { scale: 1.1 }}
        whileTap={isLocked ? {} : { scale: 0.95 }}
      >
        {/* Outer ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'border-2 transition-all duration-300'
          )}
          style={{
            borderColor: isLocked ? '#2d2d44' : isUnlocked ? color : `${color}60`,
            boxShadow: isUnlocked ? `0 0 20px ${color}60` : 'none',
          }}
        />

        {/* Progress ring for available nodes */}
        {isAvailable && progress > 0 && (
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={`${color}30`}
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5 }}
              style={{
                filter: `drop-shadow(0 0 6px ${color})`,
              }}
            />
          </svg>
        )}

        {/* Inner circle */}
        <div
          className={cn(
            'relative rounded-full flex items-center justify-center',
            'transition-all duration-300',
            sizes[size].inner
          )}
          style={{
            background: isLocked
              ? 'linear-gradient(135deg, #1a1a2e 0%, #12121a 100%)'
              : isUnlocked
              ? `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`
              : `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
            boxShadow: isUnlocked
              ? `inset 0 2px 4px rgba(255,255,255,0.2), 0 4px 12px ${color}40`
              : 'inset 0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {isLocked ? (
            <Lock className="text-[#64748b]" size={sizes[size].icon} />
          ) : isUnlocked ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {icon || <Check className="text-white" size={sizes[size].icon} />}
            </motion.div>
          ) : (
            <div style={{ color }}>{icon}</div>
          )}
        </div>

        {/* Unlocked sparkle effect */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 72, 144, 216, 288].map((angle) => (
              <motion.div
                key={angle}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateY(-${parseInt(sizes[size].outer) / 2 + 4}px)`,
                  boxShadow: `0 0 4px ${color}`,
                }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: angle / 360 }}
              />
            ))}
          </motion.div>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className={cn(
              'absolute z-50 pointer-events-none',
              'left-1/2 -translate-x-1/2 bottom-full mb-2'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            <div
              className={cn(
                'px-3 py-2 rounded-lg text-center min-w-[120px]',
                'bg-[#1a1a2e] border border-[#2d2d44]',
                'shadow-lg'
              )}
            >
              <p className="font-fantasy font-semibold text-white text-sm">{name}</p>
              {description && (
                <p className="text-xs text-[#94a3b8] mt-1">{description}</p>
              )}
              {isLocked && (
                <p className="text-xs text-[#ef4444] mt-1">Locked</p>
              )}
              {isAvailable && progress > 0 && (
                <p className="text-xs mt-1" style={{ color }}>
                  {progress}% complete
                </p>
              )}
            </div>
            {/* Arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #2d2d44',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Connection line between runes
interface RuneConnectionProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  status: 'locked' | 'available' | 'unlocked'
  color?: string
}

export function RuneConnection({ from, to, status, color = '#6366f1' }: RuneConnectionProps) {
  const isUnlocked = status === 'unlocked'
  const isLocked = status === 'locked'

  const length = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI)

  return (
    <div
      className="absolute origin-left"
      style={{
        left: from.x,
        top: from.y,
        width: length,
        height: 4,
        transform: `rotate(${angle}deg)`,
      }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: isLocked
            ? '#2d2d44'
            : isUnlocked
            ? `linear-gradient(90deg, ${color}, ${color})`
            : `linear-gradient(90deg, ${color}60, ${color}30)`,
          boxShadow: isUnlocked ? `0 0 8px ${color}` : 'none',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Animated particles for unlocked connections */}
      {isUnlocked && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
          animate={{
            left: [0, length - 8],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  )
}
