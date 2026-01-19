'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface FantasyButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  children: React.ReactNode
}

export const FantasyButton = forwardRef<HTMLButtonElement, FantasyButtonProps>(
  ({ variant = 'primary', size = 'md', glow = true, className, children, ...props }, ref) => {
    const baseStyles = `
      relative overflow-hidden font-fantasy font-semibold uppercase tracking-wider
      transition-all duration-300 ease-out
      border-2 rounded-lg
      disabled:opacity-50 disabled:cursor-not-allowed
    `

    const variants = {
      primary: `
        bg-gradient-to-b from-[#4338ca] to-[#3730a3]
        border-[#6366f1] hover:border-[#818cf8]
        text-white
        shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(99,102,241,0.3)]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(99,102,241,0.5)]
      `,
      secondary: `
        bg-gradient-to-b from-[#2d2d44] to-[#1a1a2e]
        border-[#3a3a4a] hover:border-[#6366f1]
        text-[#e2e8f0]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.3)]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_6px_20px_rgba(99,102,241,0.3)]
      `,
      gold: `
        bg-gradient-to-b from-[#d97706] to-[#b45309]
        border-[#f59e0b] hover:border-[#fbbf24]
        text-white
        shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(245,158,11,0.3)]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_20px_rgba(245,158,11,0.5)]
      `,
      danger: `
        bg-gradient-to-b from-[#dc2626] to-[#b91c1c]
        border-[#ef4444] hover:border-[#f87171]
        text-white
        shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(239,68,68,0.3)]
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_20px_rgba(239,68,68,0.5)]
      `,
      ghost: `
        bg-transparent
        border-[#3a3a4a] hover:border-[#6366f1]
        text-[#94a3b8] hover:text-white
        hover:bg-[#1a1a2e]
      `,
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Inner glow effect */}
        {glow && (
          <motion.span
            className="absolute inset-0 rounded-lg opacity-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Shine effect on hover */}
        <motion.span
          className="absolute inset-0 -translate-x-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }}
          whileHover={{ translateX: '100%' }}
          transition={{ duration: 0.5 }}
        />
        
        <span className="relative z-10">{children}</span>
      </motion.button>
    )
  }
)

FantasyButton.displayName = 'FantasyButton'
