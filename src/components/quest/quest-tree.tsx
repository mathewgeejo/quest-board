'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { DynamicIcon } from '@/lib/icons'
import Link from 'next/link'
import { ChevronRight, Lock, CheckCircle } from 'lucide-react'

interface QuestTreeCardProps {
  tree: {
    id: string
    name: string
    slug: string
    description: string
    icon: string
    color: string
    layer: string
    totalQuests: number
    completedQuests: number
    inProgressQuests: number
    progressPercent: number
  }
  className?: string
}

export function QuestTreeCard({ tree, className }: QuestTreeCardProps) {
  const isCompleted = tree.progressPercent === 100
  const hasStarted = tree.completedQuests > 0 || tree.inProgressQuests > 0
  
  const layerLabels: Record<string, string> = {
    FOUNDATIONS: 'Foundation',
    TOOL_MASTERY: 'Tool Mastery',
    SPECIALIZATION: 'Specialization',
    CAPSTONE: 'Capstone',
  }
  
  return (
    <Link href={`/trees/${tree.slug}`}>
      <Card
        className={cn(
          'group overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
          isCompleted && 'border-green-500/50',
          className
        )}
      >
        <div
          className="h-2"
          style={{ backgroundColor: tree.color }}
        />
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: tree.color + '20' }}
            >
              <DynamicIcon 
                name={tree.icon} 
                className="h-7 w-7"
                style={{ color: tree.color }}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {tree.name}
                </h3>
                {isCompleted && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {tree.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="px-2 py-0.5 rounded-full bg-secondary">
                  {layerLabels[tree.layer] || tree.layer}
                </span>
                <span>{tree.totalQuests} quests</span>
              </div>
              
              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {tree.completedQuests}/{tree.totalQuests}
                  </span>
                </div>
                <Progress
                  value={tree.progressPercent}
                  variant={isCompleted ? 'success' : 'gradient'}
                  size="sm"
                />
              </div>
            </div>
            
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Grid layout for quest trees
interface QuestTreeGridProps {
  trees: QuestTreeCardProps['tree'][]
  className?: string
}

export function QuestTreeGrid({ trees, className }: QuestTreeGridProps) {
  // Group by layer
  const groupedTrees = trees.reduce((acc, tree) => {
    const layer = tree.layer
    if (!acc[layer]) acc[layer] = []
    acc[layer].push(tree)
    return acc
  }, {} as Record<string, typeof trees>)
  
  const layerOrder = ['FOUNDATIONS', 'TOOL_MASTERY', 'SPECIALIZATION', 'CAPSTONE']
  const layerLabels: Record<string, string> = {
    FOUNDATIONS: 'Foundations',
    TOOL_MASTERY: 'Tool Mastery',
    SPECIALIZATION: 'Specialization',
    CAPSTONE: 'Capstone Projects',
  }
  
  return (
    <div className={cn('space-y-8', className)}>
      {layerOrder.map((layer) => {
        const layerTrees = groupedTrees[layer]
        if (!layerTrees?.length) return null
        
        return (
          <div key={layer}>
            <h2 className="text-lg font-semibold mb-4">{layerLabels[layer]}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {layerTrees.map((tree) => (
                <QuestTreeCard key={tree.id} tree={tree} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
