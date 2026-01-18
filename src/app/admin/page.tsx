'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  Swords,
  BookOpen,
  Users,
  Trophy,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

interface AdminStats {
  totalQuests: number
  totalTrees: number
  totalUsers: number
  totalBadges: number
  recentQuests: any[]
  recentUsers: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Admin Dashboard">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Manage your QuestBoard platform"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Quests
              </CardTitle>
              <Swords className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalQuests || 0}</div>
              <Link href="/admin/quests">
                <Button variant="link" className="px-0 text-xs">
                  Manage Quests <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Quest Trees
              </CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTrees || 0}</div>
              <Link href="/admin/trees">
                <Button variant="link" className="px-0 text-xs">
                  Manage Trees <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <Link href="/admin/users">
                <Button variant="link" className="px-0 text-xs">
                  View Users <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Badges
              </CardTitle>
              <Trophy className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalBadges || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Available badges</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/quests/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quest
                </Button>
              </Link>
              <Link href="/admin/trees/new">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quest Tree
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Quests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Quests</CardTitle>
              <Link href="/admin/quests">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {stats?.recentQuests && stats.recentQuests.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentQuests.map((quest: any) => (
                    <Link
                      key={quest.id}
                      href={`/admin/quests/${quest.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{quest.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {quest.difficulty} • {quest.xpReward} XP
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No quests yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Users</CardTitle>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUsers.map((user: any) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium text-sm">{user.name || user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Level {user.currentLevel} • {user.totalXP} XP
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No users yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
