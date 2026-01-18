'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

function Avatar({
  className,
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  ...props
}: AvatarProps) {
  const [error, setError] = React.useState(false)
  
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }
  
  const getFallbackInitials = () => {
    if (fallback) return fallback.slice(0, 2).toUpperCase()
    if (alt) {
      const words = alt.split(' ')
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase()
      }
      return alt.slice(0, 2).toUpperCase()
    }
    return '??'
  }
  
  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-accent text-white font-medium">
          {getFallbackInitials()}
        </div>
      )}
    </div>
  )
}

interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  className?: string
}

function AvatarGroup({ children, max = 4, className }: AvatarGroupProps) {
  const childArray = React.Children.toArray(children)
  const excess = childArray.length - max
  const visibleChildren = childArray.slice(0, max)
  
  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="ring-2 ring-background rounded-full">
          {child}
        </div>
      ))}
      {excess > 0 && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted ring-2 ring-background text-xs font-medium">
          +{excess}
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarGroup }
