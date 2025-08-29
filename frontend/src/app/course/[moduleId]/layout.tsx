"use client";

import Sidebar from "@/components/sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function ModuleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ moduleId: string }>;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-8rem)] relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        fixed md:relative
        left-0 top-0
        h-full
        z-50
        transition-transform duration-300 ease-in-out
        overflow-y-auto
      `}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto w-full flex flex-col">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30 flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-red-500 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Course Content
          </h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="w-full flex-1">{children}</div>
      </main>
    </div>
  );
}
