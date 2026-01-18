'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RarityBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Trophy, Lock, CheckCircle } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  type: string
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  criteria: string
  earned: boolean
  earnedAt: string | null
  earnedCount: number
}

export default function BadgesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showEarnedOnly, setShowEarnedOnly] = useState(false)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    fetchBadges()
  }, [selectedType])
  
  const fetchBadges = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedType) params.append('type', selectedType)
      
      const res = await fetch(`/api/badges?${params}`)
      if (res.ok) {
        const data = await res.json()
        setBadges(data)
      }
    } catch (error) {
      console.error('Failed to fetch badges:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const badgeTypes = [
    { value: null, label: 'All Badges' },
    { value: 'QUEST_COMPLETE', label: 'Quest' },
    { value: 'TREE_COMPLETE', label: 'Tree' },
    { value: 'STREAK', label: 'Streak' },
    { value: 'XP_MILESTONE', label: 'XP Milestone' },
    { value: 'SPECIAL', label: 'Special' },
  ]
  
  const filteredBadges = badges.filter((badge) => {
    if (showEarnedOnly && !badge.earned) return false
    return true
  })
  
  const earnedCount = badges.filter((b) => b.earned).length
  
  if (status === 'loading') {
    return (
      <DashboardLayout title="Badges">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout
      title="Badge Collection"
      subtitle={`${earnedCount} of ${badges.length} badges earned`}
    >
      <div className="space-y-6">
        {/* Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{earnedCount}</p>
                  <p className="text-muted-foreground">Badges Earned</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                {['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'].map((rarity) => {
                  const count = badges.filter(
                    (b) => b.rarity === rarity && b.earned
                  ).length
                  const total = badges.filter((b) => b.rarity === rarity).length
                  
                  return (
                    <div key={rarity} className="text-center">
                      <p className="text-lg font-semibold">{count}/{total}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {rarity.toLowerCase()}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {badgeTypes.map((type) => (
            <Button
              key={type.value || 'all'}
              variant={selectedType === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type.value)}
            >
              {type.label}
            </Button>
          ))}
          
          <div className="ml-auto">
            <Button
              variant={showEarnedOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowEarnedOnly(!showEarnedOnly)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Earned Only
            </Button>
          </div>
        </div>
        
        {/* Badges Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : filteredBadges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {showEarnedOnly
                ? "You haven't earned any badges yet"
                : 'No badges found'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBadges.map((badge) => (
              <Card
                key={badge.id}
                className={cn(
                  'relative overflow-hidden transition-all',
                  badge.earned
                    ? 'hover:shadow-lg'
                    : 'opacity-60 grayscale'
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'h-16 w-16 rounded-xl flex items-center justify-center text-4xl shrink-0',
                        badge.earned
                          ? 'bg-yellow-500/10'
                          : 'bg-muted'
                      )}
                    >
                      {badge.earned ? badge.icon : <Lock className="h-8 w-8" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{badge.name}</h3>
                        {badge.earned && (
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        )}
                      </div>
                      <RarityBadge rarity={badge.rarity} />
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                  
                  {badge.earned && badge.earnedAt && (
                    <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                      Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                  
                  {!badge.earned && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        <strong>How to earn:</strong> {badge.criteria}
                      </p>
                    </div>
                  )}
                </CardContent>
                
                {/* Rarity glow effect for earned badges */}
                {badge.earned && badge.rarity === 'LEGENDARY' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-purple-500/5 pointer-events-none" />
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
