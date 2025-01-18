'use client'

import { useState, KeyboardEvent, useEffect } from 'react'
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

    console.log('Starting submission...')
    setIsLoading(true)
    setError('')
    setResponse('')
    
    try {
      console.log('Sending message:', input)
      const aiResponse = await sendMessage(input)
      console.log('Received response:', aiResponse)
      console.log('Setting response state...')
      setResponse(aiResponse)
      console.log('Response state set')
      setInput('')
    } catch (error) {
      console.error('Error:', error)
      if ((error as any)?.message?.includes('Network')) {
        setError('抱歉，AI 伙伴暂时无法连接。请确保后端服务已启动，或稍后再试。')
      } else {
        setError('抱歉，AI 伙伴遇到了一些问题。请稍后再试，或联系管理员获取帮助。')
      }
    } finally {
      console.log('Setting loading state to false...')
      setIsLoading(false)
      console.log('Loading state set to false')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    console.log('Current response state:', response)
    console.log('Current error state:', error)
    console.log('Current loading state:', isLoading)
  }, [response, error, isLoading])

  console.log('Rendering with states:', { response, error, isLoading })

  const shouldShowResponse = !error && response
  console.log('Should show response:', shouldShowResponse)
  console.log('Response content:', response)

  return (
    <CardWrapper title="AI 伙伴 / AI Pal">
      <div className="flex flex-col gap-4">
        {(response || error || isLoading) && (
          <div className="flex flex-col gap-4 min-h-[100px] border-2 border-primary p-4 rounded-md bg-muted/10">
            {error ? (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            ) : null}
            {shouldShowResponse ? (
              <div className="p-3 bg-background rounded-md whitespace-pre-wrap border border-muted">
                {response}
              </div>
            ) : isLoading ? (
              <div className="text-muted-foreground text-sm italic">
                思考中...
              </div>
            ) : null}
          </div>
        )}
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
      </div>
    </CardWrapper>
  )
}

