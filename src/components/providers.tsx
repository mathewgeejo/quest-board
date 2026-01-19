'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { ToastProvider } from './ui/fantasy-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ToastProvider>
          {children}
        </ToastProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(260 25% 8%)',
              color: 'hsl(45 20% 90%)',
              border: '1px solid hsl(260 20% 18%)',
            },
            success: {
              iconTheme: {
                primary: 'hsl(270 70% 45%)',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(0 72% 51%)',
                secondary: 'white',
              },
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  )
}
