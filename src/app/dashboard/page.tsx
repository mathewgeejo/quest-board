'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import {
  XPProgressCard,
  StreakCard,
  QuestStatsCard,
  RolePathCard,
  RecentActivityCard,
} from '@/components/dashboard'
import { XPChart } from '@/components/dashboard'
import { QuestCard } from '@/components/quest'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DynamicIcon } from '@/lib/icons'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

interface DashboardData {
  user: {
    id: string
    name: string
    totalXP: number
    currentLevel: number
    streakCount: number
    longestStreak: number
    rolePath: string
  }
  questStats: {
    completed: number
    inProgress: number
    available: number
  }
  activeQuests: any[]
  recentBadges: any[]
  xpHistory: { date: string; xp: number }[]
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    if (session?.user) {
      fetchDashboardData()
    }
  }, [session])
  
  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/user/stats')
      if (res.ok) {
        const stats = await res.json()
        setData(stats)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (status === 'loading' || loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </DashboardLayout>
    )
  }
  
  if (!data) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout
      title={`Welcome back, ${data.user.name?.split(' ')[0] || 'Adventurer'}!`}
      subtitle="Here's your quest progress overview"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <XPProgressCard totalXP={data.user.totalXP} />
          <StreakCard
            currentStreak={data.user.streakCount}
            longestStreak={data.user.longestStreak}
          />
          <QuestStatsCard
            completed={data.questStats.completed}
            inProgress={data.questStats.inProgress}
            available={data.questStats.available}
          />
          <RolePathCard rolePath={data.user.rolePath} />
        </div>
        
        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Quests */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Quests</h2>
              <Link href="/active">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {data.activeQuests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No Active Quests</h3>
                  <p className="text-muted-foreground mb-4">
                    Ready for your next adventure? Browse available quests!
                  </p>
                  <Link href="/quests">
                    <Button>
                      Find Quests <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.activeQuests.slice(0, 4).map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Badges */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Badges</h2>
              <Link href="/badges">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <Card>
              <CardContent className="p-4">
                {data.recentBadges.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Complete quests to earn badges!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.recentBadges.map((userBadge) => (
                      <div
                        key={userBadge.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <DynamicIcon 
                          name={userBadge.badge.icon} 
                          className="h-6 w-6 text-yellow-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{userBadge.badge.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(userBadge.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* XP History */}
        {data.xpHistory.length > 0 && (
          <XPChart data={data.xpHistory} />
        )}
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/quests">
                <Button>Browse Quests</Button>
              </Link>
              <Link href="/trees">
                <Button variant="outline">Explore Quest Trees</Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline">View Leaderboard</Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">Update Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
