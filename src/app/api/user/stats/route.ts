import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/user/stats - Get user stats and dashboard data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const userId = session.user.id
    
    // Get user with counts
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentLevel: true,
        totalXP: true,
        streakCount: true,
        longestStreak: true,
        lastActiveAt: true,
        streakFreezeAvailable: true,
      },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Get quest stats
    const questStats = await prisma.userQuestProgress.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
    })
    
    // Get active quests
    const activeQuests = await prisma.userQuestProgress.findMany({
      where: {
        userId,
        status: 'IN_PROGRESS',
      },
      include: {
        quest: {
          select: {
            id: true,
            name: true,
            difficulty: true,
            xpReward: true,
            tasks: true,
          },
        },
      },
      orderBy: { deadlineAt: 'asc' },
    })
    
    // Get recent badges
    const recentBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
      take: 5,
    })
    
    // Get XP history for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const xpHistory = await prisma.xPTransaction.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        amount: true,
        type: true,
        createdAt: true,
      },
    })
    
    // Calculate weekly XP
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weeklyXP = xpHistory
      .filter((tx) => new Date(tx.createdAt) >= weekAgo)
      .reduce((sum, tx) => sum + tx.amount, 0)
    
    // Format quest stats
    const stats = {
      completed: 0,
      inProgress: 0,
      expired: 0,
    }
    
    questStats.forEach((stat) => {
      if (stat.status === 'COMPLETED') stats.completed = stat._count
      if (stat.status === 'IN_PROGRESS') stats.inProgress = stat._count
      if (stat.status === 'EXPIRED') stats.expired = stat._count
    })
    
    return NextResponse.json({
      user: {
        ...user,
        weeklyXP,
      },
      questStats: stats,
      activeQuests: activeQuests.map((aq) => ({
        id: aq.id,
        questId: aq.quest.id,
        name: aq.quest.name,
        difficulty: aq.quest.difficulty,
        progress: aq.progressPercent,
        tasksCompleted: aq.tasksCompleted.length,
        totalTasks: aq.quest.tasks.length,
        deadlineAt: aq.deadlineAt,
        xpReward: aq.quest.xpReward,
      })),
      recentBadges: recentBadges.map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        icon: ub.badge.icon,
        color: ub.badge.color,
        rarity: ub.badge.rarity,
        earnedAt: ub.earnedAt,
      })),
      xpHistory: xpHistory.map((tx) => ({
        amount: tx.amount,
        type: tx.type,
        date: tx.createdAt,
      })),
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
