import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get single tree
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tree = await prisma.questTree.findUnique({
      where: { id: params.id },
      include: {
        quests: {
          select: {
            id: true,
            name: true,
            difficulty: true,
            xpReward: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })
    
    if (!tree) {
      return NextResponse.json({ error: 'Tree not found' }, { status: 404 })
    }
    
    return NextResponse.json(tree)
  } catch (error) {
    console.error('Failed to fetch tree:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update tree
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      slug,
      color,
      icon,
      rolePath,
      isActive,
    } = body
    
    // Check if slug already exists (excluding current tree)
    const existing = await prisma.questTree.findFirst({
      where: {
        slug,
        NOT: { id: params.id },
      },
    })
    
    if (existing) {
      return NextResponse.json({ error: 'A tree with this slug already exists' }, { status: 400 })
    }
    
    const tree = await prisma.questTree.update({
      where: { id: params.id },
      data: {
        name,
        description: description || '',
        slug,
        color: color || '#6366f1',
        icon: icon || 'BookOpen',
      },
    })
    
    return NextResponse.json(tree)
  } catch (error) {
    console.error('Failed to update tree:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete tree
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if tree has quests
    const questCount = await prisma.quest.count({
      where: { treeId: params.id },
    })
    
    if (questCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete tree with ${questCount} linked quest(s). Please remove quests first.` },
        { status: 400 }
      )
    }
    
    // Delete the tree
    await prisma.questTree.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete tree:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
