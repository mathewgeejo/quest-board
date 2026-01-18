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

// GET - List all trees
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!(await checkAdmin(session.user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
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
