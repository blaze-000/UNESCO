"use client"

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
    </div>
  )
}
