'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Swords, Github, Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create account')
      }
      
      toast.success('Account created! Signing you in...')
      
      // Auto sign in
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })
      
      if (result?.error) {
        router.push('/auth/signin')
      } else {
        router.push('/onboarding')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/onboarding' })
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
          <CardTitle className="text-2xl">Begin Your Adventure</CardTitle>
          <CardDescription>
            Create your account and start your coding journey
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
                Or create with email
              </span>
            </div>
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hero@questboard.dev"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, and a number
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
          
          {/* Benefits */}
          <div className="space-y-2 text-sm text-muted-foreground">
            {[
              'Access to 100+ coding quests',
              'Track your progress and earn XP',
              'Build a portfolio of projects',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
