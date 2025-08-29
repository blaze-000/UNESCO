"use client";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Play,
  FileText,
  Clock,
  AudioWaveformIcon,
  Timer,
  BookOpenCheck,
} from "lucide-react";
import Link from "next/link";
import { modules } from "@/data/courseData";

export default function CoursePage() {
  const getItemIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-5 h-5 text-red-500" />;
      case "text":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "quiz":
        return <Timer className="w-5 h-5 text-orange-500" />;
      case "exercise":
        return <BookOpenCheck className="w-5 h-5 text-orange-500" />;
      case "audio":
        return <AudioWaveformIcon className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Replace 'any' with a more specific type for item
  type Question = {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  };
  type CourseItem = {
    id: string;
    title: string;
    type: string;
    duration?: string;
    questions?: Question[];
  };
  const getItemMeta = (item: CourseItem) => {
    if (item.duration) return item.duration;
    if (item.type === "quiz" && item.questions)
      return `${item.questions.length} questions`;
    return "";
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Media & Information Literacy Course
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Master the skills needed to navigate the digital information
            landscape and create impactful solutions
          </p>
          <div className="bg-gray-50 border-l-4 border-red-500 rounded-r-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-sm text-gray-700 text-center">
              <strong>Note:</strong> You don&rsquo;t need to complete all audio,
              video, and text content. Completing any one of these content types
              will mark the module as complete.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-6">
            {modules.map((module, index) => (
              <AccordionItem
                key={module.id}
                value={module.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-4 cursor-pointer hover:no-underline">
                  <div className="flex items-center space-x-4 text-left">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-3">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 font-normal text-sm mb-3 leading-relaxed">
                        {module.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>{module.items.length} items</span>
                        </span>
                        <span className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{module.duration}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3">
                    {module.items.map((item) => (
                      <motion.div key={item.id}>
                        <Link href={`/course/${module.id}/${item.id}`}>
                          <motion.button
                            className="w-full flex items-center space-x-4 p-4 bg-gray-50 hover:bg-red-50 rounded-xl cursor-pointer transition-all duration-200 text-left group border border-gray-100 hover:border-red-200"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {getItemIcon(item.type)}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors text-sm">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {getItemMeta(item)}
                              </p>
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
            className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white px-10 py-4 rounded-xl bg-transparent font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Link href={`/course/${modules[0].id}/${modules[0].items[0].id}`}>
              Let&rsquo;s Begin
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
