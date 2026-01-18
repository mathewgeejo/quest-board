'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  BellOff,
  Shield,
  Trash2,
  Save,
  User,
  Palette,
} from 'lucide-react'
import toast from 'react-hot-toast'

type Theme = 'light' | 'dark' | 'system'

export default function SettingsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [theme, setTheme] = useState<Theme>('system')
  const [notifications, setNotifications] = useState({
    questReminders: true,
    streakAlerts: true,
    achievements: true,
    leaderboard: false,
    marketing: false,
  })
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showOnLeaderboard: true,
    showBadges: true,
  })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme || 'system'
    setTheme(savedTheme)
  }, [])
  
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      document.documentElement.classList.toggle('dark', systemTheme === 'dark')
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    
    toast.success(`Theme changed to ${newTheme}`)
  }
  
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }
  
  const handlePrivacyToggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }
  
  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Preferences saved!')
    } catch (error) {
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleDeleteAccount = () => {
    // This would trigger a confirmation modal in a real app
    toast.error('Account deletion is not available in demo mode')
  }
  
  if (status === 'loading') {
    return (
      <DashboardLayout title="Settings">
        <div className="animate-pulse space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-secondary rounded-xl" />
          ))}
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your preferences and account settings"
    >
      <div className="max-w-2xl space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Choose how QuestBoard looks to you
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light' as Theme, label: 'Light', icon: Sun },
                  { value: 'dark' as Theme, label: 'Dark', icon: Moon },
                  { value: 'system' as Theme, label: 'System', icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleThemeChange(value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                      theme === value
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'hover:border-primary/50 hover:bg-secondary/50'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: 'questReminders' as const, label: 'Quest Reminders', description: 'Reminders about active quests and deadlines' },
                { key: 'streakAlerts' as const, label: 'Streak Alerts', description: "Don't break your streak notifications" },
                { key: 'achievements' as const, label: 'Achievements', description: 'Badge unlocks and level-ups' },
                { key: 'leaderboard' as const, label: 'Leaderboard Updates', description: 'Changes in your ranking position' },
                { key: 'marketing' as const, label: 'Updates & Tips', description: 'News, tips, and product updates' },
              ].map(({ key, label, description }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle(key)}
                    className={cn(
                      'relative h-7 w-12 rounded-full transition-colors',
                      notifications[key] ? 'bg-primary' : 'bg-secondary'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all',
                        notifications[key] ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: 'showProfile' as const, label: 'Public Profile', description: 'Allow others to view your profile' },
                { key: 'showOnLeaderboard' as const, label: 'Show on Leaderboard', description: 'Appear in public leaderboards' },
                { key: 'showBadges' as const, label: 'Display Badges', description: 'Show your badges on your profile' },
              ].map(({ key, label, description }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle(key)}
                    className={cn(
                      'relative h-7 w-12 rounded-full transition-colors',
                      privacy[key] ? 'bg-primary' : 'bg-secondary'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all',
                        privacy[key] ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                type="password"
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="submit"
                disabled={!currentPassword || !newPassword || !confirmPassword}
                isLoading={isSaving}
              >
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSavePreferences} isLoading={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
