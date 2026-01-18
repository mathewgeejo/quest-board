import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/quests/[id] - Get quest details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const questId = params.id
    
    const quest = await prisma.quest.findUnique({
      where: { id: questId },
      include: {
        tree: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          },
        },
        badge: true,
        ...(session?.user?.id
          ? {
              userProgress: {
                where: { userId: session.user.id },
                include: {
                  quest: {
                    select: {
                      tasks: true,
                    },
                  },
                },
              },
            }
          : {}),
      },
    })
    
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
    }
    
    // Check if prerequisites are met
    let prerequisitesMet = true
    if (session?.user?.id && quest.prerequisiteQuestIds.length > 0) {
      const completedPrereqs = await prisma.userQuestProgress.count({
        where: {
          userId: session.user.id,
          questId: { in: quest.prerequisiteQuestIds },
          status: 'COMPLETED',
        },
      })
      prerequisitesMet = completedPrereqs === quest.prerequisiteQuestIds.length
    }
    
    // Get prerequisite quest names
    const prerequisites = await prisma.quest.findMany({
      where: { id: { in: quest.prerequisiteQuestIds } },
      select: { id: true, name: true },
    })
    
    return NextResponse.json({
      ...quest,
      userProgress: quest.userProgress?.[0] || null,
      prerequisitesMet,
      prerequisites,
    })
  } catch (error) {
    console.error('Get quest error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
