import { NextResponse } from 'next/server'

export async function GET() {
  // For now, everyone is admin (no auth check)
  return NextResponse.json({ isAdmin: true })
}
