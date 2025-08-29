"use client";

import { useState, useEffect, useRef } from "react";
import {  Globe } from "lucide-react";

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

interface Transcript {
  videoId: string;
  title: string;
  transcript: TranscriptSegment[];
}

interface VideoPlayerProps {
  src: string | { english: string; hindi: string };
  title?: string;
  transcript?: string;
}

// Helper function to detect YouTube videos
function isYouTubeVideo(src: string): boolean {
  return src.includes("youtube.com") || src.includes("youtu.be");
}

// Helper function to get current video source
function getCurrentVideoSrc(
  src: string | { english: string; hindi: string },
  language: string
): string {
  if (typeof src === "string") {
    return src;
  }
  return src[language as keyof typeof src] || src.english;
}


export default function VideoPlayer({
  src,
  title,
  transcript,
}: VideoPlayerProps) {
  
  const [language, setLanguage] = useState("english");
  const [transcriptData, setTranscriptData] = useState<Transcript | null>(null);
 
  const [currentSegment, setCurrentSegment] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  interface YTPlayer {
    destroy: () => void;
    getCurrentTime: () => number;
    seekTo: (seconds: number) => void;
    playVideo: () => void;
  }
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we have multiple language options
  const hasMultipleLanguages =
    typeof src === "object" && "english" in src && "hindi" in src;

  // Load transcript data
  useEffect(() => {
    if (transcript) {
      fetch(transcript)
        .then((res) => res.json())
        .then(setTranscriptData)
        .catch((error) => {
          console.error("Failed to load transcript:", error);
        });
    }
  }, [transcript]);

  // YouTube iframe API for time tracking
  useEffect(() => {
    if (!isYouTubeVideo(getCurrentVideoSrc(src, language))) return;

    const currentSrc = getCurrentVideoSrc(src, language);
    const videoId = currentSrc.match(/embed\/([^?]+)/)?.[1];

    if (!videoId) return;

    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Destroy existing player if it exists
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    // Load YouTube iframe API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      // Add a small delay to ensure iframe is ready
      setTimeout(() => {
        if (iframeRef.current) {
          playerRef.current = new window.YT.Player(iframeRef.current, {
            events: {
              onReady: () => {
                console.log("YouTube player ready");
              },
              onStateChange: (event: { data: number }) => {
                console.log("Player state changed:", event.data);
                if (event.data === window.YT.PlayerState.PLAYING) {
                  // Start polling for current time
                  intervalRef.current = setInterval(() => {
                    if (playerRef.current && playerRef.current.getCurrentTime) {
                      const time = playerRef.current.getCurrentTime();
                      

                      // Find current segment
                      if (transcriptData) {
                        const segmentIndex =
                          transcriptData.transcript.findIndex(
                            (segment) =>
                              time >= segment.start && time <= segment.end
                          );
                        setCurrentSegment(
                          segmentIndex >= 0 ? segmentIndex : null
                        );
                      }
                    }
                  }, 100);
                } else if (
                  event.data === window.YT.PlayerState.PAUSED ||
                  event.data === window.YT.PlayerState.ENDED
                ) {
                  // Clear interval when video stops
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                  }
                }
              },
            },
          });
        }
      }, 100);
    };

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [src, language, transcriptData]);

  // Scroll to current segment
  useEffect(() => {
    if (currentSegment !== null ) {
      const element = document.getElementById(
        `transcript-segment-${currentSegment}`
      );
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentSegment]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Main video area */}
      <div className="flex-1 h-full p-4 md:p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          {title && (
            <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
          )}

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
                <option value="hindi">हिन्दी (hindi)</option>
              </select>
            </div>
          )}
        </div>

        {(() => {
          const currentSrc = getCurrentVideoSrc(src, language);
          return isYouTubeVideo(currentSrc) ? (
            <iframe
              key={`${currentSrc}-${language}`}
              ref={iframeRef}
              src={`${currentSrc}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`}
              title={title || "YouTube video"}
              className="w-full max-w-4xl mx-auto h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-black rounded-lg shadow-md"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              key={`${currentSrc}-${language}`}
              src={currentSrc}
              controls
              className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-black rounded-lg shadow-md"
            />
          );
        })()}
      </div>

      {/* TRANSCRIPT SIDEBAR COMMENTED OUT - REMOVED FOR NOW
      <aside
        className={`${
          collapsed ? "w-20 ml-40" : "w-80"
        } border-l flex flex-col`}
      >
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

        {!collapsed ? (
          <div className="flex-1 p-4 overflow-y-auto">
            {transcriptData ? (
              <div className="space-y-3">
                {transcriptData.transcript.map((segment, index) => (
                  <div
                    key={index}
                    id={`transcript-segment-${index}`}
                    className={`p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                      currentSegment === index
                        ? "bg-red-100 border-l-4 border-red-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      if (
                        playerRef.current &&
                        isYouTubeVideo(getCurrentVideoSrc(src, language))
                      ) {
                        playerRef.current.seekTo(segment.start);
                        playerRef.current.playVideo();
                      }
                    }}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {formatTime(segment.start)} - {formatTime(segment.end)}
                    </div>
                    <div className="text-sm leading-relaxed">
                      {segment.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                {transcript
                  ? "Loading transcript..."
                  : "No transcript available"}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 h-full"></div>
        )}
      </aside>
      */}
    </div>
  );
}
