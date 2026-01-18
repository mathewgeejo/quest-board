'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { RarityBadge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateLevel, getXPProgress, getRolePathInfo } from '@/lib/utils'
import { DynamicIcon } from '@/lib/icons'
import toast from 'react-hot-toast'
import {
  User,
  Mail,
  Calendar,
  Star,
  Trophy,
  Target,
  Flame,
  Edit2,
  Save,
  X,
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  username: string
  avatarUrl: string
  bio: string
  totalXP: number
  currentLevel: number
  streakCount: number
  longestStreak: number
  rolePath: string
  createdAt: string
  _count: {
    questProgress: number
    badges: number
  }
  badges: Array<{
    id: string
    badge: {
      id: string
      name: string
      icon: string
      rarity: string
    }
    earnedAt: string
  }>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
  })
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])
  
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          username: data.username || '',
          bio: data.bio || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to update profile')
      }
      
      toast.success('Profile updated!')
      setEditing(false)
      fetchProfile()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }
  
  if (status === 'loading' || loading) {
    return (
      <DashboardLayout title="Profile">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-64" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  if (!profile) {
    return (
      <DashboardLayout title="Profile">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load profile</p>
          <Button onClick={fetchProfile} className="mt-4">
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    )
  }
  
  const level = calculateLevel(profile.totalXP)
  const xpProgress = getXPProgress(profile.totalXP)
  const roleInfo = getRolePathInfo(profile.rolePath)
  
  return (
    <DashboardLayout title="Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <Avatar
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-32 w-32 text-4xl"
                />
                <div className="mt-4 text-center">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: roleInfo.color + '20', color: roleInfo.color }}
                  >
                    <DynamicIcon name={roleInfo.icon} className="h-4 w-4" />
                    {roleInfo.name}
                  </div>
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {editing ? (
                      <div className="space-y-3">
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Your name"
                        />
                        <Input
                          value={formData.username}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, username: e.target.value }))
                          }
                          placeholder="Username"
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-2xl font-bold">{profile.name}</h1>
                        <p className="text-muted-foreground">@{profile.username}</p>
                      </>
                    )}
                  </div>
                  
                  {editing ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={handleSave} isLoading={saving}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(true)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
                
                {/* Bio */}
                <div className="mb-4">
                  {editing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {profile.bio || 'No bio yet'}
                    </p>
                  )}
                </div>
                
                {/* Level Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                        {level}
                      </div>
                      <span className="font-medium">Level {level}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {xpProgress.current} / {xpProgress.required} XP
                    </span>
                  </div>
                  <Progress value={xpProgress.percent} variant="gradient" />
                </div>
                
                {/* Stats Row */}
                <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{profile.totalXP.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total XP</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{profile._count.questProgress}</p>
              <p className="text-sm text-muted-foreground">Quests Done</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{profile._count.badges}</p>
              <p className="text-sm text-muted-foreground">Badges</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{profile.longestStreak}</p>
              <p className="text-sm text-muted-foreground">Best Streak</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!profile.badges || profile.badges.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Complete quests to earn badges!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {profile.badges.slice(0, 8).map((userBadge) => (
                  <div
                    key={userBadge.id}
                    className="p-4 rounded-lg border bg-card text-center hover:shadow-md transition-shadow"
                  >
                    <DynamicIcon 
                      name={userBadge.badge.icon} 
                      className="h-10 w-10 mx-auto text-yellow-500"
                    />
                    <p className="font-medium mt-2 text-sm truncate">
                      {userBadge.badge.name}
                    </p>
                    <RarityBadge
                      rarity={userBadge.badge.rarity as any}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
