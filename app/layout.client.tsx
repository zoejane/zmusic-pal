"use client"

import { ThemeToggle } from "@/components/ThemeToggle"
import { GithubIcon, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"

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
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open("https://zoejane.net", "_blank")}
            >
              <User className="h-4 w-4" />
              <span className="sr-only">About Me</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open("https://github.com/zoejane/zmusic-pal", "_blank")}
            >
              <GithubIcon className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
            <ThemeToggle className="h-10 w-10" iconSize={20} />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

