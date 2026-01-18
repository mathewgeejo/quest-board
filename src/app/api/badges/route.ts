import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/badges - Get all badges
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    
    const type = searchParams.get('type')
    const rarity = searchParams.get('rarity')
    
    const where: any = {}
    if (type) where.type = type
    if (rarity) where.rarity = rarity
    
    const badges = await prisma.badge.findMany({
      where,
      include: {
        ...(session?.user?.id
          ? {
              userBadges: {
                where: { userId: session.user.id },
                select: {
                  id: true,
                  earnedAt: true,
                  context: true,
                },
              },
            }
          : {}),
        _count: {
          select: { userBadges: true },
        },
      },
      orderBy: [
        { rarity: 'desc' },
        { name: 'asc' },
      ],
    })
    
    return NextResponse.json(
      badges.map((badge) => ({
        ...badge,
        earned: badge.userBadges?.length > 0,
        earnedAt: badge.userBadges?.[0]?.earnedAt || null,
        earnedCount: badge._count.userBadges,
      }))
    )
  } catch (error) {
    console.error('Get badges error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
