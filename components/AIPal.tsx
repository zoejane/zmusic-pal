'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CardWrapper } from '@/components/ui/card-wrapper'
import { Loader2, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'ai'
  content: string
}

export default function AIPal() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (hasInteracted && textareaRef.current) {
      textareaRef.current.focus()
      inputAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [hasInteracted, messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    setHasInteracted(true)
    const userMessage: Message = { role: 'user', content: trimmedInput }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulating API call
    setTimeout(() => {
      const aiMessage: Message = { 
        role: 'ai', 
        content: `这是一个模拟的AI回答。在实际应用中，这里会是来自AI的真实回复。\n\nThis is a simulated AI response. In a real application, this would be the actual reply from the AI.` 
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <CardWrapper title={<span className="text-center block">AI 伙伴 / AI Pal</span>}>
      <div className="flex flex-col h-full lg:h-[calc(100vh-12rem)] lg:justify-between">
        <div 
          ref={chatContainerRef} 
          className={`overflow-y-auto mb-4 space-y-4 p-2 border rounded-md
            ${hasInteracted ? 'flex flex-col items-center' : 'hidden'}
            lg:flex lg:flex-col lg:items-center lg:mb-2
            h-[200px] lg:h-[calc(100vh-24rem-130px)]`}
        >
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
            >
              <div 
                className={`max-w-[80%] p-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center w-full">
              <div className="bg-secondary text-secondary-foreground max-w-[80%] p-2 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
        <div ref={inputAreaRef} className="lg:h-[130px]">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 justify-center h-full">
            <Textarea
              ref={textareaRef}
              placeholder={hasInteracted ? "" : "让我们聊聊音乐吧。 / Let's talk about music."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow bg-background border-input resize-none h-10 py-2 px-3 text-sm lg:h-full"
            />
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 p-2 flex items-center justify-center lg:h-full">
              <Send className="h-4 w-4" />
              <span className="sr-only">发送 / Send</span>
            </Button>
          </form>
        </div>
      </div>
    </CardWrapper>
  )
}

