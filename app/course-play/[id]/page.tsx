"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock content data
const contentData: Record<string, any> = {
  "1-1": {
    type: "video",
    title: "Welcome to MIL",
    content: "https://www.example.com/video",
    transcript: `Welcome to Media and Information Literacy course.

In this comprehensive program, we'll explore the fundamental concepts of media literacy, information evaluation, and critical thinking skills that are essential in our digital age.

Today's digital landscape presents both opportunities and challenges. We have unprecedented access to information, but we also face the challenge of distinguishing credible sources from misinformation.

This course will equip you with the tools and knowledge needed to navigate this complex information environment effectively.`,
  },
  "1-2": {
    type: "text",
    title: "Identifying Misinformation Patterns",
    content: `# Identifying Misinformation Patterns

Media literacy encompasses the ability to access, analyze, evaluate, and create media in a variety of forms. It involves understanding how media messages are constructed, who controls them, and how they influence our perceptions and behaviors.

## Key Components of Media Literacy:

**Access:** Finding and retrieving information effectively

**Analysis:** Understanding how media messages are constructed  

**Evaluation:** Critically assessing the credibility and bias of sources

**Creation:** Producing responsible and ethical media content

## The Digital Information Ecosystem

Today's information ecosystem is characterized by rapid information flow, algorithmic curation, and the democratization of content creation. While this has many benefits, it also presents challenges:

### Critical Challenges:
• Information overload and filter bubbles
• Spread of misinformation and disinformation  
• Algorithmic bias in content recommendation
• Privacy concerns and data manipulation`,
  },
  "1-3": {
    type: "quiz",
    title: "Practice: Evaluating Sources",
    content: [
      {
        question: "Which of the following is NOT a key component of media literacy?",
        options: [
          "Access - Finding and retrieving information effectively",
          "Analysis - Understanding how media messages are constructed",
          "Automation - Using AI to filter information automatically",
          "Evaluation - Critically assessing the credibility and bias of sources",
        ],
        correctAnswer: 2,
        explanation:
          'Incorrect. The correct answer is "Automation". Media literacy focuses on human skills like access, analysis, and evaluation rather than automated processes.',
      },
    ],
  },
}

export default function CoursePlayPage() {
  const params = useParams()
  const contentId = params.id as string
  const currentContent = contentData[contentId] || contentData["1-1"]

  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null) // Track selected answer instead of array
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm here to help you understand the course material. Feel free to ask me any questions about Media and Information Literacy.",
    },
  ])

  const progress = 65 // Mock progress

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleChatSend = () => {
    if (!chatInput.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      type: "user",
      content: chatInput,
    }

    setChatMessages((prev) => [...prev, newMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Great question! The four key components of MIL are: Access, Analyze, Evaluate, and Create. Each plays a crucial role in developing digital literacy skills.",
      }
      setChatMessages((prev) => [...prev, aiResponse])
    }, 1000)

    setChatInput("")
  }

  const renderVideoPlayer = () => (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="relative bg-gray-900 aspect-video rounded-t-lg flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white ml-0.5" />
              </div>
            </div>
            <p className="text-lg mb-2">Video: Welcome to MIL</p>
            <p className="text-sm opacity-75">Click play to start learning</p>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-4 text-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <div className="flex-1 bg-white/20 h-1 rounded-full">
                <div className="bg-red-500 h-1 rounded-full" style={{ width: "35%" }}></div>
              </div>
              <Volume2 className="w-4 h-4" />
              <Settings className="w-4 h-4" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderTextContent = () => (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentContent.title}</h1>
        <p className="text-sm text-gray-500">Estimated reading time: 12 min read</p>
      </div>

      <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
        {currentContent.content.split("\n").map((paragraph: string, index: number) => {
          if (paragraph.startsWith("# ")) {
            return (
              <h1 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                {paragraph.slice(2)}
              </h1>
            )
          } else if (paragraph.startsWith("## ")) {
            return (
              <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                {paragraph.slice(3)}
              </h2>
            )
          } else if (paragraph.startsWith("### ")) {
            return (
              <h3 key={index} className="text-lg font-bold text-gray-900 mt-4 mb-2">
                {paragraph.slice(4)}
              </h3>
            )
          } else if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
            return (
              <p key={index} className="font-bold text-gray-900 mb-2">
                {paragraph.slice(2, -2)}
              </p>
            )
          } else if (paragraph.startsWith("• ")) {
            return (
              <div key={index} className="ml-4 mb-2">
                <span className="text-red-500 mr-2">•</span>
                <span>{paragraph.slice(2)}</span>
              </div>
            )
          } else if (paragraph.trim() === "") {
            return <div key={index} className="h-4"></div>
          } else {
            return (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            )
          }
        })}
      </div>
    </div>
  )

  const renderQuiz = () => {
    const question = currentContent.content[0]

    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{currentContent.title}</h2>
            <span className="text-sm text-gray-500">Question 1 of 5 • 5 points</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
            <div className="space-y-3">
              {question.options.map((option: string, index: number) => {
                let buttonStyle = "w-full p-4 text-left rounded-lg border transition-all hover:border-gray-300"
                let iconElement = null

                if (selectedAnswer === index) {
                  if (index === question.correctAnswer) {
                    buttonStyle = "w-full p-4 text-left rounded-lg border-2 border-green-500 bg-green-50"
                    iconElement = <CheckCircle className="w-5 h-5 text-green-600" />
                  } else {
                    buttonStyle = "w-full p-4 text-left rounded-lg border-2 border-red-500 bg-red-50"
                    iconElement = <XCircle className="w-5 h-5 text-red-600" />
                  }
                } else if (selectedAnswer !== null && index === question.correctAnswer) {
                  buttonStyle = "w-full p-4 text-left rounded-lg border-2 border-green-500 bg-green-50"
                  iconElement = <CheckCircle className="w-5 h-5 text-green-600" />
                } else {
                  buttonStyle = "w-full p-4 text-left rounded-lg border border-gray-200"
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    disabled={selectedAnswer !== null} // Disable after selection
                    className={buttonStyle}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{option}</span>
                      {iconElement}
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedAnswer !== null && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                <p className="text-sm text-blue-800">{question.explanation}</p>
              </div>
            )}
          </div>

          {selectedAnswer !== null && (
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" className="px-6 bg-transparent">
                Previous Question
              </Button>
              <div className="text-sm text-gray-500">Progress: 20% complete</div>
              <Button className="bg-red-500 hover:bg-red-600 text-white px-6">Next Question</Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderMainContent = () => {
    switch (currentContent.type) {
      case "video":
        return renderVideoPlayer()
      case "text":
        return renderTextContent()
      case "quiz":
        return renderQuiz()
      default:
        return renderTextContent()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Navigation */}
      <nav className="w-full px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/course">
            <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Course
            </button>
          </Link>

          <div className="flex-1 max-w-md mx-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{currentContent.title}</span>
                <span className="text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Previous
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" size="sm">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Transcript */}
        <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen}>
          <div className={`transition-all duration-300 border-r border-gray-100 ${transcriptOpen ? "w-80" : "w-12"}`}>
            <div className="p-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  {transcriptOpen && "Transcript"}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              {currentContent.transcript && (
                <div className="p-4 h-full overflow-y-auto">
                  <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                    {currentContent.transcript.split("\n\n").map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Center - Main Content */}
        <div className="flex-1 p-6">
          {currentContent.type === "text" ? (
            renderMainContent()
          ) : (
            <div className="max-w-4xl mx-auto">{renderMainContent()}</div>
          )}
        </div>

        {/* Right Sidebar - AI Assistant */}
        <Collapsible open={chatOpen} onOpenChange={setChatOpen}>
          <div className={`transition-all duration-300 border-l border-gray-100 ${chatOpen ? "w-80" : "w-12"}`}>
            <div className="p-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2 text-red-500" />
                  {chatOpen && "AI Assistant"}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg text-sm ${
                        message.type === "user" ? "bg-red-50 text-red-800 ml-8" : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}

                  <div className="space-y-2 pt-4">
                    <p className="text-xs text-gray-500 font-medium">Suggested questions:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start text-xs text-gray-600 hover:bg-gray-50"
                      onClick={() => setChatInput("What are the key components of MIL?")}
                    >
                      What are the key components of MIL?
                    </Button>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
                      placeholder="Ask a question..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <Button size="sm" onClick={handleChatSend} className="bg-red-500 hover:bg-red-600 text-white">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </div>
  )
}
