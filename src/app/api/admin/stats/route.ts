import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get stats
    const [totalQuests, totalTrees, totalUsers, totalBadges, recentQuests, recentUsers] = await Promise.all([
      prisma.quest.count(),
      prisma.questTree.count(),
      prisma.user.count(),
      prisma.badge.count(),
      prisma.quest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          difficulty: true,
          xpReward: true,
          createdAt: true,
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          currentLevel: true,
          totalXP: true,
          createdAt: true,
        },
      }),
    ])
    
    return NextResponse.json({
      totalQuests,
      totalTrees,
      totalUsers,
      totalBadges,
      recentQuests,
      recentUsers,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
