import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuestBoard - Learn to Code Through Quests',
  description: 'A gamified learning platform for CS beginners. Complete quests, earn XP, unlock badges, and build your portfolio.',
  keywords: ['learn to code', 'programming', 'gamification', 'quests', 'CS education'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
