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
      estimatedHours,
      treeId,
      tasks,
      resources,
    } = body
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    const quest = await prisma.quest.create({
      data: {
        slug,
        name,
        description: description || '',
        difficulty: difficulty || 'NOVICE',
        xpReward: xpReward || 100,
        estimatedHours: estimatedHours || 2,
        treeId,
        tasks: tasks || [],
        resources: resources || [],
        learningObjectives: [],
      },
    })
    
    return NextResponse.json(quest, { status: 201 })
  } catch (error) {
    console.error('Failed to create quest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
