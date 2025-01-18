import './globals.css'
import type { Metadata } from 'next'
import { Roboto, Roboto_Slab } from 'next/font/google'
import RootLayoutClient from './layout.client'

const roboto = Roboto({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

const robotoSlab = Roboto_Slab({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-slab',
  display: 'swap',
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
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${roboto.variable} ${robotoSlab.variable} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}

