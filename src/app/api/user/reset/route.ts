import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/user/reset - Reset user stats to fresh state
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Reset user stats
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: 0,
        currentLevel: 1,
        streakCount: 0,
        longestStreak: 0,
        lastActiveAt: new Date(),
      },
      select: {
        id: true,
        totalXP: true,
        currentLevel: true,
        streakCount: true,
        longestStreak: true,
      },
    })
    
    // Delete all quest progress for the user
    await prisma.userQuestProgress.deleteMany({
      where: { userId: session.user.id },
    })
    
    // Delete all user badges
    await prisma.userBadge.deleteMany({
      where: { userId: session.user.id },
    })
    
    // Delete all XP history
    await prisma.xPTransaction.deleteMany({
      where: { userId: session.user.id },
    })
    
    // Delete all artifacts
    await prisma.artifact.deleteMany({
      where: { userId: session.user.id },
    })
    
    // Delete all notifications
    await prisma.notification.deleteMany({
      where: { userId: session.user.id },
    })
    
    return NextResponse.json({
      message: 'Stats reset successfully',
      user,
    })
  } catch (error) {
    console.error('Reset user stats error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
