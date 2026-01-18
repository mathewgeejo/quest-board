'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { QuestCard, QuestListItem } from '@/components/quest'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { QuestCardSkeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface TreeDetailPageProps {
  params: { slug: string }
}

export default function TreeDetailPage({ params }: TreeDetailPageProps) {
  const { status } = useSession()
  const router = useRouter()
  const [tree, setTree] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  useEffect(() => {
    fetchTree()
  }, [params.slug])
  
  const fetchTree = async () => {
    try {
      const res = await fetch(`/api/trees/${params.slug}`)
      if (res.ok) {
        const data = await res.json()
        setTree(data)
      } else if (res.status === 404) {
        router.push('/trees')
      }
    } catch (error) {
      console.error('Failed to fetch tree:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (status === 'loading' || loading) {
    return (
      <DashboardLayout title="Loading...">
        <div className="space-y-6">
          <div className="h-40 rounded-xl skeleton" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <QuestCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }
  
  if (!tree) {
    return (
      <DashboardLayout title="Quest Tree Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">This quest tree doesn't exist</p>
          <Link href="/trees">
            <Button>Browse Quest Trees</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }
  
  const isComplete = tree.stats.progressPercent === 100
  
  return (
    <DashboardLayout
      title={tree.name}
      subtitle={tree.description}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/trees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quest Trees
          </Button>
        </Link>
        
        {/* Tree Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div
                className="h-24 w-24 rounded-2xl flex items-center justify-center text-5xl shrink-0"
                style={{ backgroundColor: tree.color + '20' }}
              >
                {tree.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{tree.name}</h1>
                  {isComplete && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Complete
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{tree.description}</p>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tree Progress</span>
                    <span className="font-medium">
                      {tree.stats.completedQuests}/{tree.stats.totalQuests} quests ({tree.stats.progressPercent}%)
                    </span>
                  </div>
                  <Progress
                    value={tree.stats.progressPercent}
                    variant={isComplete ? 'success' : 'gradient'}
                  />
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 md:w-48 shrink-0">
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-2xl font-bold">{tree.stats.totalQuests}</p>
                  <p className="text-xs text-muted-foreground">Quests</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary text-center">
                  <p className="text-2xl font-bold">{tree.stats.totalXPAvailable}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 text-center">
                  <p className="text-2xl font-bold text-green-600">{tree.stats.completedQuests}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                  <p className="text-2xl font-bold text-blue-600">{tree.stats.inProgressQuests}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quests List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quests in this Tree</h2>
          
          <div className="space-y-3">
            {tree.quests.map((quest: any) => (
              <QuestListItem key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
