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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ moduleId }: { moduleId: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`${
        collapsed ? "w-18 border-r h-full" : "w-80 h-full"
      } flex flex-col border-r `}
    >
      {/* Header row */}
      <div className="flex bg-white items-center justify-between px-4 py-3 border-b sticky top-0 ">
        {!collapsed && (
          <h2 className="text-lg text-red-500 font-bold">View Courses</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
          <Accordion type="multiple" className="w-full">
            {modules.map((module, index) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="text-sm font-medium px-4 border-b cursor-pointer hover:no-underline hover:bg-red-50">
                  <div className="flex flex-col text-left">
                    <span className="text-muted-foreground text-xs">{`Module ${
                      index + 1
                    }:`}</span>
                    <span className="font-medium text-sm">{module.title}</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <ul>
                    {module.items.map((item) => {
                      const href = `/course/${module.id}/${item.id}`;
                      const isActive = pathname === href;

                      return (
                        <li key={item.id}>
                          <Link
                            href={href}
                            className={`block px-3 py-3 text-sm transition-colors ${
                              isActive ? "bg-red-50" : "hover:bg-red-50"
                            }`}
                          >
                            <div className="flex items-center">
                              {/* Dot */}
                              <span className="w-4 h-4 bg-gray-300 rounded-full mt-1 mr-2 flex-shrink-0"></span>

                              {/* Text */}
                              <div className="flex flex-col leading-tight">
                                <span
                                  className={`${
                                    isActive ? "font-semibold" : "font-normal"
                                  }`}
                                >
                                  {item.title}
                                </span>
                                <span className="text-sm font-normal capitalize text-muted-foreground">
                                  {item.type === "quiz" ? "Practice Assignment" : item.type}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className=""></div>
        )}
      </div>
    </div>
  );
}
