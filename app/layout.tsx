import './globals.css'
import type { Metadata } from 'next'
import { Roboto, Roboto_Slab } from 'next/font/google'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import { AboutMeModal } from '@/components/AboutMeModal'

const roboto = Roboto({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

const robotoSlab = Roboto_Slab({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-slab',
})

export const metadata: Metadata = {
  title: 'zMusic-Pal: 小巧优雅的音乐工具',
  description: '一个轻量级 Web 应用，支持音乐基础功能查询和 AI 辅助创作',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${roboto.variable} ${robotoSlab.variable} font-sans bg-background text-foreground`}>
        <div className="flex flex-col min-h-screen">
          <div className="flex justify-between items-center py-2 px-3 sm:px-4 md:px-6 border-b">
            <Header />
            <div className="flex space-x-2">
              <AboutMeModal className="h-10 w-10" iconSize={20} />
              <Button variant="ghost" size="sm" className="h-10 w-10" onClick={() => window.open('https://github.com/your-repo', '_blank')}>
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Button>
              <ThemeToggle className="h-10 w-10" iconSize={20} />
            </div>
          </div>
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

