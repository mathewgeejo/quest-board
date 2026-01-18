import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/user - Get current user with stats
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        bio: true,
        currentLevel: true,
        totalXP: true,
        streakCount: true,
        longestStreak: true,
        lastActiveAt: true,
        rolePath: true,
        onboardingComplete: true,
        advancedMode: true,
        settings: true,
        createdAt: true,
        _count: {
          select: {
            questProgress: {
              where: { status: 'COMPLETED' },
            },
            badges: true,
            artifacts: true,
          },
        },
      },
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Update last active
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lastActiveAt: new Date() },
    })
    
    return NextResponse.json({
      ...user,
      stats: {
        questsCompleted: user._count.questProgress,
        badgesEarned: user._count.badges,
        artifactsCreated: user._count.artifacts,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// PATCH /api/user - Update user profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { name, username, bio, rolePath, settings } = body
    
    // Check username availability if changing
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      })
      
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
    }
    
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (username !== undefined) updateData.username = username
    if (bio !== undefined) updateData.bio = bio
    if (rolePath !== undefined) {
      updateData.rolePath = rolePath
      updateData.onboardingComplete = true
    }
    if (settings !== undefined) updateData.settings = settings
    
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        bio: true,
        currentLevel: true,
        totalXP: true,
        rolePath: true,
        onboardingComplete: true,
        settings: true,
      },
    })
    
    return NextResponse.json(user)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
