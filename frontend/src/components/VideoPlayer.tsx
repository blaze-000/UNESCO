"use client";

import { useState } from "react";
import {  ChevronRight, FileText } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  title?: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex w-full h-[calc(100vh-4rem)]">
      {/* Main video area */}
      <div className="flex-1 h-full pr-2 p-6">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        <video
          src={src}
          controls
          className="w-full max-w-4xl mx-auto h-[400px] md:h-[500px] bg-black rounded-lg shadow-md"
        />
      </div>

      {/* Right Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20 ml-40" : "w-80"
        } border-l flex flex-col`}
      >
        {/* Header: Up Next + Toggle */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <h3 className="text-lg font-semibold">Transcript</h3>}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Show Transcript" : "Hide Transcript"}
          >
            {collapsed ? (
              <FileText className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Sidebar content */}
        {!collapsed ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-3">
              <span>Transcript here (AI Generated)</span>

              {/* Generate Transcript using AI, when Video is Plublished */}
            </ul>
          </div>
        ) : (
          // Collapsed view: empty div to keep border full height
          <div className="flex-1 h-full"></div>
        )}
      </aside>
    </div>
  );
}
