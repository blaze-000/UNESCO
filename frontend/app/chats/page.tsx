"use client"

<<<<<<< HEAD
import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { Send, Sparkles, MessageCircle, BookOpen, HelpCircle, Lightbulb } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    type: "assistant",
    content:
      "Welcome to your AI Learning Assistant! I'm here to help you with Media and Information Literacy concepts, answer questions about the course content, and guide you through your learning journey. What would you like to explore today?",
    timestamp: new Date(),
    suggestions: [
      "What is media literacy?",
      "How can I identify fake news?",
      "Explain digital citizenship",
      "Help me with the course quiz",
    ],
  },
]

const quickPrompts = [
  {
    icon: BookOpen,
    title: "Course Help",
    description: "Get help with course content and concepts",
    prompt: "Can you help me understand the current lesson better?",
  },
  {
    icon: HelpCircle,
    title: "Quiz Support",
    description: "Assistance with quiz questions and explanations",
    prompt: "I need help understanding a quiz question",
  },
  {
    icon: Lightbulb,
    title: "Real-world Examples",
    description: "See how MIL applies to everyday situations",
    prompt: "Can you give me real-world examples of media literacy in action?",
  },
  {
    icon: Sparkles,
    title: "Study Tips",
    description: "Get personalized study strategies",
    prompt: "What are some effective ways to study media literacy?",
  },
]

export default function ChatsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim()
    if (!messageContent || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: `Great question about "${messageContent}"! Media literacy is the ability to access, analyze, evaluate, and create media in various forms. It's essential in today's digital age because it helps us navigate the vast amount of information we encounter daily.

Key components include:
• **Access**: Finding and retrieving information effectively
• **Analyze**: Understanding how media messages are constructed
• **Evaluate**: Critically assessing the credibility and purpose of content
• **Create**: Producing responsible and ethical media content

This skill is particularly important for young people who are digital natives but may lack the critical thinking skills needed to evaluate online information effectively.`,
          suggestions: [
            "Tell me more about evaluating sources",
            "How do I spot misinformation?",
            "What are some practical exercises?",
          ],
        },
        {
          content: `Excellent question! Identifying misinformation requires developing a critical eye and using systematic approaches:

**Quick Verification Steps:**
1. **Check the source** - Is it from a reputable organization?
2. **Look for author credentials** - Who wrote this and what's their expertise?
3. **Verify with multiple sources** - Does this information appear elsewhere?
4. **Check the date** - Is this current or outdated information?
5. **Examine the URL** - Does it look suspicious or mimic legitimate sites?

**Red Flags to Watch For:**
• Emotional or sensational headlines
• Lack of sources or citations
• Poor grammar and spelling
• Requests for personal information
• Claims that seem too good/bad to be true

Would you like me to walk through a specific example of fact-checking?`,
          suggestions: [
            "Show me a fact-checking example",
            "What tools can help verify information?",
            "How do I check images and videos?",
          ],
        },
        {
          content: `Digital citizenship encompasses the responsible and ethical use of technology and digital platforms. It's about understanding your rights and responsibilities in the digital world.

**Core Principles:**
• **Digital Etiquette**: Being respectful and kind online
• **Digital Literacy**: Understanding how to use technology effectively
• **Digital Rights**: Knowing your privacy and free speech rights
• **Digital Security**: Protecting yourself and others online
• **Digital Health**: Maintaining balance and wellness with technology use

**Practical Applications:**
- Think before you post or share content
- Respect others' privacy and intellectual property
- Use strong passwords and privacy settings
- Be aware of your digital footprint
- Stand up against cyberbullying

This is especially relevant for youth who are growing up as digital natives but need guidance on responsible online behavior.`,
          suggestions: [
            "How can I protect my privacy online?",
            "What should I do about cyberbullying?",
            "Tell me about digital footprints",
          ],
        },
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: randomResponse.content,
        timestamp: new Date(),
        suggestions: randomResponse.suggestions,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">U</span>
                </div>
                <span className="font-heading font-bold text-lg">UNESCO Youth</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/course" className="text-foreground hover:text-primary transition-colors">
                Course
              </Link>
              <Link href="/chats" className="text-primary font-medium">
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="font-heading font-black text-3xl md:text-4xl text-foreground mb-2">AI Learning Assistant</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant help with Media and Information Literacy concepts, course content, and study guidance
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Quick Prompts (shown when no messages) */}
            {messages.length <= 1 && (
              <div className="mb-8">
                <h2 className="font-heading font-bold text-xl mb-4">Quick Start</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickPrompts.map((prompt, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-shadow border-border hover:border-primary/20"
                      onClick={() => handleSendMessage(prompt.prompt)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <prompt.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground mb-1">{prompt.title}</h3>
                            <p className="text-sm text-muted-foreground">{prompt.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-3xl ${message.type === "user" ? "ml-12" : "mr-12"}`}>
                    {/* Message Card */}
                    <Card
                      className={`${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border"
                      } shadow-sm`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {message.type === "assistant" && (
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <MessageCircle className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div
                              className={`prose prose-sm max-w-none ${message.type === "user" ? "prose-invert" : ""}`}
                            >
                              <div className="whitespace-pre-line leading-relaxed">{message.content}</div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span
                                className={`text-xs ${
                                  message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl mr-12">
                    <Card className="bg-card border-border shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Media and Information Literacy..."
              className="w-full px-4 py-3 pr-12 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none min-h-[52px] max-h-32"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="absolute right-2 bottom-2 w-8 h-8 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
=======
import React from "react"

import type { ReactElement } from "react"
import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

type StreamEvent = {
  type: "progress" | "result" | "error"
  content: string
}

type Message = {
  id: string
  type: "user" | "assistant" | "progress" | "error"
  content: string
  timestamp: Date
}

const BACKEND_URL = "http://127.0.0.1:5000"

const EXAMPLE_PROMPTS = [
  "Colgate Optic White Renewal is a high-performance whitening toothpaste designed to remove up to 15 years of stains with its 5% hydrogen peroxide formula. It targets deep-set discoloration from coffee, tea, and wine while remaining gentle on enamel. With a refreshing mint flavor and fluoride protection, it not only brightens your smile but also strengthens teeth and fights cavities.",
  "Infused with Vitamin C and turmeric, Mamaearth’s Vitamin C Face Wash is crafted to illuminate dull skin and fight free radical damage. Its antioxidant-rich formula gently cleanses while promoting an even skin tone and natural radiance. Suitable for all skin types, it’s free from sulfates and parabens, making it a safe choice for daily use.",
]

const InputComponent = React.memo(
  ({
    inputValue,
    onInputChange,
    onKeyDown,
    isLoading,
    onSubmit,
    textareaRef,
    className = "",
  }: {
    inputValue: string
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
    isLoading: boolean
    onSubmit: () => void
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    className?: string
  }) => (
    <div
      className={`flex items-center gap-2 w-full border-2 border-gray-200 bg-white rounded-2xl transition-all duration-200 hover:border-gray-300 ${className}`}
    >
      <textarea
        ref={textareaRef}
        placeholder="Paste marketing text here..."
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        className="flex-1 border-0 bg-transparent text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0 px-4 py-2 text-base font-normal resize-none min-h-[56px] max-h-[120px] leading-6 font-sans"
        style={{ height: "auto" }}
      />
      
        <Button
        variant="ghost"
        size="icon"
        className="mr-2 mb-2 items-center justify-center rounded-full text-gray-500 hover:bg-red-500 hover:text-white transition-colors flex-shrink-0 focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
        onClick={onSubmit}
        disabled={!inputValue.trim() || isLoading}
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  ),
)

InputComponent.displayName = "InputComponent"

export default function ChatsPage(): ReactElement {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentProgress, setCurrentProgress] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [askedQuestion, setAskedQuestion] = useState<string | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isIdle = useMemo(() => {
    const idle = !isLoading && messages.length === 0
    console.log("isIdle calculation:", {
      isLoading,
      messagesLength: messages.length,
      idle,
    })
    return idle
  }, [isLoading, messages.length])

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentProgress])

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [])

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt)
    // Focus the textarea after setting the value
    setTimeout(() => {
      textareaRef.current?.focus()
      adjustTextareaHeight()
    }, 0)
  }

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const scrollHeight = textarea.scrollHeight
      const lineHeight = 24 // Approximate line height
      const maxLines = 5
      const maxHeight = lineHeight * maxLines

      if (scrollHeight <= maxHeight) {
        textarea.style.height = `${scrollHeight}px`
        textarea.style.overflowY = "hidden"
      } else {
        textarea.style.height = `${maxHeight}px`
        textarea.style.overflowY = "auto"
      }
    }
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value)
      adjustTextareaHeight()
    },
    [adjustTextareaHeight],
  )

  const addMessage = (type: Message["type"], content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const startVerification = useCallback(async () => {
    const text = inputValue.trim()
    if (!text || isLoading) return

    setIsLoading(true)
    setCurrentProgress(null)
    setAskedQuestion(text)
    setInputValue("") // Clear the input
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    // Add user message to chat history
    addMessage("user", text)

    try {
      const res = await fetch(`${BACKEND_URL}/start_verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to start verification")
      }

      const data = (await res.json()) as { session_id: string }

      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }

      const es = new EventSource(`${BACKEND_URL}/stream_progress/${data.session_id}`)
      eventSourceRef.current = es

      es.onmessage = (event) => {
        console.log("Received event:", event.data)
        try {
          const parsed: StreamEvent = JSON.parse(event.data)
          console.log("Parsed event:", parsed)
          if (parsed.type === "progress") {
            setCurrentProgress(parsed.content)
          } else if (parsed.type === "result") {
            // Add final result to chat history
            addMessage("assistant", parsed.content)
            setCurrentProgress(null)
            setIsLoading(false)
            es.close()
          } else if (parsed.type === "error") {
            console.error("Backend error:", parsed.content)
            const errorMessage = `Analysis failed: ${parsed.content}. Please try again with different text.`
            addMessage("error", errorMessage)
            setCurrentProgress(null)
            setIsLoading(false)
            es.close()
          }
        } catch (parseError) {
          console.error("Error parsing event data:", parseError)
          // Don't close connection on parse errors, just ignore malformed chunks
        }
      }

      es.onerror = (error) => {
        console.error("EventSource error:", error)
        const errorMessage = "Connection lost while streaming progress"
        addMessage("error", errorMessage)
        setCurrentProgress(null)
        setIsLoading(false)
        es.close()
      }

      es.onopen = () => {
        console.log("EventSource connection opened")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unexpected error"
      addMessage("error", errorMessage)
      setCurrentProgress(null)
      setIsLoading(false)
    }
  }, [inputValue, isLoading])

  const retryVerification = () => {
    // Remove the last error message and retry
    setMessages((prev) => prev.filter((msg) => msg.type !== "error"))
    setCurrentProgress(null)
    if (askedQuestion) {
      setInputValue(askedQuestion)
      startVerification()
    }
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      startVerification()
    }
  }, [startVerification]) 

  // Animated thinking dots component
  const ThinkingDots = () => (
    <motion.div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.4,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  )

  // Format progress message to remove emoji and make it more readable
  const formatProgressMessage = (message: string) => {
    return message.trim()
  }

  const renderMessage = (message: Message) => {
    switch (message.type) {
      case "user":
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right"
          >
            <div className="inline-block max-w-3xl text-left">
              <p className="text-gray-900 bg-gray-100 rounded-2xl px-4 py-3 inline-block whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </motion.div>
        )

      case "assistant":
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left"
          >
            <div className="inline-block max-w-3xl">
              <div className="bg-white rounded-2xl px-4 py-3">
                <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-3 mt-0 text-gray-900 leading-tight">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mb-2 mt-4 first:mt-0 text-gray-900 leading-tight">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-medium mb-2 mt-3 first:mt-0 text-gray-900 leading-tight">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => <p className="text-gray-700 mb-3 last:mb-0 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700 leading-relaxed">{children}</li>,
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-800 underline transition-colors"
                        >
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-3">
                          <table className="table-auto border-collapse border border-gray-300 w-full">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                      th: ({ children }) => (
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">{children}</td>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-900 text-white p-3 rounded-md my-3 overflow-x-auto">{children}</pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3">
                          {children}
                        </blockquote>
                      ),
                      strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                      em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case "error":
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left"
          >
            <div className="inline-block max-w-3xl">
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <p className="text-red-700 mb-0">{message.content}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800 mt-2 px-0"
                  onClick={retryVerification}
                >
                  Retry
                </Button>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-[calc(100vh-65px)] bg-white flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isIdle ? (
          // Initial state - centered content
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center w-full px-4 flex-1 flex flex-col items-center justify-center"
          >
            <div className="max-w-3xl mx-auto w-full">
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 font-sans"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Marketing Claim Verifier
              </motion.h1>
              <motion.p
                className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto px-4 font-sans leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Paste any marketing text and I&rsquo;ll verify the claims using AI-powered fact-checking
              </motion.p>

              <motion.div
                className="mb-2 md:mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm text-gray-500 mb-4 font-medium font-sans">Try these examples:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {EXAMPLE_PROMPTS.map((prompt, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleExampleClick(prompt)}
                      className="block w-full text-left p-4 md:p-5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 text-sm md:text-base text-gray-700 hover:text-gray-900 font-sans leading-relaxed hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <InputComponent
                  inputValue={inputValue}
                  onInputChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  isLoading={isLoading}
                  onSubmit={startVerification}
                  textareaRef={textareaRef}
                />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Chat state - conversation history
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Render all messages in conversation history */}
              {messages.map(renderMessage)}

              {/* Current progress/thinking - single step display */}
              <AnimatePresence mode="wait">
                {isLoading && currentProgress && (
                  <motion.div
                    key={currentProgress}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-left"
                  >
                    <div className="inline-block max-w-3xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                        <ThinkingDots />
                      </div>
                      <p className="text-gray-600 text-sm">{formatProgressMessage(currentProgress)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom search bar - only show when not in idle state */}
      {!isIdle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-t border-gray-100 px-4 py-4 shadow-lg"
        >
          <div className="max-w-2xl mx-auto">
            <InputComponent
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
              onSubmit={startVerification}
              textareaRef={textareaRef}
            />
          </div>
        </motion.div>
      )}
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
    </div>
  )
}
