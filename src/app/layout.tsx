import './globals.css'
import type { Metadata } from 'next'
import { Inter, Cinzel, Crimson_Text } from 'next/font/google'
import { Providers } from '@/components/providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const cinzel = Cinzel({ 
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const crimsonText = Crimson_Text({ 
  subsets: ['latin'],
  variable: '--font-crimson',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'QuestBoard - Embark on Your Coding Adventure',
  description: 'A fantasy-themed gamified learning platform for aspiring developers. Complete quests, master skills, earn XP, and forge your path to mastery.',
  keywords: ['learn to code', 'programming', 'gamification', 'quests', 'CS education', 'fantasy', 'RPG'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${cinzel.variable} ${crimsonText.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
