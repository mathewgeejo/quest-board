import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { submitQuestSchema } from '@/lib/validations'
import { calculateQuestXP, calculateLevel } from '@/lib/utils'

// POST /api/quests/submit - Submit completed quest
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate input
    const result = submitQuestSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { progressId, artifactUrl, notes } = result.data
    const userId = session.user.id
    
    // Get progress with quest and user
    const progress = await prisma.userQuestProgress.findUnique({
      where: { id: progressId },
      include: {
        quest: {
          include: {
            badge: true,
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
    
    // Check if all tasks completed
    if (progress.progressPercent < 100) {
      return NextResponse.json(
        { error: 'All tasks must be completed before submitting' },
        { status: 400 }
      )
    }
    
    // Get user for XP calculation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalXP: true,
        streakCount: true,
        currentLevel: true,
      },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Calculate XP
    const completedEarly = progress.deadlineAt ? new Date() < progress.deadlineAt : false
    const firstTry = progress.attemptCount === 1
    
    const { total: xpEarned, breakdown } = calculateQuestXP(
      progress.quest.xpReward,
      progress.quest.difficulty,
      completedEarly,
      user.streakCount,
      firstTry
    )
    
    const newTotalXP = user.totalXP + xpEarned
    const newLevel = calculateLevel(newTotalXP)
    const leveledUp = newLevel > user.currentLevel
    
    // Start transaction
    const [updatedProgress, updatedUser] = await prisma.$transaction([
      // Update progress
      prisma.userQuestProgress.update({
        where: { id: progressId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          xpEarned,
          evaluation: 'MEETS_EXPECTATIONS',
          notes,
        },
      }),
      
      // Update user XP and level
      prisma.user.update({
        where: { id: userId },
        data: {
          totalXP: newTotalXP,
          currentLevel: newLevel,
          streakCount: { increment: 1 },
          lastActiveAt: new Date(),
        },
      }),
    ])
    
    // Create XP transaction
    await prisma.xPTransaction.create({
      data: {
        userId,
        amount: xpEarned,
        type: 'QUEST_COMPLETE',
        referenceId: progress.questId,
        referenceType: 'quest',
        description: `Completed quest: ${progress.quest.name}`,
        balanceBefore: user.totalXP,
        balanceAfter: newTotalXP,
      },
    })
    
    // Award badge if quest has one
    let badgeAwarded = null
    if (progress.quest.badgeId) {
      const existingBadge = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId: progress.quest.badgeId,
          },
        },
      })
      
      if (!existingBadge) {
        const userBadge = await prisma.userBadge.create({
          data: {
            userId,
            badgeId: progress.quest.badgeId,
            context: `Completed quest: ${progress.quest.name}`,
          },
          include: {
            badge: true,
          },
        })
        badgeAwarded = userBadge.badge
        
        // Create badge notification
        await prisma.notification.create({
          data: {
            userId,
            type: 'BADGE_EARNED',
            title: 'Badge Earned!',
            message: `You earned the "${userBadge.badge.name}" badge!`,
            actionUrl: '/profile/badges',
            actionText: 'View Badges',
          },
        })
      }
    }
    
    // Create artifact if URL provided
    if (artifactUrl) {
      await prisma.artifact.create({
        data: {
          userId,
          questId: progress.questId,
          title: `${progress.quest.name} Artifact`,
          type: 'REPOSITORY',
          url: artifactUrl,
          isPublic: true,
        },
      })
    }
    
    // Create level up notification
    if (leveledUp) {
      await prisma.notification.create({
        data: {
          userId,
          type: 'LEVEL_UP',
          title: 'Level Up!',
          message: `Congratulations! You've reached level ${newLevel}!`,
          actionUrl: '/profile',
          actionText: 'View Profile',
        },
      })
    }
    
    // Create completion notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'QUEST_UNLOCKED',
        title: 'Quest Completed!',
        message: `You earned ${xpEarned} XP for completing "${progress.quest.name}"`,
        actionUrl: `/quests/${progress.questId}`,
        actionText: 'View Quest',
      },
    })
    
    return NextResponse.json({
      message: 'Quest completed successfully!',
      xpEarned,
      xpBreakdown: breakdown,
      newTotalXP,
      newLevel,
      leveledUp,
      badgeAwarded,
    })
  } catch (error) {
    console.error('Submit quest error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
