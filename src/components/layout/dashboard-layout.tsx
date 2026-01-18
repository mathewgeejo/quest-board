'use client'

import { cn } from '@/lib/utils'
import { useUIStore } from '@/lib/store'
import { Sidebar } from './sidebar'
import { Header } from './header'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { sidebarOpen } = useUIStore()
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'min-h-screen transition-all duration-300',
          'lg:pl-20',
          sidebarOpen && 'lg:pl-64'
        )}
      >
        <Header title={title} subtitle={subtitle} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
