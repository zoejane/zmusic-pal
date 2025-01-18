'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ThemeToggleProps {
  className?: string;
  iconSize?: number;
}

export function ThemeToggle({ className, iconSize = 20 }: ThemeToggleProps) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className={`text-primary ${className}`}>
      {theme === 'light' ? <Moon className={`h-${iconSize} w-${iconSize}`} /> : <Sun className={`h-${iconSize} w-${iconSize}`} />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

