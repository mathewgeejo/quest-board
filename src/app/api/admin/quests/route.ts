import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - List all quests
export async function GET() {
  try {
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
    
    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Quest name is required' }, { status: 400 })
    }
    
    if (!treeId) {
      return NextResponse.json({ error: 'Quest tree is required' }, { status: 400 })
    }
    
    // Generate slug from name with timestamp to ensure uniqueness
    const baseSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const slug = `${baseSlug}-${Date.now()}`
    
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
  } catch (error: any) {
    console.error('Failed to create quest:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create quest' },
      { status: 500 }
    )
  }
}
