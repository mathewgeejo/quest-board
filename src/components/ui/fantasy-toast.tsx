'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'quest' | 'levelup' | 'achievement'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  icon?: string
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    gradient: 'from-green-600/90 to-green-800/90',
    border: 'border-green-500/50',
    iconColor: 'text-green-300',
  },
  error: {
    icon: AlertCircle,
    gradient: 'from-red-600/90 to-red-800/90',
    border: 'border-red-500/50',
    iconColor: 'text-red-300',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-amber-600/90 to-amber-800/90',
    border: 'border-amber-500/50',
    iconColor: 'text-amber-300',
  },
  info: {
    icon: Info,
    gradient: 'from-blue-600/90 to-blue-800/90',
    border: 'border-blue-500/50',
    iconColor: 'text-blue-300',
  },
  quest: {
    icon: null,
    gradient: 'from-arcane-purple/90 to-arcane-dark/90',
    border: 'border-arcane-purple/50',
    iconColor: 'text-arcane-light',
  },
  levelup: {
    icon: null,
    gradient: 'from-gold-dark/90 via-gold/90 to-gold-light/90',
    border: 'border-gold/50',
    iconColor: 'text-gold-light',
  },
  achievement: {
    icon: null,
    gradient: 'from-purple-600/90 via-purple-700/90 to-purple-900/90',
    border: 'border-purple-400/50',
    iconColor: 'text-purple-300',
  },
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = toastConfig[toast.type]
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'relative p-4 rounded-lg backdrop-blur-md',
        'bg-gradient-to-r',
        config.gradient,
        'border',
        config.border,
        'shadow-xl'
      )}
    >
      {/* Glow effect for special toasts */}
      {(toast.type === 'levelup' || toast.type === 'achievement') && (
        <motion.div
          className="absolute inset-0 rounded-lg -z-10"
          style={{
            background: toast.type === 'levelup'
              ? 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn('flex-shrink-0', config.iconColor)}>
          {toast.icon ? (
            <span className="text-2xl">{toast.icon}</span>
          ) : Icon ? (
            <Icon className="w-5 h-5" />
          ) : toast.type === 'quest' ? (
            <span className="text-2xl">📜</span>
          ) : toast.type === 'levelup' ? (
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              ⬆️
            </motion.span>
          ) : (
            <span className="text-2xl">🏆</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{toast.title}</p>
          {toast.description && (
            <p className="text-sm text-white/80 mt-0.5">{toast.description}</p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

// Preset toast functions
export function useQuestToast() {
  const { addToast } = useToast()

  return {
    questAccepted: (questName: string) => {
      addToast({
        type: 'quest',
        title: 'Quest Accepted!',
        description: questName,
        icon: '⚔️',
      })
    },
    questCompleted: (questName: string, xp: number) => {
      addToast({
        type: 'success',
        title: 'Quest Complete!',
        description: `${questName} (+${xp} XP)`,
        icon: '✨',
      })
    },
    levelUp: (newLevel: number) => {
      addToast({
        type: 'levelup',
        title: `Level Up! You are now Level ${newLevel}`,
        description: 'New abilities unlocked!',
        duration: 8000,
      })
    },
    achievementUnlocked: (name: string, rarity: string) => {
      addToast({
        type: 'achievement',
        title: 'Achievement Unlocked!',
        description: `${name} (${rarity})`,
        icon: '🏆',
        duration: 8000,
      })
    },
    skillUnlocked: (skillName: string) => {
      addToast({
        type: 'info',
        title: 'Skill Unlocked!',
        description: skillName,
        icon: '✨',
      })
    },
    error: (message: string) => {
      addToast({
        type: 'error',
        title: 'Error',
        description: message,
      })
    },
  }
}
