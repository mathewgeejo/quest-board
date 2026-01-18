'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Swords, Github, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      console.log('Attempting sign in...')
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      
      console.log('Sign in result:', result)
      
      if (result?.error) {
        console.error('Sign in error:', result.error)
        toast.error('Invalid email or password')
      } else {
        console.log('Sign in successful, checking onboarding status...')
        
        // Wait a moment for session to update
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check user onboarding status
        try {
          const userRes = await fetch('/api/user')
          console.log('User API response status:', userRes.status)
          
          if (userRes.ok) {
            const userData = await userRes.json()
            console.log('User data:', { 
              id: userData.id, 
              email: userData.email,
              onboardingComplete: userData.onboardingComplete 
            })
            
            if (!userData.onboardingComplete) {
              console.log('Redirecting to onboarding...')
              router.push('/onboarding')
            } else {
              console.log('Redirecting to dashboard...')
              router.push('/dashboard')
            }
          } else {
            console.error('Failed to fetch user data, defaulting to dashboard')
            router.push('/dashboard')
          }
        } catch (apiError) {
          console.error('Error fetching user data:', apiError)
          router.push('/dashboard')
        }
      }
    } catch (error) {
      console.error('Sign in exception:', error)
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' })
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
              <Swords className="h-7 w-7 text-white" />
            </div>
          </Link>
          <CardTitle className="text-2xl">Welcome Back, Adventurer!</CardTitle>
          <CardDescription>
            Sign in to continue your coding quest
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn('github')}
            >
              <Github className="h-5 w-5 mr-2" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignIn('google')}
            >
              <Mail className="h-5 w-5 mr-2" />
              Continue with Google
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="hero@questboard.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
