'use client'

import { useState, KeyboardEvent } from 'react'
import { CardWrapper } from './ui/card-wrapper'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { sendMessage } from '@/lib/api'

export default function AIPal() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setError('')
    setResponse('')
    
    try {
      console.log('Sending message:', input)
      const aiResponse = await sendMessage(input)
      console.log('Received response:', aiResponse)
      setResponse(aiResponse)
      setInput('')
    } catch (error) {
      console.error('Error:', error)
      if ((error as any)?.message?.includes('Network')) {
        setError('抱歉，AI 伙伴暂时无法连接。请确保后端服务已启动，或稍后再试。')
      } else {
        setError('抱歉，AI 伙伴遇到了一些问题。请稍后再试，或联系管理员获取帮助。')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <CardWrapper title="AI 伙伴 / AI Pal">
      <div className="space-y-4">
        <Textarea
          placeholder="让我们聊聊音乐吧。/ Let's talk about music."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? '思考中...' : '发送'}
        </Button>
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        {response && !error && (
          <div className="mt-4 p-3 bg-muted/30 rounded-md whitespace-pre-wrap">
            {response}
          </div>
        )}
      </div>
    </CardWrapper>
  )
}

