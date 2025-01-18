'use client'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import { AboutMeModal } from '@/components/AboutMeModal'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-background font-sans antialiased">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Header />
          <div className="flex flex-1 items-center justify-end space-x-2">
            <AboutMeModal className="h-10 w-10" iconSize={20} />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => window.open('https://github.com/zoejane/zmusic-pal', '_blank')}
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Button>
            <ThemeToggle className="h-10 w-10" iconSize={20} />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 