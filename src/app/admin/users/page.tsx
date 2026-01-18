'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar } from '@/components/ui/avatar'
import {
  Search,
  Shield,
  ShieldOff,
  Crown,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  currentLevel: number
  totalXP: number
  rolePath: string | null
  isAdmin: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'remove admin from' : 'make admin'
    if (!confirm(`Are you sure you want to ${action} this user?`)) return

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      })
      
      if (res.ok) {
        toast.success(`User ${currentStatus ? 'demoted' : 'promoted'} successfully`)
        setUsers(users.map(u => 
          u.id === userId ? { ...u, isAdmin: !currentStatus } : u
        ))
      } else {
        toast.error('Failed to update user')
      }
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <AdminLayout title="Users">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="User Management"
      subtitle={`${users.length} users total`}
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Users List */}
        <Card>
          <CardContent className="p-0">
            {filteredUsers.length > 0 ? (
              <div className="divide-y">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={user.image}
                        alt={user.name || user.email}
                        className="h-12 w-12"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.name || 'No name'}</p>
                          {user.isAdmin && (
                            <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                              <Crown className="h-3 w-3" />
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>Level {user.currentLevel}</span>
                          <span>{user.totalXP} XP</span>
                          {user.rolePath && <span>{user.rolePath}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <span className="text-xs text-muted-foreground mr-2">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAdmin(user.id, user.isAdmin)}
                        className={user.isAdmin ? 'text-destructive hover:text-destructive' : ''}
                      >
                        {user.isAdmin ? (
                          <>
                            <ShieldOff className="h-4 w-4 mr-1" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-1" />
                            Make Admin
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
