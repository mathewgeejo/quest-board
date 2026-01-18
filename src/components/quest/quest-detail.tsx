'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DifficultyBadge, RarityBadge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { cn, formatTimeRemaining } from '@/lib/utils'
import { DynamicIcon } from '@/lib/icons'
import {
  Clock,
  CheckCircle,
  Circle,
  Star,
  Trophy,
  ExternalLink,
  Play,
  Send,
  AlertCircle,
  PartyPopper,
  Award,
  Lightbulb,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface QuestTask {
  id: string
  title: string
  description?: string
  resourceUrl?: string
}

interface QuestDetailProps {
  quest: {
    id: string
    name: string
    description: string
    difficulty: 'NOVICE' | 'APPRENTICE' | 'JOURNEYMAN' | 'EXPERT' | 'MASTER'
    xpReward: number
    estimatedMinutes: number
    deadlineDays: number
    tasks: QuestTask[]
    learningObjectives: string[]
    resources: Array<{ title: string; url: string; type: string }>
    hints?: string[]
    tree?: {
      id: string
      name: string
      slug: string
      icon: string
      color: string
    }
    badge?: {
      id: string
      name: string
      description: string
      icon: string
      rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
    }
    userProgress?: {
      id: string
      status: string
      progressPercent: number
      tasksCompleted: string[]
      deadlineAt?: string
      startedAt?: string
    }
    prerequisitesMet: boolean
    prerequisites?: Array<{ id: string; name: string }>
  }
  onAccept?: () => void
  onTaskComplete?: (taskId: string) => void
  onSubmit?: (artifactUrl?: string) => void
}

export function QuestDetail({
  quest,
  onAccept,
  onTaskComplete,
  onSubmit,
}: QuestDetailProps) {
  const [isAccepting, setIsAccepting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [artifactUrl, setArtifactUrl] = useState('')
  const [showHints, setShowHints] = useState(false)
  
  const isInProgress = quest.userProgress?.status === 'IN_PROGRESS'
  const isCompleted = quest.userProgress?.status === 'COMPLETED'
  const canAccept = quest.prerequisitesMet && !isInProgress && !isCompleted
  const canSubmit = isInProgress && quest.userProgress?.progressPercent === 100
  
  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      const res = await fetch('/api/quests/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId: quest.id }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to accept quest')
      }
      
      toast.success('Quest accepted! Good luck!')
      onAccept?.()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsAccepting(false)
    }
  }
  
  const handleTaskComplete = async (taskId: string) => {
    if (!quest.userProgress) return
    
    try {
      const res = await fetch('/api/quests/task/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressId: quest.userProgress.id,
          taskId,
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to complete task')
      }
      
      toast.success('Task completed!')
      onTaskComplete?.(taskId)
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  
  const handleSubmit = async () => {
    if (!quest.userProgress) return
    
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/quests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progressId: quest.userProgress.id,
          artifactUrl: artifactUrl || undefined,
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to submit quest')
      }
      
      const result = await res.json()
      setShowSubmitModal(false)
      toast.success(`Quest completed! You earned ${result.xpEarned} XP!`)
      
      if (result.leveledUp) {
        toast.success(`Level up! You're now level ${result.newLevel}!`, {
          duration: 5000,
          icon: <PartyPopper className="h-5 w-5 text-yellow-500" />,
        })
      }
      
      if (result.badgeAwarded) {
        toast.success(`Badge earned: ${result.badgeAwarded.name}!`, {
          duration: 5000,
          icon: <Award className="h-5 w-5 text-yellow-500" />,
        })
      }
      
      onSubmit?.(artifactUrl)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {quest.tree && (
                <div
                  className="h-16 w-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: quest.tree.color + '20' }}
                >
                  <DynamicIcon 
                    name={quest.tree.icon}
                    className="h-8 w-8"
                    style={{ color: quest.tree.color }}
                  />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{quest.name}</h1>
                  {isCompleted && <CheckCircle className="h-6 w-6 text-green-500" />}
                </div>
                {quest.tree && (
                  <p className="text-muted-foreground">{quest.tree.name}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <DifficultyBadge difficulty={quest.difficulty} />
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{quest.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>~{quest.estimatedMinutes} min</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {canAccept && (
                <Button onClick={handleAccept} isLoading={isAccepting}>
                  <Play className="h-4 w-4 mr-2" />
                  Accept Quest
                </Button>
              )}
              {canSubmit && (
                <Button onClick={() => setShowSubmitModal(true)}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Quest
                </Button>
              )}
              {!quest.prerequisitesMet && !isInProgress && !isCompleted && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Prerequisites required
                </div>
              )}
            </div>
          </div>
          
          {/* Progress */}
          {isInProgress && quest.userProgress && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Quest Progress</span>
                <span className="font-medium">{quest.userProgress.progressPercent}%</span>
              </div>
              <Progress
                value={quest.userProgress.progressPercent}
                variant="gradient"
              />
              {quest.userProgress.deadlineAt && (
                <p className="text-sm text-muted-foreground mt-2">
                  Deadline: {formatTimeRemaining(quest.userProgress.deadlineAt)}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Description & Objectives */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{quest.description}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {quest.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Prerequisites */}
      {quest.prerequisites && quest.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quest.prerequisites.map((prereq) => (
                <div
                  key={prereq.id}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-sm',
                    quest.prerequisitesMet
                      ? 'bg-green-500/10 border-green-500/30 text-green-600'
                      : 'bg-muted'
                  )}
                >
                  {prereq.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tasks ({quest.tasks.length})</CardTitle>
          {isInProgress && (
            <span className="text-sm text-muted-foreground">
              {quest.userProgress?.tasksCompleted.length || 0} / {quest.tasks.length} completed
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quest.tasks.map((task, index) => {
              const isTaskCompleted = quest.userProgress?.tasksCompleted.includes(task.id)
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-lg border',
                    isTaskCompleted && 'bg-green-500/5 border-green-500/30'
                  )}
                >
                  <div className="shrink-0 mt-0.5">
                    {isTaskCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : isInProgress ? (
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className="h-6 w-6 rounded-full border-2 border-muted-foreground hover:border-primary transition-colors"
                      />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Task {index + 1}
                      </span>
                    </div>
                    <h4 className={cn(
                      'font-medium',
                      isTaskCompleted && 'line-through text-muted-foreground'
                    )}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}
                    {task.resourceUrl && (
                      <a
                        href={task.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Resource
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Resources */}
      {quest.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {quest.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{resource.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Hints */}
      {quest.hints && quest.hints.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hints</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)}>
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </div>
          </CardHeader>
          {showHints && (
            <CardContent>
              <ul className="space-y-2">
                {quest.hints.map((hint, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                    {hint}
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      )}
      
      {/* Badge Reward */}
      {quest.badge && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <DynamicIcon 
                  name={quest.badge.icon} 
                  className="h-8 w-8 text-yellow-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600">Badge Reward</span>
                </div>
                <h3 className="text-lg font-bold">{quest.badge.name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{quest.badge.description}</p>
                  <RarityBadge rarity={quest.badge.rarity} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Quest"
        description="Add a link to your completed work (optional)"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Project/Repository URL (optional)
            </label>
            <input
              type="url"
              value={artifactUrl}
              onChange={(e) => setArtifactUrl(e.target.value)}
              placeholder="https://github.com/username/project"
              className="w-full px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Share your work to add it to your portfolio
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isSubmitting}>
              Submit Quest
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
