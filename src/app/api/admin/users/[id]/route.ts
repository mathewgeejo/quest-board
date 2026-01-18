import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isAdmin: true },
    })

    if (!currentUser?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Prevent removing own admin status
    if (currentUser.id === params.id) {
      return NextResponse.json(
        { error: 'Cannot modify your own admin status' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { isAdmin } = body

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { isAdmin },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
