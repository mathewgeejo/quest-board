'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PortalLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function PortalLoader({ size = 'md', text, className }: PortalLoaderProps) {
  const sizes = {
    sm: { outer: 'w-12 h-12', inner: 'w-8 h-8', ring: 'w-10 h-10' },
    md: { outer: 'w-20 h-20', inner: 'w-12 h-12', ring: 'w-16 h-16' },
    lg: { outer: 'w-32 h-32', inner: 'w-20 h-20', ring: 'w-28 h-28' },
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className={cn('relative', sizes[size].outer)}>
        {/* Outer rotating ring */}
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full border-2 border-transparent',
            'border-t-[#6366f1] border-r-[#818cf8]'
          )}
          style={{
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle rotating ring (opposite direction) */}
        <motion.div
          className={cn(
            'absolute rounded-full border-2 border-transparent',
            'border-b-[#a855f7] border-l-[#c084fc]',
            sizes[size].ring
          )}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner pulsing core */}
        <motion.div
          className={cn(
            'absolute rounded-full',
            sizes[size].inner,
            'bg-gradient-to-br from-[#6366f1] to-[#a855f7]'
          )}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#818cf8]"
            style={{
              top: '50%',
              left: '50%',
              boxShadow: '0 0 6px rgba(129, 140, 248, 0.8)',
            }}
            animate={{
              x: [0, Math.cos((i / 6) * Math.PI * 2) * 30],
              y: [0, Math.sin((i / 6) * Math.PI * 2) * 30],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {text && (
        <motion.p
          className="font-fantasy text-[#94a3b8] text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Simpler spinner for inline use
export function RuneSpinner({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('w-5 h-5 border-2 border-[#6366f1]/30 border-t-[#6366f1] rounded-full', className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Portal-style page transition
export function PortalTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Dungeon entry transition (for entering quest details)
export function DungeonEntryTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        rotateX: 45,
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateX: 0,
      }}
      exit={{ 
        opacity: 0, 
        scale: 1.1,
        rotateX: -20,
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}
