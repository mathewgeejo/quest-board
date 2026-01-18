import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { completeTaskSchema } from '@/lib/validations'

// POST /api/quests/task/complete - Complete a task
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate input
    const result = completeTaskSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { progressId, taskId } = result.data
    const userId = session.user.id
    
    // Get progress with quest
    const progress = await prisma.userQuestProgress.findUnique({
      where: { id: progressId },
      include: {
        quest: {
          select: {
            id: true,
            name: true,
            tasks: true,
            xpReward: true,
          },
        },
      },
    })
    
    if (!progress) {
      return NextResponse.json({ error: 'Quest progress not found' }, { status: 404 })
    }
    
    if (progress.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    if (progress.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'Quest is not in progress' },
        { status: 400 }
      )
    }
    
    // Check if task exists
    const taskExists = progress.quest.tasks.some((t) => t.id === taskId)
    if (!taskExists) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    // Check if already completed
    if (progress.tasksCompleted.includes(taskId)) {
      return NextResponse.json(
        { error: 'Task already completed' },
        { status: 400 }
      )
    }
    
    // Update progress
    const newTasksCompleted = [...progress.tasksCompleted, taskId]
    const totalTasks = progress.quest.tasks.length
    const newProgress = Math.round((newTasksCompleted.length / totalTasks) * 100)
    
    const updatedProgress = await prisma.userQuestProgress.update({
      where: { id: progressId },
      data: {
        tasksCompleted: newTasksCompleted,
        progressPercent: newProgress,
      },
    })
    
    return NextResponse.json({
      message: 'Task completed',
      progress: {
        id: updatedProgress.id,
        tasksCompleted: updatedProgress.tasksCompleted,
        progressPercent: updatedProgress.progressPercent,
        isQuestComplete: newProgress === 100,
      },
    })
  } catch (error) {
    console.error('Complete task error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
