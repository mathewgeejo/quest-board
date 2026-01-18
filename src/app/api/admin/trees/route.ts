import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - List all trees
export async function GET() {
  try {
    const trees = await prisma.questTree.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { quests: true },
        },
      },
    })
    
    return NextResponse.json(trees)
  } catch (error) {
    console.error('Failed to fetch trees:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new tree
export async function POST(request: Request) {
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
    
    // Check if slug already exists
    const existing = await prisma.questTree.findUnique({
      where: { slug },
    })
    
    if (existing) {
      return NextResponse.json({ error: 'A tree with this slug already exists' }, { status: 400 })
    }
    
    const tree = await prisma.questTree.create({
      data: {
        name,
        description: description || '',
        slug,
        color: color || '#6366f1',
        icon: icon || 'BookOpen',
      },
    })
    
    return NextResponse.json(tree, { status: 201 })
  } catch (error) {
    console.error('Failed to create tree:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
