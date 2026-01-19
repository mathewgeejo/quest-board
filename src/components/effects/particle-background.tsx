'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

interface ParticleBackgroundProps {
  variant?: 'embers' | 'magic' | 'stars' | 'dust'
  density?: number
  className?: string
}

export function ParticleBackground({
  variant = 'magic',
  density = 50,
  className = '',
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (isReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particle colors based on variant
    const colors = {
      embers: ['#ff6b35', '#f59e0b', '#fbbf24', '#ef4444'],
      magic: ['#6366f1', '#818cf8', '#a855f7', '#38bdf8'],
      stars: ['#ffffff', '#e2e8f0', '#fbbf24', '#818cf8'],
      dust: ['#94a3b8', '#64748b', '#475569', '#6366f1'],
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < density; i++) {
      const colorSet = colors[variant]
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: variant === 'embers' ? -Math.random() * 1 - 0.5 : (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.3,
        color: colorSet[Math.floor(Math.random() * colorSet.length)],
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Flicker opacity for embers
        if (variant === 'embers') {
          particle.opacity = 0.3 + Math.random() * 0.5
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // Add glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [variant, density, isReducedMotion])

  if (isReducedMotion) {
    return (
      <div
        className={`fixed inset-0 pointer-events-none ${className}`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        }}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
