"use client";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Play, FileText, CheckCircle, Clock, CheckCircle2 } from "lucide-react";
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
        return <CheckCircle2 className="w-5 h-5 text-orange-500" />;
        case "audio":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getItemMeta = (item: any) => {
    if (item.duration) return item.duration;
    if (item.questions) return `${item.questions} questions`;
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Master the skills needed to navigate the digital information
            landscape and create impactful solutions
          </p>
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
                className="bg-white border  border-gray-200 rounded-lg  hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="px-6 py-4 cursor-pointer hover:no-underline">
                  <div className="flex items-center space-x-4 text-left">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold text-sm mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 font-normal text-sm mb-2">
                        {module.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{module.items.length} items</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{module.duration}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                

                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2">
                    {module.items.map((item) => (
                      <motion.div key={item.id}>
                        <Link href={`/course/${module.id}/${item.id}`}>
                          <motion.button
                            className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors text-left group"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {getItemIcon(item.type)}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-500">
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
            className="border-gray-300 text-gray-700 hover:bg-red-500 hover:text-white px-8 py-3 rounded-lg bg-transparent"
          >
            <Link href={`/course/${modules[0].id}/${modules[0].items[0].id}`}>Let&rsquo;s Begin</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
