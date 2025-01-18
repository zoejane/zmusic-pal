'use client'

export default function Header() {
  return (
    <header>
      <div className="flex items-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mr-3 sm:mr-4 font-heading">zMusic-Pal</h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-heading" lang="zh-CN">音乐伙伴</p>
      </div>
    </header>
  )
}

