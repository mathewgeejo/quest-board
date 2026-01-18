import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl
    
    // If user is authenticated and trying to access dashboard but hasn't completed onboarding
    if (token && pathname === '/dashboard' && !token.onboardingComplete) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
    
    // If user completed onboarding and tries to access onboarding page, redirect to dashboard
    if (token && pathname === '/onboarding' && token.onboardingComplete) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public routes that don't require authentication
        const publicPaths = ['/', '/auth/signin', '/auth/signup', '/auth/forgot-password', '/onboarding']
        const isPublicPath = publicPaths.some(path => req.nextUrl.pathname === path)
        
        if (isPublicPath) {
          return true
        }
        
        // All other routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
