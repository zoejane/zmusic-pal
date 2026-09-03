import './globals.css'
import type { Metadata } from 'next'
import { Roboto, Roboto_Slab } from 'next/font/google'
import RootLayoutClient from './layout.client'
import Script from 'next/script'

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
  metadataBase: new URL('https://zmusic-pal-web.zeabur.app'),
  other: {
    'baidu-site-verification': 'codeva-zKIT9ACCCa',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NG59VLMK84"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NG59VLMK84');
          `}
        </Script>

        {/* Baidu Link Auto-Submit */}
        <Script id="baidu-push" strategy="afterInteractive">
          {`
            (function(){
              var bp = document.createElement('script');
              var curProtocol = window.location.protocol.split(':')[0];
              if (curProtocol === 'https') {
                bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
              }
              else {
                bp.src = 'http://push.zhanzhang.baidu.com/push.js';
              }
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(bp, s);
            })();
          `}
        </Script>
      </head>
      <body className={`${roboto.variable} ${robotoSlab.variable} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}

