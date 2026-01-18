'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LeaderboardRowSkeleton } from '@/components/ui/skeleton'
import { cn, getRolePathInfo } from '@/lib/utils'
import { DynamicIcon } from '@/lib/icons'
import { Trophy, Medal, Star, Crown } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  username: string
  avatarUrl: string
  totalXP: number
  periodXP: number
  level: number
  rolePath: string
  questsCompleted: number
  badgesEarned: number
  isCurrentUser: boolean
}

export default function LeaderboardPage() {
  const { status } = useSession()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null)
  const [period, setPeriod] = useState<'all_time' | 'monthly' | 'weekly' | 'daily'>('all_time')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    fetchLeaderboard()
  }, [period])
  
  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leaderboard?period=${period}`)
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data.leaderboard)
        setCurrentUserRank(data.currentUserRank)
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }
  
  const periods = [
    { value: 'all_time', label: 'All Time' },
    { value: 'monthly', label: 'This Month' },
    { value: 'weekly', label: 'This Week' },
    { value: 'daily', label: 'Today' },
  ]
  
  if (status === 'loading') {
    return (
      <DashboardLayout title="Leaderboard">
        <Card>
          <CardContent className="p-0">
            {[...Array(10)].map((_, i) => (
              <LeaderboardRowSkeleton key={i} />
            ))}
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout
      title="Leaderboard"
      subtitle="See how you rank against other adventurers"
    >
      <div className="space-y-6">
        {/* Period Filter */}
        <div className="flex gap-2 flex-wrap">
          {periods.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? 'default' : 'outline'}
              onClick={() => setPeriod(p.value as any)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        
        {/* Top 3 Podium */}
        {!loading && leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="relative">
                <Avatar
                  src={leaderboard[1]?.avatarUrl}
                  alt={leaderboard[1]?.name}
                  size="xl"
                  className="ring-4 ring-gray-400"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <p className="font-semibold mt-3 text-center truncate w-full">
                {leaderboard[1]?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {leaderboard[1]?.totalXP.toLocaleString()} XP
              </p>
            </div>
            
            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <Crown className="h-8 w-8 text-yellow-500 mb-2" />
              <div className="relative">
                <Avatar
                  src={leaderboard[0]?.avatarUrl}
                  alt={leaderboard[0]?.name}
                  size="xl"
                  className="ring-4 ring-yellow-500 h-20 w-20"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <p className="font-semibold mt-3 text-center truncate w-full">
                {leaderboard[0]?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {leaderboard[0]?.totalXP.toLocaleString()} XP
              </p>
            </div>
            
            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="relative">
                <Avatar
                  src={leaderboard[2]?.avatarUrl}
                  alt={leaderboard[2]?.name}
                  size="xl"
                  className="ring-4 ring-amber-600"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <p className="font-semibold mt-3 text-center truncate w-full">
                {leaderboard[2]?.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {leaderboard[2]?.totalXP.toLocaleString()} XP
              </p>
            </div>
          </div>
        )}
        
        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <LeaderboardRowSkeleton key={i} />
              ))
            ) : leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No rankings yet. Complete quests to appear on the leaderboard!
              </div>
            ) : (
              <div className="divide-y">
                {leaderboard.map((entry) => {
                  const roleInfo = getRolePathInfo(entry.rolePath)
                  
                  return (
                    <div
                      key={entry.userId}
                      className={cn(
                        'flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors',
                        entry.isCurrentUser && 'bg-primary/5'
                      )}
                    >
                      <div className="w-10 flex items-center justify-center">
                        {getRankIcon(entry.rank)}
                      </div>
                      
                      <Avatar
                        src={entry.avatarUrl}
                        alt={entry.name}
                        size="md"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {entry.name}
                            {entry.isCurrentUser && (
                              <span className="ml-2 text-xs text-primary">(You)</span>
                            )}
                          </p>
                          {entry.rank <= 3 && (
                            <DynamicIcon 
                              name={roleInfo.icon} 
                              className="h-5 w-5"
                              style={{ color: roleInfo.color }}
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Level {entry.level}</span>
                          <span>•</span>
                          <span>{entry.questsCompleted} quests</span>
                          <span>•</span>
                          <span>{entry.badgesEarned} badges</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 font-semibold">
                          <Star className="h-4 w-4 text-yellow-500" />
                          {entry.totalXP.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Current User Rank (if not in top 50) */}
        {currentUserRank && (
          <Card className="border-primary/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Your Rank</p>
              <div className="flex items-center gap-4">
                <div className="w-10 flex items-center justify-center">
                  <span className="text-lg font-bold">#{currentUserRank.rank}</span>
                </div>
                
                <Avatar
                  src={currentUserRank.avatarUrl}
                  alt={currentUserRank.name}
                  size="md"
                />
                
                <div className="flex-1">
                  <p className="font-medium">{currentUserRank.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Level {currentUserRank.level} • {currentUserRank.questsCompleted} quests
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 font-semibold">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {currentUserRank.totalXP.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
