import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/trees - Get all quest trees
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    const rolePath = searchParams.get('rolePath')
    const layer = searchParams.get('layer')
    
    const where: any = { isPublished: true }
    
    if (rolePath) where.rolePaths = { has: rolePath }
    if (layer) where.layer = layer
    
    const trees = await prisma.questTree.findMany({
      where,
      include: {
        _count: {
          select: { quests: true },
        },
        ...(session?.user?.id
          ? {
              quests: {
                select: {
                  id: true,
                  userProgress: {
                    where: { userId: session.user.id },
                    select: {
                      status: true,
                    },
                  },
                },
              },
            }
          : {}),
      },
      orderBy: { order: 'asc' },
    })
    
    // Calculate progress for each tree
    const treesWithProgress = trees.map((tree) => {
      let completedQuests = 0
      let inProgressQuests = 0
      
      if (session?.user?.id && tree.quests) {
        tree.quests.forEach((quest) => {
          const progress = quest.userProgress?.[0]
          if (progress?.status === 'COMPLETED') completedQuests++
          else if (progress?.status === 'IN_PROGRESS') inProgressQuests++
        })
      }
      
      const { quests, ...treeData } = tree
      
      return {
        ...treeData,
        totalQuests: tree._count.quests,
        completedQuests,
        inProgressQuests,
        progressPercent: tree._count.quests > 0
          ? Math.round((completedQuests / tree._count.quests) * 100)
          : 0,
      }
    })
    
    return NextResponse.json(treesWithProgress)
  } catch (error) {
    console.error('Get trees error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
