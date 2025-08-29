"use client";

import { useState } from "react";
import { ChevronRight, FileText, Globe } from "lucide-react";

interface VideoPlayerProps {
  src: string | { english: string; nepali: string };
  title?: string;
}

// Helper function to detect YouTube videos
function isYouTubeVideo(src: string): boolean {
  return src.includes("youtube.com") || src.includes("youtu.be");
}

// Helper function to get current video source
function getCurrentVideoSrc(
  src: string | { english: string; nepali: string },
  language: string
): string {
  if (typeof src === "string") {
    return src;
  }
  return src[language as keyof typeof src] || src.english;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [language, setLanguage] = useState("english");

  // Check if we have multiple language options
  const hasMultipleLanguages =
    typeof src === "object" && "english" in src && "nepali" in src;

  return (
    <div className="flex w-full h-[calc(100vh-4rem)]">
      {/* Main video area */}
      <div className="flex-1 h-full pr-2 p-6">
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}

          {/* Language Selector */}
          {hasMultipleLanguages && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="english">English</option>
                <option value="nepali">नेपाली (Nepali)</option>
              </select>
            </div>
          )}
        </div>

        {(() => {
          const currentSrc = getCurrentVideoSrc(src, language);
          return isYouTubeVideo(currentSrc) ? (
            <iframe
              src={currentSrc}
              title={title || "YouTube video"}
              className="w-full max-w-4xl mx-auto h-[400px] md:h-[500px] bg-black rounded-lg shadow-md"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={currentSrc}
              controls
              className="w-full max-w-4xl mx-auto h-[400px] md:h-[500px] bg-black rounded-lg shadow-md"
            />
          );
        })()}
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
