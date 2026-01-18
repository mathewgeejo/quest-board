import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/trees/[slug] - Get tree with quests
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const slug = params.slug
    
    const tree = await prisma.questTree.findUnique({
      where: { slug },
      include: {
        quests: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          include: {
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
        },
      },
    })
    
    if (!tree) {
      return NextResponse.json({ error: 'Quest tree not found' }, { status: 404 })
    }
    
    // Calculate tree progress
    let completedQuests = 0
    let inProgressQuests = 0
    let totalXPEarned = 0
    
    const questsWithStatus = tree.quests.map((quest) => {
      const userProgress = quest.userProgress?.[0] || null
      
      if (userProgress?.status === 'COMPLETED') {
        completedQuests++
        totalXPEarned += quest.xpReward
      } else if (userProgress?.status === 'IN_PROGRESS') {
        inProgressQuests++
      }
      
      // Check prerequisites
      let prerequisitesMet = true
      if (quest.prerequisiteQuestIds.length > 0) {
        const completedPrereqIds = tree.quests
          .filter((q) => q.userProgress?.[0]?.status === 'COMPLETED')
          .map((q) => q.id)
        
        prerequisitesMet = quest.prerequisiteQuestIds.every((prereqId) =>
          completedPrereqIds.includes(prereqId)
        )
      }
      
      return {
        ...quest,
        userProgress,
        prerequisitesMet,
        isLocked: !prerequisitesMet,
      }
    })
    
    return NextResponse.json({
      ...tree,
      quests: questsWithStatus,
      stats: {
        totalQuests: tree.quests.length,
        completedQuests,
        inProgressQuests,
        progressPercent: tree.quests.length > 0
          ? Math.round((completedQuests / tree.quests.length) * 100)
          : 0,
        totalXPEarned,
        totalXPAvailable: tree.quests.reduce((sum, q) => sum + q.xpReward, 0),
      },
    })
  } catch (error) {
    console.error('Get tree error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
