import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/quests - Get all quests with filtering
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    const treeId = searchParams.get('treeId')
    const difficulty = searchParams.get('difficulty')
    const status = searchParams.get('status')
    
    const where: any = {
      isPublished: true,
    }
    
    if (treeId) where.treeId = treeId
    if (difficulty) where.difficulty = difficulty
    
    const quests = await prisma.quest.findMany({
      where,
      include: {
        tree: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
        badge: {
          select: {
            id: true,
            name: true,
            icon: true,
            rarity: true,
          },
        },
        ...(session?.user?.id
          ? {
              userProgress: {
                where: { userId: session.user.id },
                select: {
                  id: true,
                  status: true,
                  progressPercent: true,
                  tasksCompleted: true,
                  startedAt: true,
                  completedAt: true,
                  deadlineAt: true,
                },
              },
            }
          : {}),
      },
      orderBy: { order: 'asc' },
    })
    
    // Filter by status if provided and user is authenticated
    let filteredQuests = quests
    if (status && session?.user?.id) {
      if (status === 'available') {
        filteredQuests = quests.filter(
          (q) => !q.userProgress || q.userProgress.length === 0
        )
      } else if (status === 'in_progress') {
        filteredQuests = quests.filter((q) =>
          q.userProgress?.some((p) => p.status === 'IN_PROGRESS')
        )
      } else if (status === 'completed') {
        filteredQuests = quests.filter((q) =>
          q.userProgress?.some((p) => p.status === 'COMPLETED')
        )
      }
    }
    
    return NextResponse.json(
      filteredQuests.map((quest) => ({
        ...quest,
        userProgress: quest.userProgress?.[0] || null,
      }))
    )
  } catch (error) {
    console.error('Get quests error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
