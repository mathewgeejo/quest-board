'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, Scroll, Clock, Star, Swords, BookOpen, AlertTriangle } from 'lucide-react'
import { FantasyButton } from './fantasy-button'

interface QuestScrollProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: () => void
  quest: {
    id: string
    name: string
    description: string
    longDescription?: string
    difficulty: 'NOVICE' | 'APPRENTICE' | 'JOURNEYMAN' | 'EXPERT' | 'MASTER'
    xpReward: number
    estimatedHours?: number
    tasks?: Array<{ id: string; name: string; description: string }>
    resources?: Array<{ name: string; url: string }>
    learningObjectives?: string[]
    treeName?: string
  }
}

const difficultyConfig = {
  NOVICE: { color: '#9ca3af', label: 'Novice', icon: '⚔️' },
  APPRENTICE: { color: '#22c55e', label: 'Apprentice', icon: '🗡️' },
  JOURNEYMAN: { color: '#3b82f6', label: 'Journeyman', icon: '⚔️' },
  EXPERT: { color: '#a855f7', label: 'Expert', icon: '🏹' },
  MASTER: { color: '#f59e0b', label: 'Master', icon: '👑' },
}

export function QuestScroll({ isOpen, onClose, onAccept, quest }: QuestScrollProps) {
  const config = difficultyConfig[quest.difficulty]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Scroll Container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={cn(
                'relative w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto',
                'rounded-lg'
              )}
              initial={{ scale: 0.8, y: 50, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, rotateX: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ perspective: 1000 }}
            >
              {/* Parchment background */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #d4c5a9 0%, #c4b393 50%, #b8a88a 100%)',
                }}
              />

              {/* Parchment texture overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Edge burns */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-[#5a4a32]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#5a4a32]/30 to-transparent" />
                <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#5a4a32]/30 to-transparent" />
                <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[#5a4a32]/30 to-transparent" />
              </div>

              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-[#5a4a32]/40" />
              <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-[#5a4a32]/40" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-[#5a4a32]/40" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-[#5a4a32]/40" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#5a4a32]/20 hover:bg-[#5a4a32]/40 transition-colors"
              >
                <X className="w-5 h-5 text-[#3a2a1a]" />
              </button>

              {/* Content */}
              <div className="relative p-8 overflow-y-auto max-h-[90vh] fantasy-scrollbar">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-3">
                    <Scroll className="w-8 h-8 text-[#5a4a32]" />
                  </div>
                  <h2 className="font-fantasy text-3xl font-bold text-[#2a1810] mb-2">
                    {quest.name}
                  </h2>
                  {quest.treeName && (
                    <p className="text-sm text-[#5a4a32]">{quest.treeName}</p>
                  )}
                </div>

                {/* Quest seal / wax stamp */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}cc 100%)`,
                      boxShadow: `0 4px 12px ${config.color}40, inset 0 2px 4px rgba(255,255,255,0.3)`,
                    }}
                  >
                    <span className="text-2xl">{config.icon}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex justify-center gap-6 mb-6 text-[#3a2a1a]">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" style={{ color: config.color }} />
                    <span className="text-sm font-semibold">{config.label}</span>
                  </div>
                  {quest.estimatedHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#5a4a32]" />
                      <span className="text-sm">{quest.estimatedHours} hours</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-[#f59e0b]" />
                    <span className="text-sm font-semibold text-[#b45309]">+{quest.xpReward} XP</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[#5a4a32]/30" />
                  <div className="w-2 h-2 rounded-full bg-[#5a4a32]/40" />
                  <div className="flex-1 h-px bg-[#5a4a32]/30" />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="font-scroll text-lg text-[#2a1810] leading-relaxed text-center italic">
                    "{quest.description}"
                  </p>
                </div>

                {quest.longDescription && (
                  <div className="mb-6">
                    <p className="font-scroll text-[#3a2a1a] leading-relaxed">
                      {quest.longDescription}
                    </p>
                  </div>
                )}

                {/* Learning Objectives */}
                {quest.learningObjectives && quest.learningObjectives.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-fantasy text-lg font-semibold text-[#2a1810] mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Objectives
                    </h3>
                    <ul className="space-y-2">
                      {quest.learningObjectives.map((objective, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#3a2a1a]">
                          <span className="text-[#5a4a32]">•</span>
                          <span className="font-scroll">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tasks */}
                {quest.tasks && quest.tasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-fantasy text-lg font-semibold text-[#2a1810] mb-3 flex items-center gap-2">
                      <Swords className="w-4 h-4" />
                      Quest Steps
                    </h3>
                    <div className="space-y-3">
                      {quest.tasks.map((task, i) => (
                        <div
                          key={task.id}
                          className="flex gap-3 p-3 rounded-lg bg-[#5a4a32]/10"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#5a4a32]/20 flex items-center justify-center text-xs font-bold text-[#3a2a1a]">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-[#2a1810]">{task.name}</p>
                            {task.description && (
                              <p className="text-sm text-[#5a4a32] mt-1">{task.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-center gap-4 mt-8">
                  <FantasyButton variant="ghost" onClick={onClose}>
                    Decline
                  </FantasyButton>
                  <FantasyButton variant="gold" onClick={onAccept}>
                    Accept Quest
                  </FantasyButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
