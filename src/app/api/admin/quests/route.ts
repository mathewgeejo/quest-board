import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Check if user is admin
async function checkAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  })
  return user?.isAdmin || false
}

// GET - List all quests
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!(await checkAdmin(session.user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const quests = await prisma.quest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tree: {
          select: { name: true },
        },
      },
    })
    
    return NextResponse.json(quests)
  } catch (error) {
    console.error('Failed to fetch quests:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new quest
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!(await checkAdmin(session.user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const body = await request.json()
    const {
      name,
      description,
      difficulty,
      xpReward,
      estimatedTime,
      deadline,
      treeId,
      layer,
      order,
      tasks,
      resources,
      hints,
      isActive,
    } = body
    
    const quest = await prisma.quest.create({
      data: {
        name,
        description: description || '',
        difficulty: difficulty || 'NOVICE',
        xpReward: xpReward || 50,
        estimatedTime: estimatedTime || 30,
        deadline: deadline ? new Date(deadline) : null,
        treeId: treeId || null,
        layer: treeId ? (layer || 'FOUNDATIONS') : 'FOUNDATIONS',
        order: order || 1,
        tasks: tasks || [],
        resources: resources || [],
        hints: hints || [],
        isActive: isActive ?? true,
      },
    })
    
    return NextResponse.json(quest, { status: 201 })
  } catch (error) {
    console.error('Failed to create quest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
