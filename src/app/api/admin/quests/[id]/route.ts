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

// GET - Get single quest
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!(await checkAdmin(session.user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const quest = await prisma.quest.findUnique({
      where: { id: params.id },
      include: {
        tree: {
          select: { name: true },
        },
      },
    })
    
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
    }
    
    return NextResponse.json(quest)
  } catch (error) {
    console.error('Failed to fetch quest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update quest
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    const quest = await prisma.quest.update({
      where: { id: params.id },
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
    
    return NextResponse.json(quest)
  } catch (error) {
    console.error('Failed to update quest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete quest
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!(await checkAdmin(session.user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // First delete related progress
    await prisma.userQuestProgress.deleteMany({
      where: { questId: params.id },
    })
    
    // Then delete the quest
    await prisma.quest.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete quest:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
