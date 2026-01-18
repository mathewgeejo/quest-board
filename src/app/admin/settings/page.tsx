'use client'

import { AdminLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Bell, Shield, Database } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <AdminLayout
      title="Settings"
      subtitle="Configure platform settings"
    >
      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" defaultValue="QuestBoard" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                defaultValue="Gamified Learning Platform"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* XP Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              XP & Leveling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseXP">Base XP per Quest</Label>
                <Input id="baseXP" type="number" defaultValue={50} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="levelMultiplier">Level XP Multiplier</Label>
                <Input
                  id="levelMultiplier"
                  type="number"
                  step="0.1"
                  defaultValue={1.5}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              XP required for next level = Base XP × Level × Multiplier
            </p>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Quest Deadline Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Send reminders before quest deadlines
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Quest Announcements</p>
                <p className="text-sm text-muted-foreground">
                  Notify users when new quests are added
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Admin Emails</p>
                <p className="text-sm text-muted-foreground">
                  Manage allowed admin email domains
                </p>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Authentication Providers</p>
                <p className="text-sm text-muted-foreground">
                  Configure OAuth providers
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground text-center">
          Note: Settings functionality is a placeholder. Full implementation coming soon.
        </p>
      </div>
    </AdminLayout>
  )
}
