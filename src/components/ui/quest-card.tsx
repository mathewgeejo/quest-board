'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Sword, 
  Scroll, 
  Clock, 
  Star, 
  Lock,
  CheckCircle,
  ChevronRight,
  Flame
} from 'lucide-react'

interface QuestCardProps {
  id: string
  name: string
  description: string
  difficulty: 'NOVICE' | 'APPRENTICE' | 'JOURNEYMAN' | 'EXPERT' | 'MASTER'
  xpReward: number
  estimatedHours?: number
  status?: 'locked' | 'available' | 'active' | 'completed'
  progress?: number
  treeName?: string
  onClick?: () => void
  className?: string
}

const difficultyConfig = {
  NOVICE: { color: '#9ca3af', label: 'Novice', stars: 1 },
  APPRENTICE: { color: '#22c55e', label: 'Apprentice', stars: 2 },
  JOURNEYMAN: { color: '#3b82f6', label: 'Journeyman', stars: 3 },
  EXPERT: { color: '#a855f7', label: 'Expert', stars: 4 },
  MASTER: { color: '#f59e0b', label: 'Master', stars: 5 },
}

export function QuestCard({
  id,
  name,
  description,
  difficulty,
  xpReward,
  estimatedHours,
  status = 'available',
  progress = 0,
  treeName,
  onClick,
  className,
}: QuestCardProps) {
  const config = difficultyConfig[difficulty]
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isActive = status === 'active'

  return (
    <motion.div
      className={cn(
        'relative group cursor-pointer',
        'rounded-xl overflow-hidden',
        'bg-gradient-to-br from-[#1a1a2e] to-[#12121a]',
        'border-2 transition-colors duration-300',
        isLocked && 'opacity-60 cursor-not-allowed',
        isCompleted && 'border-[#22c55e]',
        isActive && 'border-[#f59e0b]',
        !isLocked && !isCompleted && !isActive && 'border-[#2d2d44] hover:border-[#6366f1]',
        className
      )}
      onClick={isLocked ? undefined : onClick}
      whileHover={isLocked ? {} : { scale: 1.02, y: -4 }}
      whileTap={isLocked ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Ambient glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${config.color}15 0%, transparent 70%)`,
        }}
      />

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <Lock className="w-8 h-8 text-[#64748b]" />
        </div>
      )}

      {/* Completed overlay */}
      {isCompleted && (
        <motion.div
          className="absolute top-3 right-3 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="bg-[#22c55e] rounded-full p-1">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      )}

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute top-3 right-3 z-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="bg-[#f59e0b] rounded-full p-1">
            <Flame className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div 
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: `${config.color}20`,
              border: `1px solid ${config.color}40`,
            }}
          >
            <Sword className="w-5 h-5" style={{ color: config.color }} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-fantasy font-semibold text-white text-lg truncate">
              {name}
            </h3>
            {treeName && (
              <p className="text-xs text-[#64748b] truncate">{treeName}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#94a3b8] mb-4 line-clamp-2">
          {description}
        </p>

        {/* Progress bar for active quests */}
        {isActive && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#64748b]">Progress</span>
              <span className="text-[#f59e0b]">{progress}%</span>
            </div>
            <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden border border-[#2d2d44]">
              <motion.div
                className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Difficulty */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3"
                  style={{
                    color: i < config.stars ? config.color : '#2d2d44',
                    fill: i < config.stars ? config.color : 'transparent',
                  }}
                />
              ))}
            </div>

            {/* Time estimate */}
            {estimatedHours && (
              <div className="flex items-center gap-1 text-xs text-[#64748b]">
                <Clock className="w-3 h-3" />
                <span>{estimatedHours}h</span>
              </div>
            )}
          </div>

          {/* XP Reward */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30">
            <span className="text-xs font-semibold text-[#fbbf24]">+{xpReward} XP</span>
          </div>
        </div>

        {/* Hover indicator */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-5 h-5 text-[#6366f1]" />
        </motion.div>
      </div>
    </motion.div>
  )
}
