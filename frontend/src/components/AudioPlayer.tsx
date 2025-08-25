"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  title: string;
  content: string;
  coverImage?: string;
  artist?: string;
}

export default function AudioPlayer({
  title,
  content,
  coverImage,
  artist = "Unknown Artist",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplay", updateDuration); // ✅ ensure duration is set
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("canplay", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(duration, audio.currentTime + seconds)
    );
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const formatTime = (time: number): string => {
    if (!time || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)] p-4">
      <div className="w-full max-w-2xl overflow-hidden bg-white rounded-lg border border-gray-200 p-6">
        {/* Cover + Info */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={coverImage || "/default-cover.jpg"}
            alt={title}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            width={64}
            height={64}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
            <p className="text-gray-600 text-sm truncate">{artist}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div
            className="h-2 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => skip(-10)}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            disabled={!content}
          >
            {isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-0.5" />
            )}
          </button>

          <button
            onClick={() => skip(10)}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <audio ref={audioRef} preload="metadata">
          <source src={content} type="audio/mpeg" />
          <source src={content} type="audio/ogg" />
          <source src={content} type="audio/wav" />
        </audio>
      </div>
    </div>
  );
}
