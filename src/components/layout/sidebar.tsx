'use client'

import { cn, calculateLevel, getXPForLevel } from '@/lib/utils'
import { useUIStore } from '@/lib/store'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Map,
  Trophy,
  User,
  Settings,
  BookOpen,
  Swords,
  Medal,
  ChevronLeft,
  ChevronRight,
  Flame,
  LogOut,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Quest Map', href: '/quests', icon: Map },
  { name: 'Quest Trees', href: '/trees', icon: BookOpen },
  { name: 'Active Quests', href: '/active', icon: Swords },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Badges', href: '/badges', icon: Medal },
  { name: 'Profile', href: '/profile', icon: User },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface UserStats {
  level: number
  xp: number
  xpToNextLevel: number
  xpProgress: number
  streak: number
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 50,
    xpProgress: 0,
    streak: 0,
  })
  
  // Fetch real user data
  useEffect(() => {
    if (session?.user) {
      fetchUserStats()
    }
  }, [session])
  
  const fetchUserStats = async () => {
    try {
      const res = await fetch('/api/user/stats')
      if (res.ok) {
        const data = await res.json()
        const totalXP = data.user?.totalXP || 0
        const streak = data.user?.streakCount || 0
        
        // Calculate level and XP progress from totalXP
        const level = calculateLevel(totalXP)
        const currentLevelXP = getXPForLevel(level)
        const nextLevelXP = getXPForLevel(level + 1)
        const xpProgress = totalXP - currentLevelXP
        const xpToNextLevel = nextLevelXP - currentLevelXP
        
        setUserStats({
          level,
          xp: xpProgress,
          xpToNextLevel: xpToNextLevel || 50,
          xpProgress: xpToNextLevel > 0 ? Math.round((xpProgress / xpToNextLevel) * 100) : 100,
          streak,
        })
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    }
  }
  
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r transition-transform duration-300',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
        )}
      >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <Swords className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-xl gradient-text">QuestBoard</span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* User Info */}
        {session?.user && (
          <div className={cn('p-4 border-b', !sidebarOpen && 'flex justify-center')}>
            {sidebarOpen ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{session.user.name}</p>
                    <p className="text-sm text-muted-foreground">Level {userStats.level}</p>
                  </div>
                </div>
                
                {/* XP Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">XP Progress</span>
                    <span className="font-medium">{userStats.xp} / {userStats.xpToNextLevel}</span>
                  </div>
                  <Progress
                    value={userStats.xp}
                    max={userStats.xpToNextLevel}
                    variant="gradient"
                    size="sm"
                  />
                </div>
                
                {/* Streak */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-500">
                  <Flame className="h-5 w-5 streak-flame" />
                  <span className="font-medium">{userStats.streak} day streak!</span>
                </div>
              </div>
            ) : (
              <Avatar
                src={session.user.image}
                alt={session.user.name || 'User'}
                size="lg"
              />
            )}
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  !sidebarOpen && 'justify-center'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </nav>
        
        {/* Secondary Navigation */}
        <div className="border-t p-4 space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  !sidebarOpen && 'justify-center'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            )
          })}
          
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full',
                'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
                !sidebarOpen && 'justify-center'
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="font-medium">Sign Out</span>}
            </button>
          )}
        </div>
      </div>
      </aside>
    </>
  )
}
