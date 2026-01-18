import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================
// USER STORE
// ============================================

interface UserStats {
  currentLevel: number
  totalXP: number
  streakCount: number
  longestStreak: number
  questsCompleted: number
  badgesEarned: number
}

interface UserState {
  user: {
    id: string
    name: string
    email: string
    image?: string
    rolePath?: string
    onboardingComplete: boolean
  } | null
  stats: UserStats
  isLoading: boolean
  
  // Actions
  setUser: (user: UserState['user']) => void
  setStats: (stats: UserStats) => void
  updateXP: (amount: number) => void
  updateStreak: (count: number) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      stats: {
        currentLevel: 1,
        totalXP: 0,
        streakCount: 0,
        longestStreak: 0,
        questsCompleted: 0,
        badgesEarned: 0,
      },
      isLoading: true,
      
      setUser: (user) => set({ user, isLoading: false }),
      
      setStats: (stats) => set({ stats }),
      
      updateXP: (amount) => set((state) => ({
        stats: {
          ...state.stats,
          totalXP: state.stats.totalXP + amount,
        },
      })),
      
      updateStreak: (count) => set((state) => ({
        stats: {
          ...state.stats,
          streakCount: count,
          longestStreak: Math.max(state.stats.longestStreak, count),
        },
      })),
      
      logout: () => set({
        user: null,
        stats: {
          currentLevel: 1,
          totalXP: 0,
          streakCount: 0,
          longestStreak: 0,
          questsCompleted: 0,
          badgesEarned: 0,
        },
      }),
    }),
    {
      name: 'questboard-user',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// ============================================
// QUEST STORE
// ============================================

interface ActiveQuest {
  id: string
  questId: string
  name: string
  progress: number
  tasksCompleted: string[]
  totalTasks: number
  deadlineAt: Date
  startedAt: Date
}

interface QuestState {
  activeQuests: ActiveQuest[]
  maxActiveQuests: number
  
  // Actions
  setActiveQuests: (quests: ActiveQuest[]) => void
  addActiveQuest: (quest: ActiveQuest) => void
  updateQuestProgress: (questId: string, progress: Partial<ActiveQuest>) => void
  removeActiveQuest: (questId: string) => void
  canAcceptQuest: () => boolean
}

export const useQuestStore = create<QuestState>()((set, get) => ({
  activeQuests: [],
  maxActiveQuests: 3,
  
  setActiveQuests: (quests) => set({ activeQuests: quests }),
  
  addActiveQuest: (quest) => set((state) => ({
    activeQuests: [...state.activeQuests, quest],
  })),
  
  updateQuestProgress: (questId, progress) => set((state) => ({
    activeQuests: state.activeQuests.map((q) =>
      q.questId === questId ? { ...q, ...progress } : q
    ),
  })),
  
  removeActiveQuest: (questId) => set((state) => ({
    activeQuests: state.activeQuests.filter((q) => q.questId !== questId),
  })),
  
  canAcceptQuest: () => get().activeQuests.length < get().maxActiveQuests,
}))

// ============================================
// UI STORE
// ============================================

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  showConfetti: boolean
  notification: {
    show: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
  } | null
  
  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  showNotification: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void
  hideNotification: () => void
  triggerConfetti: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'dark',
      showConfetti: false,
      notification: null,
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setTheme: (theme) => set({ theme }),
      
      showNotification: (type, message) => set({
        notification: { show: true, type, message },
      }),
      
      hideNotification: () => set({ notification: null }),
      
      triggerConfetti: () => {
        set({ showConfetti: true })
        setTimeout(() => set({ showConfetti: false }), 3000)
      },
    }),
    {
      name: 'questboard-ui',
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
)
