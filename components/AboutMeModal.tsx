'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User } from 'lucide-react'

interface AboutMeModalProps {
  className?: string;
  iconSize?: number;
}

export function AboutMeModal({ className, iconSize = 20 }: AboutMeModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <User className={`h-${iconSize} w-${iconSize}`} />
          <span className="sr-only">About Me</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>关于我 / About Me</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>你好！我是zMusic-Pal的创作者。我热爱音乐和技术，希望通过这个工具帮助更多人探索音乐的奥秘。</p>
          <p>Hello! I'm the creator of zMusic-Pal. I'm passionate about music and technology, and I hope this tool helps more people explore the wonders of music.</p>
          <h3 className="text-lg font-semibold">技能 / Skills</h3>
          <ul className="list-disc list-inside">
            <li>Web 开发 / Web Development</li>
            <li>音乐理论 / Music Theory</li>
            <li>人工智能应用 / AI Applications</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}

