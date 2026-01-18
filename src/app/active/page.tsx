'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { QuestCard } from '@/components/quest'
import { QuestCardSkeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function ActiveQuestsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [quests, setQuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    fetchActiveQuests()
  }, [])
  
  const fetchActiveQuests = async () => {
    try {
      const res = await fetch('/api/quests?status=in_progress')
      if (res.ok) {
        const data = await res.json()
        setQuests(data)
      }
    } catch (error) {
      console.error('Failed to fetch active quests:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (status === 'loading') {
    return (
      <DashboardLayout title="Active Quests">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <QuestCardSkeleton key={i} />
          ))}
        </div>
      </DashboardLayout>
    )
  }
  
  return (
    <DashboardLayout
      title="Active Quests"
      subtitle={`${quests.length} quest${quests.length !== 1 ? 's' : ''} in progress`}
    >
      <div className="space-y-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <QuestCardSkeleton key={i} />
            ))}
          </div>
        ) : quests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">No Active Quests</h3>
              <p className="text-muted-foreground mb-6">
                You don't have any quests in progress. Browse the quest map to find your next adventure!
              </p>
              <Link href="/quests">
                <Button>
                  Find Quests <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        )}
        
        {quests.length > 0 && quests.length < 3 && (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                You can have up to 3 active quests at a time.
                {3 - quests.length > 0 && ` You have ${3 - quests.length} slot${3 - quests.length !== 1 ? 's' : ''} available.`}
              </p>
              <Link href="/quests">
                <Button variant="outline">
                  Browse More Quests
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
