"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { modules } from "@/data/courseData";
import {
  BookOpenCheck,
  CheckCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Play,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openModule, setOpenModule] = useState<string | undefined>(undefined);

  // 🔥 Sync open accordion with active path
  useEffect(() => {
    if (!pathname) return;
    const parts = pathname.split("/"); // e.g. /course/moduleId/itemId
    const moduleId = parts[2]; 
    if (moduleId) {
      setOpenModule(moduleId);
    }
  }, [pathname]);

  const getItemIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-5 h-5 text-red-500" />;
      case "text":
        return <FileText className="w-5 h-5 text-blue-500" />;
         case "exercise":
        return <BookOpenCheck className="w-5 h-5 text-orange-500" />;
      case "quiz":
        return <CheckCircle2 className="w-5 h-5 text-orange-500" />;
      case "audio":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ width: collapsed ? 72 : 320 }}
      animate={{ width: collapsed ? 72 : 320 }} // w-18 vs w-80
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="flex flex-col border-r h-full"
    >
      {/* Header row */}
      <div className="flex bg-white items-center justify-between px-4 py-3 border-b sticky top-0">
        <AnimatePresence>
          {!collapsed && (
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-lg text-red-500 font-bold"
            >
              Course Modules
            </motion.h2>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-6 h-6" />
          ) : (
            <ChevronLeft className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto">
        {!collapsed ? (
          <Accordion
            type="single"
            className="w-full"
            value={openModule}
            onValueChange={setOpenModule}
            collapsible
          >
            {modules.map((module, index) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="text-sm font-medium px-4 border-b cursor-pointer hover:no-underline hover:bg-red-50">
                  <div className="flex items-center space-x-2 text-left">
                    <motion.div
                      layoutId={`module-circle-${module.id}`}
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold text-sm mt-1"
                    >
                      {index + 1}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">
                        {module.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{module.items.length} items</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, y: 5 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { staggerChildren: 0.05 },
                      },
                    }}
                  >
                    {module.items.map((item) => {
                      const href = `/course/${module.id}/${item.id}`;
                      const isActive = pathname === href;

                      return (
                        <motion.div
                          key={item.id}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 },
                          }}
                        >
                          <Link href={href}>
                            <motion.button
                              whileHover={{ scale: 1.01, x: 3 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex gap-3 w-full items-center px-4 py-3 text-sm text-left cursor-pointer transition-colors ${
                                isActive ? "bg-red-50 " : "hover:bg-red-50"
                              }`}
                            >
                              {getItemIcon(item.type)}
                              <div className="flex-1">
                                <div className="flex flex-col">
                                  <span
                                    className={`${
                                      isActive
                                        ? "font-semibold"
                                        : "font-normal"
                                    }`}
                                  >
                                    {item.title}
                                  </span>
                                  <span className="text-sm font-normal capitalize text-muted-foreground">
                                    {item.type === "quiz"
                                      ? "Practice Assignment"
                                      : item.type}
                                  </span>
                                </div>
                              </div>
                            </motion.button>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div />
        )}
      </div>
    </motion.div>
  );
}
