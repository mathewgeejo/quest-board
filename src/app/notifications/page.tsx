'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatTimeRemaining } from '@/lib/utils'
import {
  Bell,
  BellOff,
  Check,
  CheckCircle,
  Gift,
  Star,
  Swords,
  Trophy,
  TrendingUp,
  Flame,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: 'QUEST_COMPLETE' | 'BADGE_EARNED' | 'LEVEL_UP' | 'STREAK_REMINDER' | 'NEW_QUEST' | 'SYSTEM'
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: Record<string, any>
}

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  QUEST_COMPLETE: CheckCircle,
  BADGE_EARNED: Trophy,
  LEVEL_UP: TrendingUp,
  STREAK_REMINDER: Flame,
  NEW_QUEST: Swords,
  SYSTEM: Bell,
}

const NOTIFICATION_COLORS: Record<string, string> = {
  QUEST_COMPLETE: 'text-green-500 bg-green-500/10',
  BADGE_EARNED: 'text-amber-500 bg-amber-500/10',
  LEVEL_UP: 'text-purple-500 bg-purple-500/10',
  STREAK_REMINDER: 'text-orange-500 bg-orange-500/10',
  NEW_QUEST: 'text-blue-500 bg-blue-500/10',
  SYSTEM: 'text-gray-500 bg-gray-500/10',
}

export default function NotificationsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    fetchNotifications()
  }, [])
  
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      })
      
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }
  
  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark notifications as read')
    }
  }
  
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    return true
  })
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  if (status === 'loading') {
    return (
      <DashboardLayout title="Notifications">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-secondary rounded-xl" />
          ))}
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
        
        {/* Notifications List */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-secondary rounded-xl" />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">
                {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'unread'
                  ? "You're all caught up! Check back later for new updates."
                  : 'Complete quests and earn badges to receive notifications.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type] || Bell
              const colorClass = NOTIFICATION_COLORS[notification.type]
              
              return (
                <Card
                  key={notification.id}
                  className={cn(
                    'transition-all cursor-pointer hover:shadow-md',
                    !notification.read && 'border-primary/50 bg-primary/5'
                  )}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div
                        className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                          colorClass
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold">{notification.title}</p>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.createdAt).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
