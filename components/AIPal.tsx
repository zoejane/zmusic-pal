"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { CardWrapper } from "./ui/card-wrapper"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { sendMessage } from "@/lib/api"
import { Send } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  type: "user" | "ai"
  content: string
}

export default function AIPal() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputAreaRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return
    setIsLoading(true)
    setError("")
    const newUserMessage = { type: "user" as const, content: input }
    setMessages((prev) => [...prev, newUserMessage])
    setInput("")

    try {
      const aiResponse = await sendMessage(input)
      const newAiMessage = { type: "ai" as const, content: aiResponse }
      setMessages((prev) => [...prev, newAiMessage])
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const resizeTextarea = () => {
      if (inputRef.current) {
        inputRef.current.style.height = "auto"
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
      }
    }
    resizeTextarea()
    window.addEventListener("resize", resizeTextarea)
    return () => window.removeEventListener("resize", resizeTextarea)
  }, [input])

  useEffect(() => {
    if (messages.length > 0 && inputAreaRef.current) {
      inputAreaRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <CardWrapper
      title="AI 伙伴 / AI Pal"
      className={`flex flex-col ${messages.length === 0 ? "h-auto" : "h-[400px] sm:h-[450px] md:h-[500px]"}`}
    >
      {messages.length > 0 && (
        <div
          className="flex-grow overflow-y-auto mb-2 p-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          ref={chatContainerRef}
        >
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.type === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-2 rounded-lg max-w-[80%] ${
                  message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.type === "user" ? (
                  message.content
                ) : (
                  <ReactMarkdown
                    className="prose prose-sm dark:prose-invert max-w-none"
                    components={{
                      // 自定义链接在新标签页打开
                      a: ({ node, ...props }) => (
                        <a target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block p-2 rounded-lg bg-muted animate-pulse">思考中...</div>
            </div>
          )}
          {error && (
            <div className="text-left mb-4">
              <div className="inline-block p-2 rounded-lg bg-destructive/10 text-destructive">错误: {error}</div>
            </div>
          )}
        </div>
      )}
      <div ref={inputAreaRef} className={`p-2 ${messages.length > 0 ? "border-t" : ""} mt-auto`}>
        <div className="relative">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入问题 / Ask a question"
            className="pr-10 resize-none overflow-hidden"
            rows={1}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            size="sm"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">发送</span>
          </Button>
        </div>
      </div>
    </CardWrapper>
  )
}

