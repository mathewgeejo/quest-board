'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Swords,
  Map,
  Trophy,
  Zap,
  Users,
  Code,
  ArrowRight,
  CheckCircle,
  Star,
  Palette,
  Server,
  Wrench,
  Rocket,
  BarChart3,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg gradient-primary flex items-center justify-center">
              <Swords className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl">QuestBoard</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#paths" className="text-muted-foreground hover:text-foreground transition-colors">
              Learning Paths
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link href="#features" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="#paths" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Learning Paths
              </Link>
              <Link href="#how-it-works" className="py-2 text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="/auth/signin" className="mt-2">
                <Button variant="ghost" className="w-full">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="w-full">Get Started</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Zap className="h-3 sm:h-4 w-3 sm:w-4" />
            Learn to code through epic quests
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
            Your Journey to Becoming a{' '}
            <span className="gradient-text">Developer</span>{' '}
            Starts Here
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            QuestBoard transforms coding education into an exciting adventure. Complete quests, 
            earn XP, unlock badges, and build a portfolio that showcases your skills.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8">
                Start Your Quest
                <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-2xl mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">100+</p>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Quests</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">50+</p>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Badges</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">5</p>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Role Paths</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">
            Why Choose QuestBoard?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            We've gamified the learning experience to make coding education engaging, 
            motivating, and fun.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Map className="h-8 w-8" />,
                title: 'Quest-Based Learning',
                description: 'Follow structured quest trees that guide you from beginner to advanced topics.',
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: 'XP & Leveling System',
                description: 'Earn experience points as you complete quests and level up your coding skills.',
              },
              {
                icon: <Trophy className="h-8 w-8" />,
                title: 'Achievement Badges',
                description: 'Unlock badges that showcase your accomplishments and expertise areas.',
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Leaderboards',
                description: 'Compete with fellow learners and climb the weekly and all-time rankings.',
              },
              {
                icon: <Code className="h-8 w-8" />,
                title: 'Build Real Projects',
                description: 'Every quest involves hands-on coding that builds your portfolio.',
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: 'Multiple Role Paths',
                description: 'Choose your destiny: Frontend, Backend, DevOps, Full-Stack, or Data roles.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Role Paths Section */}
      <section id="paths" className="py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">
            Choose Your Path
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Select a role path that matches your interests. Each path offers specialized 
            quests and skills to master.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                Icon: Palette,
                name: 'Frontend Developer',
                color: '#3B82F6',
                skills: ['HTML/CSS', 'JavaScript', 'React', 'UI/UX'],
              },
              {
                Icon: Server,
                name: 'Backend Developer',
                color: '#10B981',
                skills: ['Node.js', 'Databases', 'APIs', 'Security'],
              },
              {
                Icon: Wrench,
                name: 'DevOps Engineer',
                color: '#F59E0B',
                skills: ['Linux', 'Docker', 'CI/CD', 'Cloud'],
              },
              {
                Icon: Rocket,
                name: 'Full-Stack Developer',
                color: '#8B5CF6',
                skills: ['Frontend', 'Backend', 'Deployment', 'System Design'],
              },
              {
                Icon: BarChart3,
                name: 'Data Engineer',
                color: '#EC4899',
                skills: ['Python', 'SQL', 'Data Pipelines', 'Analytics'],
              },
            ].map((path, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div
                  className="h-14 w-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: path.color + '20' }}
                >
                  <path.Icon className="h-7 w-7" style={{ color: path.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-3">{path.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs rounded-full bg-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            How It Works
          </h2>
          
          <div className="space-y-6 sm:space-y-8">
            {[
              {
                step: 1,
                title: 'Create Your Account',
                description: 'Sign up and choose your role path. Tell us about your experience level.',
              },
              {
                step: 2,
                title: 'Explore Quest Trees',
                description: 'Browse available quest trees organized by skill area. Each tree contains progressive quests.',
              },
              {
                step: 3,
                title: 'Accept Quests',
                description: 'Choose quests that match your goals. Each quest has clear objectives and a deadline.',
              },
              {
                step: 4,
                title: 'Complete Tasks',
                description: 'Work through quest tasks, building real projects. Use provided resources and hints.',
              },
              {
                step: 5,
                title: 'Earn Rewards',
                description: 'Submit your work to earn XP, unlock badges, and climb the leaderboard.',
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4 sm:gap-6 items-start">
                <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Begin Your Quest?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto px-4">
            Join thousands of learners who are building their coding skills through gamified education.
          </p>
          
          <Link href="/auth/signup">
            <Button size="lg" className="px-6 sm:px-8">
              Start Learning Free
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Free to start
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              100+ quests available
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Swords className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">QuestBoard</span>
            </div>
            
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              © 2024 QuestBoard. Learn to code through quests.
            </p>
            
            <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
