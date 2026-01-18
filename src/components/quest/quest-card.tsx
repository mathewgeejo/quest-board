'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DifficultyBadge } from '@/components/ui/badge'
import { cn, formatTimeRemaining } from '@/lib/utils'
import { DynamicIcon } from '@/lib/icons'
import { Clock, CheckCircle, Lock, Star, ArrowRight, FileText } from 'lucide-react'
import Link from 'next/link'

interface QuestTask {
  id: string
  title: string
  description?: string
}

interface Quest {
  id: string
  name: string
  description: string
  difficulty: 'NOVICE' | 'APPRENTICE' | 'JOURNEYMAN' | 'EXPERT' | 'MASTER'
  xpReward: number
  estimatedMinutes: number
  tasks: QuestTask[]
  tree?: {
    id: string
    name: string
    icon: string
    color: string
  }
  badge?: {
    id: string
    name: string
    icon: string
  }
  userProgress?: {
    id: string
    status: string
    progressPercent: number
    tasksCompleted: string[]
    deadlineAt?: string
  }
  prerequisitesMet?: boolean
  isLocked?: boolean
}

interface QuestCardProps {
  quest: Quest
  showTree?: boolean
  className?: string
}

export function QuestCard({ quest, showTree = true, className }: QuestCardProps) {
  const isLocked = quest.isLocked || quest.prerequisitesMet === false
  const isInProgress = quest.userProgress?.status === 'IN_PROGRESS'
  const isCompleted = quest.userProgress?.status === 'COMPLETED'
  
  const deadlineText = quest.userProgress?.deadlineAt
    ? formatTimeRemaining(quest.userProgress.deadlineAt)
    : null
  
  return (
    <Link href={isLocked ? '#' : `/quests/${quest.id}`}>
      <Card
        className={cn(
          'quest-card group',
          isLocked && 'opacity-60 cursor-not-allowed',
          isCompleted && 'border-green-500/50',
          className
        )}
        data-difficulty={quest.difficulty}
      >
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {showTree && quest.tree && (
                <DynamicIcon
                  name={quest.tree.icon}
                  className="h-6 w-6"
                  style={{ color: quest.tree.color }}
                />
              )}
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {quest.name}
                </h3>
                {showTree && quest.tree && (
                  <p className="text-xs text-muted-foreground">{quest.tree.name}</p>
                )}
              </div>
            </div>
            
            {isLocked ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <DifficultyBadge difficulty={quest.difficulty} />
            )}
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {quest.description}
          </p>
          
          {/* Progress bar (if in progress) */}
          {isInProgress && quest.userProgress && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{quest.userProgress.progressPercent}%</span>
              </div>
              <Progress
                value={quest.userProgress.progressPercent}
                variant="gradient"
                size="sm"
              />
            </div>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-foreground">{quest.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{quest.estimatedMinutes}min</span>
              </div>
            </div>
            
            {isInProgress && deadlineText && (
              <span className={cn(
                'text-xs',
                deadlineText.includes('Overdue') ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {deadlineText}
              </span>
            )}
            
            {!isLocked && !isInProgress && !isCompleted && (
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            )}
          </div>
          
          {/* Badge preview */}
          {quest.badge && (
            <div className="mt-4 pt-4 border-t flex items-center gap-2 text-xs text-muted-foreground">
              <DynamicIcon name={quest.badge.icon} className="h-5 w-5 text-yellow-500" />
              <span>Unlocks "{quest.badge.name}" badge</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

// Compact version for lists
interface QuestListItemProps {
  quest: Quest
  onAccept?: (questId: string) => void
}

export function QuestListItem({ quest, onAccept }: QuestListItemProps) {
  const isLocked = quest.isLocked || quest.prerequisitesMet === false
  const isInProgress = quest.userProgress?.status === 'IN_PROGRESS'
  const isCompleted = quest.userProgress?.status === 'COMPLETED'
  
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-secondary/50 transition-colors',
        isLocked && 'opacity-60',
        isCompleted && 'border-green-500/30'
      )}
    >
      {/* Status icon */}
      <div className="shrink-0">
        {isLocked ? (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
        ) : isCompleted ? (
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        ) : (
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: quest.tree?.color + '20' }}
          >
            <DynamicIcon 
              name={quest.tree?.icon || 'file-text'} 
              className="h-5 w-5"
              style={{ color: quest.tree?.color }}
            />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium truncate">{quest.name}</h4>
          <DifficultyBadge difficulty={quest.difficulty} />
        </div>
        <p className="text-sm text-muted-foreground truncate">{quest.description}</p>
        
        {isInProgress && quest.userProgress && (
          <div className="mt-2">
            <Progress
              value={quest.userProgress.progressPercent}
              variant="gradient"
              size="sm"
            />
          </div>
        )}
      </div>
      
      {/* XP & Action */}
      <div className="shrink-0 text-right">
        <div className="flex items-center gap-1 text-sm font-medium">
          <Star className="h-4 w-4 text-yellow-500" />
          {quest.xpReward} XP
        </div>
        {!isLocked && !isCompleted && !isInProgress && (
          <Link
            href={`/quests/${quest.id}`}
            className="text-xs text-primary hover:underline"
          >
            View Quest →
          </Link>
        )}
        {isInProgress && (
          <Link
            href={`/quests/${quest.id}`}
            className="text-xs text-primary hover:underline"
          >
            Continue →
          </Link>
        )}
      </div>
    </div>
  )
}
