import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations'

// Generate a unique username from email
async function generateUniqueUsername(email: string): Promise<string> {
  const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  
  // Try up to 10 times to generate a unique username
  for (let i = 0; i < 10; i++) {
    const random = Math.random().toString(36).substring(2, 6)
    const username = `${base}_${random}`
    
    // Check if this username already exists
    const existing = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })
    
    if (!existing) {
      return username
    }
  }
  
  // If all attempts fail, use timestamp
  return `${base}_${Date.now().toString(36)}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = signUpSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      )
    }
    
    const { name, email, password } = result.data
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)
    
    // Generate unique username
    const username = await generateUniqueUsername(email)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        passwordHash,
        settings: {
          theme: 'dark',
          emailNotifications: true,
          pushNotifications: true,
          weeklyDigest: true,
          showOnLeaderboard: false,
          timezone: 'UTC',
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    })
    
    return NextResponse.json(
      { message: 'Account created successfully', user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    })
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const target = error.meta?.target
      if (target?.includes('email')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 400 }
        )
      }
      if (target?.includes('username')) {
        return NextResponse.json(
          { error: 'This username is already taken' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Account already exists' },
        { status: 400 }
      )
    }
    
    // Handle database connection errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
