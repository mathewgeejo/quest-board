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
    
    const quest = await prisma.quest.update({
      where: { id: params.id },
      data: {
        name,
        description: description || '',
        difficulty: difficulty || 'NOVICE',
        xpReward: xpReward || 100,
        estimatedHours: estimatedHours || 2,
        treeId,
        tasks: tasks || [],
        resources: resources || [],
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
