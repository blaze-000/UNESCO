"use client"
import { motion } from "motion/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Play, FileText, CheckCircle, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function CoursePage() {
  const modules = [
    {
      id: "module-1",
      title: "Introduction to Media Literacy",
      description: "Understand the fundamentals of media literacy and its importance in the digital age",
      duration: "45 min",
      items: [
        { id: "1-1", type: "video", title: "What is Media Literacy?", duration: "12 min" },
        { id: "1-2", type: "text", title: "The Digital Information Ecosystem", duration: "8 min read" },
        { id: "1-3", type: "mcq", title: "Knowledge Check: Media Literacy Basics", questions: 5 },
        { id: "1-4", type: "video", title: "Case Studies: Media Literacy in Action", duration: "15 min" },
        { id: "1-5", type: "mcq", title: "Module 1 Assessment", questions: 10 },
      ],
    },
    {
      id: "module-2",
      title: "Critical Thinking & Information Evaluation",
      description: "Learn to analyze sources, identify bias, and verify information authenticity",
      duration: "60 min",
      items: [
        { id: "2-1", type: "video", title: "Source Credibility Framework", duration: "18 min" },
        { id: "2-2", type: "text", title: "Identifying Misinformation Patterns", duration: "12 min read" },
        { id: "2-3", type: "video", title: "Fact-Checking Tools & Techniques", duration: "22 min" },
        { id: "2-4", type: "mcq", title: "Practice: Evaluating Sources", questions: 8 },
        { id: "2-5", type: "text", title: "Bias Recognition Guide", duration: "10 min read" },
        { id: "2-6", type: "mcq", title: "Module 2 Assessment", questions: 12 },
      ],
    },
    {
      id: "module-3",
      title: "Digital Citizenship & Ethics",
      description: "Explore responsible online behavior and ethical information sharing",
      duration: "50 min",
      items: [
        { id: "3-1", type: "video", title: "Digital Rights and Responsibilities", duration: "16 min" },
        { id: "3-2", type: "text", title: "Privacy in the Digital Age", duration: "14 min read" },
        { id: "3-3", type: "video", title: "Cyberbullying Prevention", duration: "11 min" },
        { id: "3-4", type: "mcq", title: "Ethics Scenarios Quiz", questions: 6 },
        { id: "3-5", type: "text", title: "Building Positive Online Communities", duration: "9 min read" },
      ],
    },
    {
      id: "module-4",
      title: "Creating Solutions for Impact",
      description: "Design and develop your own media literacy solutions",
      duration: "90 min",
      items: [
        { id: "4-1", type: "video", title: "Design Thinking for MIL Solutions", duration: "25 min" },
        { id: "4-2", type: "text", title: "Project Planning Framework", duration: "15 min read" },
        { id: "4-3", type: "video", title: "Prototype Development", duration: "30 min" },
        { id: "4-4", type: "mcq", title: "Solution Validation Quiz", questions: 8 },
        { id: "4-5", type: "text", title: "Impact Measurement Guide", duration: "12 min read" },
        { id: "4-6", type: "video", title: "Presenting Your Solution", duration: "18 min" },
      ],
    },
  ]

  const getItemIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4 text-red-500" />
      case "text":
        return <FileText className="w-4 h-4 text-blue-500" />
      case "mcq":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getItemMeta = (item: any) => {
    if (item.duration) return item.duration
    if (item.questions) return `${item.questions} questions`
    return ""
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Media & Information Literacy Course</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Master the skills needed to navigate the digital information landscape and create impactful solutions
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>4 hours total</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>2,847 students</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {modules.map((module, index) => (
              <AccordionItem
                key={module.id}
                value={module.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-start space-x-4 text-left">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold text-sm mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{module.duration}</span>
                        </span>
                        <span>{module.items.length} items</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2">
                    {module.items.map((item) => (
                      <motion.div key={item.id}>
                        <Link href={`/course-play/${item.id}`}>
                          <motion.button
                            className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {getItemIcon(item.type)}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-500">{getItemMeta(item)}</p>
                            </div>
                          </motion.button>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg bg-transparent"
          >
            <Link href="/chats">Need Help? Join the Discussion</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
