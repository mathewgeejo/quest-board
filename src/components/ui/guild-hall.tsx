'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { 
  Sparkles, 
  Flame, 
  Sword, 
  Trophy, 
  Map, 
  Scroll,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react'
import { FantasyButton } from './fantasy-button'
import { XPBar } from './xp-bar'

interface GuildHallProps {
  user: {
    name: string
    level: number
    currentXP: number
    xpToNextLevel: number
    title?: string
    streakCount: number
    longestStreak: number
    rolePath?: string
  }
  questStats: {
    completed: number
    inProgress: number
    available: number
  }
  activeQuests?: Array<{
    id: string
    name: string
    difficulty: string
    xpReward: number
    progress: number
    treeName?: string
  }>
  recentAchievements?: Array<{
    id: string
    name: string
    icon: string
    rarity: string
    earnedAt: Date
  }>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function GuildHall({ user, questStats, activeQuests = [], recentAchievements = [] }: GuildHallProps) {
  const xpProgress = Math.round((user.currentXP / user.xpToNextLevel) * 100)
  
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative">
        <div className="fantasy-card p-8 overflow-hidden">
          {/* Background pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-gold mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  {user.title || 'Apprentice Adventurer'}
                </span>
              </div>
              <h1 className="font-fantasy text-3xl md:text-4xl font-bold text-stone-100 mb-2">
                Welcome back, {user.name}
              </h1>
              <p className="text-stone-400 max-w-xl">
                Your quest log awaits. Continue your journey to mastery and unlock new abilities.
              </p>
            </div>
            
            {/* Level badge */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-arcane-purple to-arcane-dark flex items-center justify-center glow-arcane">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-stone-100">{user.level}</span>
                    <span className="block text-xs text-arcane-light uppercase">Level</span>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-arcane-light/30"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="w-32 mt-4">
                <XPBar currentXP={user.currentXP} maxXP={user.xpToNextLevel} level={user.level} compact />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="fantasy-card p-4 text-center">
          <div className="flex justify-center mb-2">
            <Flame className={cn(
              "w-8 h-8",
              user.streakCount > 0 ? "text-fire animate-torch-flicker" : "text-stone-600"
            )} />
          </div>
          <div className="text-2xl font-bold text-stone-100">{user.streakCount}</div>
          <div className="text-sm text-stone-500">Day Streak</div>
          <div className="text-xs text-stone-600 mt-1">Best: {user.longestStreak}</div>
        </div>
        
        {/* Completed */}
        <div className="fantasy-card p-4 text-center">
          <div className="flex justify-center mb-2">
            <Trophy className="w-8 h-8 text-gold" />
          </div>
          <div className="text-2xl font-bold text-stone-100">{questStats.completed}</div>
          <div className="text-sm text-stone-500">Completed</div>
        </div>
        
        {/* In Progress */}
        <div className="fantasy-card p-4 text-center">
          <div className="flex justify-center mb-2">
            <Sword className="w-8 h-8 text-arcane-light" />
          </div>
          <div className="text-2xl font-bold text-stone-100">{questStats.inProgress}</div>
          <div className="text-sm text-stone-500">Active</div>
        </div>
        
        {/* Available */}
        <div className="fantasy-card p-4 text-center">
          <div className="flex justify-center mb-2">
            <Scroll className="w-8 h-8 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100">{questStats.available}</div>
          <div className="text-sm text-stone-500">Available</div>
        </div>
      </motion.div>
      
      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Quests */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-fantasy text-xl font-semibold text-stone-100 flex items-center gap-2">
              <Sword className="w-5 h-5 text-arcane-light" />
              Active Quests
            </h2>
            <Link href="/active" className="text-sm text-arcane-light hover:text-arcane-glow transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {activeQuests.length === 0 ? (
            <div className="fantasy-card p-8 text-center">
              <Map className="w-12 h-12 mx-auto mb-4 text-stone-600" />
              <h3 className="font-fantasy text-lg font-semibold text-stone-300 mb-2">
                No Active Quests
              </h3>
              <p className="text-stone-500 mb-4">
                Ready for your next adventure? Browse available quests!
              </p>
              <Link href="/quests">
                <FantasyButton>
                  Find Quests <ArrowRight className="w-4 h-4 ml-2" />
                </FantasyButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeQuests.slice(0, 4).map((quest) => (
                <Link key={quest.id} href={`/quests/${quest.id}`}>
                  <div className="fantasy-card p-4 hover:border-arcane-purple/50 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-stone-200 group-hover:text-stone-100 transition-colors truncate">
                          {quest.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-stone-500">{quest.treeName}</span>
                          <span className="text-xs text-gold flex items-center gap-1">
                            <Zap className="w-3 h-3" /> +{quest.xpReward} XP
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-20">
                          <div className="h-2 bg-dungeon-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-arcane-purple rounded-full"
                              style={{ width: `${quest.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-stone-500">{quest.progress}%</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-arcane-light transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Side Panel */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Recent Achievements */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-fantasy text-lg font-semibold text-stone-100 flex items-center gap-2">
                <Star className="w-4 h-4 text-gold" />
                Achievements
              </h2>
              <Link href="/badges" className="text-sm text-arcane-light hover:text-arcane-glow transition-colors">
                All
              </Link>
            </div>
            
            <div className="fantasy-card p-4">
              {recentAchievements.length === 0 ? (
                <div className="text-center py-6">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                  <p className="text-sm text-stone-500">Complete quests to earn achievements!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAchievements.slice(0, 5).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-200 truncate">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-stone-500 capitalize">{achievement.rarity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div>
            <h2 className="font-fantasy text-lg font-semibold text-stone-100 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/quests" className="block">
                <FantasyButton variant="primary" className="w-full justify-start">
                  <Scroll className="w-4 h-4 mr-2" /> Browse Quests
                </FantasyButton>
              </Link>
              <Link href="/trees" className="block">
                <FantasyButton variant="secondary" className="w-full justify-start">
                  <Map className="w-4 h-4 mr-2" /> Explore Skill Trees
                </FantasyButton>
              </Link>
              <Link href="/leaderboard" className="block">
                <FantasyButton variant="ghost" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" /> View Leaderboard
                </FantasyButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
