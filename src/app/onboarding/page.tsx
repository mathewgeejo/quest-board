'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  Swords,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Palette,
  Server,
  Wrench,
  Rocket,
  BarChart3,
  Shield,
  Sprout,
  Leaf,
  TreeDeciduous,
  Mountain,
  Target,
  Star,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to QuestBoard!',
    description: "Let's set up your adventure. This will only take a minute.",
  },
  {
    id: 'role',
    title: 'Choose Your Path',
    description: 'Select the role that best matches your interests. You can change this later.',
  },
  {
    id: 'experience',
    title: 'Your Experience Level',
    description: 'Help us recommend the right quests for you.',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: 'Your adventure begins now. Ready to start your first quest?',
  },
]

const ROLE_PATHS: { value: string; Icon: LucideIcon; name: string; color: string; description: string }[] = [
  {
    value: 'FRONTEND',
    Icon: Palette,
    name: 'Frontend Developer',
    color: '#3B82F6',
    description: 'Build beautiful user interfaces with HTML, CSS, JavaScript, and React.',
  },
  {
    value: 'BACKEND',
    Icon: Server,
    name: 'Backend Developer',
    color: '#10B981',
    description: 'Create APIs, databases, and server-side applications.',
  },
  {
    value: 'DEVOPS',
    Icon: Wrench,
    name: 'DevOps Engineer',
    color: '#F59E0B',
    description: 'Master deployment, CI/CD, and cloud infrastructure.',
  },
  {
    value: 'FULLSTACK',
    Icon: Rocket,
    name: 'Full-Stack Developer',
    color: '#8B5CF6',
    description: 'Learn both frontend and backend development.',
  },
  {
    value: 'SECURITY',
    Icon: Shield,
    name: 'Security Engineer',
    color: '#EF4444',
    description: 'Master application security, penetration testing, and compliance.',
  },
  {
    value: 'PRODUCT',
    Icon: BarChart3,
    name: 'Product Manager',
    color: '#EC4899',
    description: 'Learn product strategy, user research, and agile methodologies.',
  },
]

const EXPERIENCE_LEVELS: { value: string; title: string; description: string; Icon: LucideIcon }[] = [
  {
    value: 'BEGINNER',
    title: 'Complete Beginner',
    description: "I've never written code before",
    Icon: Sprout,
  },
  {
    value: 'NOVICE',
    title: 'Novice',
    description: "I've done some tutorials or courses",
    Icon: Leaf,
  },
  {
    value: 'INTERMEDIATE',
    title: 'Intermediate',
    description: "I've built some personal projects",
    Icon: TreeDeciduous,
  },
  {
    value: 'EXPERIENCED',
    title: 'Experienced',
    description: "I've worked on professional projects",
    Icon: Mountain,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()
  const [currentStep, setCurrentStep] = useState(0)
  const [rolePath, setRolePath] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleNext = () => {
    if (currentStep === 1 && !rolePath) {
      toast.error('Please select a role path')
      return
    }
    if (currentStep === 2 && !experienceLevel) {
      toast.error('Please select your experience level')
      return
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rolePath,
          experienceLevel,
          onboardingComplete: true,
        }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to save preferences')
      }
      
      toast.success('Setup complete! Let the adventure begin!')
      
      // Update session with new onboarding status
      await updateSession({ onboardingComplete: true })
      
      // Wait a moment for session to fully update
      await new Promise(resolve => setTimeout(resolve, 500))
      
      router.push('/dashboard')
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const progress = ((currentStep + 1) / STEPS.length) * 100
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} variant="gradient" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Step {currentStep + 1} of {STEPS.length}
          </p>
        </div>
        
        {/* Step Content */}
        <Card className="overflow-hidden">
          <CardContent className="p-8">
            {/* Welcome Step */}
            {currentStep === 0 && (
              <div className="text-center">
                <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                  <Swords className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-4">{STEPS[0].title}</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  {STEPS[0].description}
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                  {[
                    { Icon: Target, label: 'Complete Quests', color: '#8B5CF6' },
                    { Icon: Star, label: 'Earn XP', color: '#F59E0B' },
                    { Icon: Trophy, label: 'Unlock Badges', color: '#10B981' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-secondary/50"
                    >
                      <item.Icon className="h-8 w-8 mx-auto" style={{ color: item.color }} />
                      <p className="font-medium mt-2">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Role Selection Step */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  {STEPS[1].title}
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  {STEPS[1].description}
                </p>
                <div className="grid gap-3">
                  {ROLE_PATHS.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setRolePath(role.value)}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border text-left transition-all',
                        rolePath === role.value
                          ? 'border-primary bg-primary/5 ring-2 ring-primary'
                          : 'hover:border-primary/50 hover:bg-secondary/50'
                      )}
                    >
                      <div
                        className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: role.color + '20' }}
                      >
                        <role.Icon className="h-7 w-7" style={{ color: role.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{role.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                      {rolePath === role.value && (
                        <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Experience Level Step */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  {STEPS[2].title}
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  {STEPS[2].description}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setExperienceLevel(level.value)}
                      className={cn(
                        'p-6 rounded-xl border text-center transition-all',
                        experienceLevel === level.value
                          ? 'border-primary bg-primary/5 ring-2 ring-primary'
                          : 'hover:border-primary/50 hover:bg-secondary/50'
                      )}
                    >
                      <level.Icon className="h-10 w-10 mx-auto text-primary" />
                      <p className="font-semibold mt-3">{level.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {level.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Complete Step */}
            {currentStep === 3 && (
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{STEPS[3].title}</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {STEPS[3].description}
                </p>
                
                <div className="p-6 rounded-xl bg-secondary/50 mb-8">
                  <p className="text-sm text-muted-foreground mb-2">Your Selected Path</p>
                  <div className="flex items-center justify-center gap-3">
                    {(() => {
                      const selectedRole = ROLE_PATHS.find((r) => r.value === rolePath)
                      if (!selectedRole) return null
                      return (
                        <>
                          <selectedRole.Icon className="h-8 w-8" style={{ color: selectedRole.color }} />
                          <span className="text-xl font-semibold">{selectedRole.name}</span>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              {currentStep < STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} isLoading={isSubmitting}>
                  Start My Adventure
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
