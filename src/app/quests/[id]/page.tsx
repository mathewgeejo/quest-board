'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { QuestDetail } from '@/components/quest'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface QuestPageProps {
  params: { id: string }
}

export default function QuestPage({ params }: QuestPageProps) {
  const { status } = useSession()
  const router = useRouter()
  const [quest, setQuest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  const fetchQuest = useCallback(async () => {
    try {
      const res = await fetch(`/api/quests/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setQuest(data)
      } else if (res.status === 404) {
        router.push('/quests')
      }
    } catch (error) {
      console.error('Failed to fetch quest:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id, router])
  
  useEffect(() => {
    fetchQuest()
  }, [fetchQuest])
  
  const handleAccept = () => {
    fetchQuest()
  }
  
  const handleTaskComplete = () => {
    fetchQuest()
  }
  
  const handleSubmit = () => {
    fetchQuest()
  }
  
  if (status === 'loading' || loading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </DashboardLayout>
    )
  }
  
  if (!quest) {
    return (
      <DashboardLayout title="Quest Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">This quest doesn't exist</p>
          <Link href="/quests">
            <Button>Browse Quests</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout title={quest.name}>
      <div className="space-y-6">
        <Link href="/quests">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quests
          </Button>
        </Link>
        
        <QuestDetail
          quest={quest}
          onAccept={handleAccept}
          onTaskComplete={handleTaskComplete}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  )
}
