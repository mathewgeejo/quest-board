import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { acceptQuestSchema } from '@/lib/validations'

// POST /api/quests/accept - Accept a quest
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate input
    const result = acceptQuestSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { questId } = result.data
    const userId = session.user.id
    
    // Check if quest exists
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
      include: {
        tree: true,
      },
    })
    
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
    }
    
    // Check if already in progress
    const existingProgress = await prisma.userQuestProgress.findUnique({
      where: {
        userId_questId: { userId, questId },
      },
    })
    
    if (existingProgress?.status === 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Quest is already in progress' },
        { status: 400 }
      )
    }
    
    // Check active quest limit (max 3)
    const activeQuestCount = await prisma.userQuestProgress.count({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
    })
    
    if (activeQuestCount >= 3) {
      return NextResponse.json(
        { error: 'You already have 3 active quests. Complete or abandon one first.' },
        { status: 400 }
      )
    }
    
    // Check prerequisites
    if (quest.prerequisiteQuestIds.length > 0) {
      const completedPrereqs = await prisma.userQuestProgress.count({
        where: {
          userId,
          questId: { in: quest.prerequisiteQuestIds },
          status: 'COMPLETED',
        },
      })
      
      if (completedPrereqs < quest.prerequisiteQuestIds.length) {
        return NextResponse.json(
          { error: 'Prerequisites not met' },
          { status: 400 }
        )
      }
    }
    
    // Calculate deadline
    const deadlineAt = new Date()
    deadlineAt.setDate(deadlineAt.getDate() + quest.deadlineDays)
    
    // Create or update progress
    const progress = await prisma.userQuestProgress.upsert({
      where: {
        userId_questId: { userId, questId },
      },
      update: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        deadlineAt,
        tasksCompleted: [],
        progressPercent: 0,
        attemptCount: existingProgress ? existingProgress.attemptCount + 1 : 1,
        currentAttempt: existingProgress ? existingProgress.currentAttempt + 1 : 1,
      },
      create: {
        userId,
        questId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        deadlineAt,
        tasksCompleted: [],
        progressPercent: 0,
        attemptCount: 1,
        currentAttempt: 1,
      },
      include: {
        quest: {
          select: {
            name: true,
            tasks: true,
          },
        },
      },
    })
    
    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'QUEST_UNLOCKED',
        title: 'Quest Accepted!',
        message: `You've started "${quest.name}". Good luck!`,
        actionUrl: `/quests/${questId}`,
        actionText: 'View Quest',
      },
    })
    
    return NextResponse.json({
      message: 'Quest accepted successfully',
      progress: {
        id: progress.id,
        questId: progress.questId,
        name: progress.quest.name,
        status: progress.status,
        deadlineAt: progress.deadlineAt,
        tasksCompleted: progress.tasksCompleted,
        totalTasks: progress.quest.tasks.length,
      },
    })
  } catch (error) {
    console.error('Accept quest error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
