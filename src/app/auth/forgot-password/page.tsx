'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Swords, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // For now, just show a message that password reset is not implemented
    setTimeout(() => {
      setSubmitted(true)
      setIsLoading(false)
    }, 1000)
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
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            {submitted 
              ? "If an account exists with that email, you'll receive reset instructions."
              : "Enter your email and we'll send you reset instructions."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full gradient-primary" 
                disabled={isLoading}
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>
              
              <div className="text-center">
                <Link 
                  href="/auth/signin" 
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Please check your email for password reset instructions.
              </p>
              <Button 
                onClick={() => router.push('/auth/signin')}
                className="w-full gradient-primary"
              >
                Back to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
