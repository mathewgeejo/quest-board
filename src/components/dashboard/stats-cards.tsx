'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn, calculateLevel, getXPProgress, getRolePathInfo } from '@/lib/utils'
import { DynamicIcon } from '@/lib/icons'
import {
  Zap,
  Flame,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  color?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'h-12 w-12 rounded-xl flex items-center justify-center',
              `bg-${color}/10`
            )}
            style={{ backgroundColor: `hsl(var(--${color}) / 0.1)` }}
          >
            {icon}
          </div>
          
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                trend.value >= 0
                  ? 'bg-green-500/10 text-green-600'
                  : 'bg-red-500/10 text-red-600'
              )}
            >
              <TrendingUp
                className={cn(
                  'h-3 w-3',
                  trend.value < 0 && 'rotate-180'
                )}
              />
              {Math.abs(trend.value)}% {trend.label}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// XP Progress Card
interface XPProgressCardProps {
  totalXP: number
  className?: string
}

export function XPProgressCard({ totalXP, className }: XPProgressCardProps) {
  const level = calculateLevel(totalXP)
  const { current, required, percent } = getXPProgress(totalXP)
  
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{level}</span>
            </div>
            <div>
              <p className="font-semibold">Level {level}</p>
              <p className="text-sm text-muted-foreground">
                {totalXP.toLocaleString()} total XP
              </p>
            </div>
          </div>
          <Zap className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {level + 1}</span>
            <span className="font-medium">{percent}%</span>
          </div>
          <Progress value={percent} variant="gradient" />
          <p className="text-xs text-muted-foreground text-right">
            {current.toLocaleString()} / {required.toLocaleString()} XP
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Streak Card
interface StreakCardProps {
  currentStreak: number
  longestStreak: number
  className?: string
}

export function StreakCard({ currentStreak, longestStreak, className }: StreakCardProps) {
  return (
    <Card className={cn('bg-gradient-to-br from-orange-500/10 to-red-500/10', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{currentStreak}</span>
              <span className="text-lg text-muted-foreground">days</span>
            </div>
          </div>
          <Flame className="h-12 w-12 text-orange-500 streak-flame" />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span>Best: {longestStreak} days</span>
        </div>
        
        {currentStreak >= 7 && (
          <div className="mt-4 p-3 rounded-lg bg-orange-500/10 text-orange-600 text-sm font-medium flex items-center gap-2">
            <Flame className="h-4 w-4" />
            +5% XP bonus active!
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Quest Stats Card
interface QuestStatsCardProps {
  completed: number
  inProgress: number
  available: number
  className?: string
}

export function QuestStatsCard({
  completed,
  inProgress,
  available,
  className,
}: QuestStatsCardProps) {
  const total = completed + inProgress + available
  
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold">Quest Progress</p>
          <Target className="h-5 w-5 text-primary" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm">Completed</span>
            </div>
            <span className="font-medium">{completed}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm">In Progress</span>
            </div>
            <span className="font-medium">{inProgress}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-400" />
              <span className="text-sm">Available</span>
            </div>
            <span className="font-medium">{available}</span>
          </div>
          
          {/* Visual bar */}
          <div className="h-3 rounded-full bg-secondary overflow-hidden flex">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(completed / total) * 100}%` }}
            />
            <div
              className="h-full bg-blue-500"
              style={{ width: `${(inProgress / total) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Role Path Card
interface RolePathCardProps {
  rolePath: string
  className?: string
}

export function RolePathCard({ rolePath, className }: RolePathCardProps) {
  const pathInfo = getRolePathInfo(rolePath)
  
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10"
        style={{
          background: `radial-gradient(circle, ${pathInfo.color} 0%, transparent 70%)`,
        }}
      />
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: pathInfo.color + '20' }}
          >
            <DynamicIcon 
              name={pathInfo.icon} 
              className="h-7 w-7"
              style={{ color: pathInfo.color }}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role Path</p>
            <p className="text-xl font-bold">{pathInfo.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {pathInfo.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Recent Activity Card
interface Activity {
  id: string
  type: 'quest_complete' | 'badge_earned' | 'level_up' | 'streak'
  title: string
  description: string
  timestamp: string
  xp?: number
}

interface RecentActivityCardProps {
  activities: Activity[]
  className?: string
}

export function RecentActivityCard({ activities, className }: RecentActivityCardProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'quest_complete':
        return <Target className="h-4 w-4 text-green-500" />
      case 'badge_earned':
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 'level_up':
        return <Star className="h-4 w-4 text-purple-500" />
      case 'streak':
        return <Flame className="h-4 w-4 text-orange-500" />
    }
  }
  
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity. Start a quest!
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {activity.xp && (
                    <p className="text-sm font-medium text-primary">+{activity.xp} XP</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
