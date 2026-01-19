import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get single quest
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
    
    // Transform tasks to match Prisma schema
    const transformedTasks = (tasks || []).map((task: any, index: number) => ({
      id: task.id || `task-${Date.now()}-${index}`,
      name: task.title || '',
      description: task.description || '',
      order: task.order || index + 1,
      hints: [],
      verification: null,
    }))
    
    // Transform resources to match Prisma schema
    const transformedResources = (resources || []).map((resource: any) => ({
      type: 'EXTERNAL_LINK' as const,
      name: resource,
      url: resource,
      description: null,
      duration: null,
    }))
    
    const quest = await prisma.quest.update({
      where: { id: params.id },
      data: {
        name,
        description: description || '',
        difficulty: difficulty || 'NOVICE',
        xpReward: xpReward || 100,
        estimatedHours: estimatedHours || 2,
        treeId,
        tasks: transformedTasks,
        resources: transformedResources,
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
