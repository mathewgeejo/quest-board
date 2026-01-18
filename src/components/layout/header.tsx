'use client'

import { useUIStore } from '@/lib/store'
import { useSession } from 'next-auth/react'
import { Bell, Search, Moon, Sun, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  
  useEffect(() => {
    setMounted(true)
    // Fetch notification count
    fetchNotifications()
  }, [])
  
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?unread=true')
      if (res.ok) {
        const data = await res.json()
        setNotificationCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Title */}
      <div className="flex-1">
        {title && (
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
      </div>
      
      {/* Search */}
      <div className="hidden md:flex relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search quests..."
          className="pl-9"
        />
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        )}
        
        {/* Notifications */}
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>
        </Link>
        
        {/* User menu */}
        {session?.user && (
          <Link href="/profile">
            <Avatar
              src={session.user.image}
              alt={session.user.name || 'User'}
              size="sm"
              className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
            />
          </Link>
        )}
      </div>
    </header>
  )
}
