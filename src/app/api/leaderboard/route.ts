import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/leaderboard - Get leaderboard
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    const period = searchParams.get('period') || 'all_time'
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    
    // Get date range based on period
    let startDate: Date | null = null
    const now = new Date()
    
    switch (period) {
      case 'daily':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'monthly':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
    }
    
    // Get top users by XP
    const users = await prisma.user.findMany({
      where: {
        totalXP: { gt: 0 },
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        totalXP: true,
        currentLevel: true,
        rolePath: true,
        _count: {
          select: {
            questProgress: {
              where: { status: 'COMPLETED' },
            },
            badges: true,
          },
        },
        ...(startDate
          ? {
              xpTransactions: {
                where: {
                  createdAt: { gte: startDate },
                },
                select: {
                  amount: true,
                },
              },
            }
          : {}),
      },
      orderBy: { totalXP: 'desc' },
      take: limit,
    })
    
    // Calculate rankings
    const leaderboard = users.map((user, index) => {
      const periodXP = startDate
        ? user.xpTransactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0
        : user.totalXP
      
      return {
        rank: index + 1,
        userId: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        totalXP: user.totalXP,
        periodXP,
        level: user.currentLevel,
        rolePath: user.rolePath,
        questsCompleted: user._count.questProgress,
        badgesEarned: user._count.badges,
        isCurrentUser: user.id === session?.user?.id,
      }
    })
    
    // If user is authenticated and not in top, find their rank
    let currentUserRank = null
    if (session?.user?.id && !leaderboard.find((l) => l.isCurrentUser)) {
      const userRank = await prisma.user.count({
        where: {
          totalXP: {
            gt: (
              await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { totalXP: true },
              })
            )?.totalXP || 0,
          },
        },
      })
      
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          totalXP: true,
          currentLevel: true,
          rolePath: true,
          _count: {
            select: {
              questProgress: { where: { status: 'COMPLETED' } },
              badges: true,
            },
          },
        },
      })
      
      if (user) {
        currentUserRank = {
          rank: userRank + 1,
          userId: user.id,
          name: user.name,
          username: user.username,
          avatarUrl: user.avatarUrl,
          totalXP: user.totalXP,
          periodXP: user.totalXP,
          level: user.currentLevel,
          rolePath: user.rolePath,
          questsCompleted: user._count.questProgress,
          badgesEarned: user._count.badges,
          isCurrentUser: true,
        }
      }
    }
    
    return NextResponse.json({
      leaderboard,
      currentUserRank,
      period,
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
