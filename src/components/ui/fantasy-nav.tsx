'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Map, 
  Sparkles, 
  Trophy, 
  Backpack, 
  User,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Scroll,
  Shield
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { XPBar } from './xp-bar'

const navItems = [
  { href: '/dashboard', label: 'Guild Hall', icon: Home, description: 'Your home base' },
  { href: '/trees', label: 'Quest Map', icon: Map, description: 'Explore skill trees' },
  { href: '/quests', label: 'Quests', icon: Scroll, description: 'Available quests' },
  { href: '/badges', label: 'Trophies', icon: Trophy, description: 'Your achievements' },
  { href: '/leaderboard', label: 'Hall of Fame', icon: Shield, description: 'Top adventurers' },
]

interface FantasyNavProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    level?: number
    xp?: number
    xpToNextLevel?: number
  }
}

export function FantasyNav({ user }: FantasyNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  
  // Merge user prop with session, prioritizing user prop
  const currentUser = user || (session?.user ? {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
  } : null)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40">
        {/* Main navbar */}
        <div className="relative">
          {/* Background with blur */}
          <div className="absolute inset-0 bg-dungeon-900/90 backdrop-blur-md border-b border-dungeon-700" />
          
          {/* Arcane glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-arcane-purple/50 to-transparent" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-arcane-purple to-arcane-dark flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-arcane-purple/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span className="font-fantasy text-xl font-bold gradient-text-gold hidden sm:block">
                  QuestBoard
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative px-4 py-2 rounded-lg transition-all duration-200 group',
                        'flex items-center gap-2',
                        isActive 
                          ? 'text-stone-100' 
                          : 'text-stone-400 hover:text-stone-200'
                      )}
                    >
                      {/* Active background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(135deg, hsl(270 70% 45% / 0.2) 0%, hsl(260 25% 10%) 100%)',
                            border: '1px solid hsl(270 70% 45% / 0.3)',
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover background */}
                      <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <item.icon className={cn(
                        'w-4 h-4 relative z-10',
                        isActive && 'text-arcane-light'
                      )} />
                      <span className="relative z-10 text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
              
              {/* Right section */}
              <div className="flex items-center gap-3">
                {/* XP Bar (desktop) */}
                {currentUser && (
                  <div className="hidden lg:block w-32">
                    <XPBar 
                      currentXP={currentUser.xp || 0} 
                      maxXP={currentUser.xpToNextLevel || 1000} 
                      level={currentUser.level || 1}
                      compact
                    />
                  </div>
                )}
                
                {/* Notifications */}
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-fire rounded-full animate-pulse" />
                </Link>
                
                {/* Profile */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1 pr-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-arcane-purple to-arcane-dark flex items-center justify-center overflow-hidden">
                    {currentUser?.image ? (
                      <img src={currentUser.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-stone-300" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm text-stone-300">
                    {currentUser?.name || 'Adventurer'}
                  </span>
                </Link>
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 w-72 bg-dungeon-900/95 backdrop-blur-md border-l border-dungeon-700 z-30 md:hidden"
            >
              <div className="p-4 space-y-2">
                {/* XP Bar */}
                {currentUser && (
                  <div className="p-4 rounded-lg bg-dungeon-800/50 mb-4">
                    <XPBar 
                      currentXP={currentUser.xp || 0} 
                      maxXP={currentUser.xpToNextLevel || 1000} 
                      level={currentUser.level || 1}
                    />
                  </div>
                )}
                
                {/* Nav items */}
                {navItems.map((item, i) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg transition-all',
                          isActive 
                            ? 'bg-arcane-purple/20 border border-arcane-purple/30 text-stone-100' 
                            : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                        )}
                      >
                        <item.icon className={cn(
                          'w-5 h-5',
                          isActive && 'text-arcane-light'
                        )} />
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-stone-500">{item.description}</p>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
                
                {/* Divider */}
                <div className="my-4 border-t border-dungeon-700" />
                
                {/* Settings & Logout */}
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-all"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Spacer for fixed nav */}
      <div className="h-16" />
    </>
  )
}
