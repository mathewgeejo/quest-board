'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Quest {
  id: string
  name: string
  description: string
  difficulty: string
  xpReward: number
  deadline: string | null
  isActive: boolean
  tree: {
    name: string
  } | null
  createdAt: string
}

export default function AdminQuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)

  useEffect(() => {
    fetchQuests()
  }, [])

  const fetchQuests = async () => {
    try {
      const res = await fetch('/api/admin/quests')
      if (res.ok) {
        const data = await res.json()
        setQuests(data)
      }
    } catch (error) {
      console.error('Failed to fetch quests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (questId: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) return

    try {
      const res = await fetch(`/api/admin/quests/${questId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Quest deleted')
        setQuests(quests.filter((q) => q.id !== questId))
      } else {
        toast.error('Failed to delete quest')
      }
    } catch (error) {
      toast.error('Failed to delete quest')
    }
  }

  const difficulties = ['NOVICE', 'APPRENTICE', 'JOURNEYMAN', 'EXPERT', 'MASTER']

  const filteredQuests = quests.filter((quest) => {
    const matchesSearch =
      quest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = !selectedDifficulty || quest.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      NOVICE: 'bg-green-500/10 text-green-500',
      APPRENTICE: 'bg-blue-500/10 text-blue-500',
      JOURNEYMAN: 'bg-yellow-500/10 text-yellow-500',
      EXPERT: 'bg-orange-500/10 text-orange-500',
      MASTER: 'bg-red-500/10 text-red-500',
    }
    return colors[difficulty] || 'bg-gray-500/10 text-gray-500'
  }

  if (loading) {
    return (
      <AdminLayout title="Quests">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Quest Management"
      subtitle={`${quests.length} quests total`}
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search quests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={selectedDifficulty || ''}
              onChange={(e) => setSelectedDifficulty(e.target.value || null)}
              className="px-3 py-2 border rounded-md text-sm bg-background"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <Link href="/admin/quests/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Quest
            </Button>
          </Link>
        </div>

        {/* Quests List */}
        <Card>
          <CardContent className="p-0">
            {filteredQuests.length > 0 ? (
              <div className="divide-y">
                {filteredQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{quest.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(quest.difficulty)}`}>
                          {quest.difficulty}
                        </span>
                        {!quest.isActive && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/10 text-gray-500">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {quest.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{quest.xpReward} XP</span>
                        {quest.tree && <span>Tree: {quest.tree.name}</span>}
                        {quest.deadline && (
                          <span>Deadline: {new Date(quest.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/admin/quests/${quest.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(quest.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No quests found</p>
                <Link href="/admin/quests/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first quest
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
