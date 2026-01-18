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

// GET - Get single tree
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
    
    const tree = await prisma.questTree.findUnique({
      where: { id: params.id },
      include: {
        quests: {
          select: {
            id: true,
            name: true,
            difficulty: true,
            layer: true,
            order: true,
          },
          orderBy: [
            { layer: 'asc' },
            { order: 'asc' },
          ],
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
        rolePath: rolePath || null,
        isActive: isActive ?? true,
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (!(await checkAdmin(session.user.id))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    // Unlink all quests from this tree (don't delete them)
    await prisma.quest.updateMany({
      where: { treeId: params.id },
      data: { treeId: null },
    })
    
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
