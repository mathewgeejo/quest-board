'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { QuestCard } from '@/components/quest'
import { QuestCardSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'

export default function QuestsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [quests, setQuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    fetchQuests()
  }, [selectedDifficulty, selectedStatus])
  
  const fetchQuests = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty)
      if (selectedStatus) params.append('status', selectedStatus)
      
      const res = await fetch(`/api/quests?${params}`)
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
  
  const difficulties = [
    { value: null, label: 'All Difficulties' },
    { value: 'NOVICE', label: 'Novice' },
    { value: 'APPRENTICE', label: 'Apprentice' },
    { value: 'JOURNEYMAN', label: 'Journeyman' },
    { value: 'EXPERT', label: 'Expert' },
    { value: 'MASTER', label: 'Master' },
  ]
  
  const statuses = [
    { value: null, label: 'All Quests' },
    { value: 'available', label: 'Available' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ]
  
  const filteredQuests = quests.filter((quest) =>
    quest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quest.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  if (status === 'loading') {
    return (
      <DashboardLayout title="Quests">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <QuestCardSkeleton key={i} />
          ))}
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout
      title="Quest Map"
      subtitle="Browse all available quests"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search quests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mr-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Status:</span>
            </div>
            {statuses.map((status) => (
              <Button
                key={status.value || 'all'}
                variant={selectedStatus === status.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status.value)}
              >
                {status.label}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mr-4">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Difficulty:</span>
            </div>
            {difficulties.map((diff) => (
              <Button
                key={diff.value || 'all'}
                variant={selectedDifficulty === diff.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(diff.value)}
              >
                {diff.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Quests Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <QuestCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredQuests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? 'No quests match your search'
                : 'No quests available with these filters'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
