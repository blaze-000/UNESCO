"use client";

import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  title: string;
  content: string;
  coverImage?: string;
}

export default function AudioPlayer({
  title,
  content,
  coverImage,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const audioCtx = audioCtxRef.current;

    // ✅ Only create source once
    if (!sourceRef.current) {
      const source = audioCtx.createMediaElementSource(audio);
      sourceRef.current = source;
    }

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1.5;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    // connect existing source
    sourceRef.current.connect(gainNode).connect(analyser).connect(audioCtx.destination);

    gainNodeRef.current = gainNode;
    analyserRef.current = analyser;

    visualize(); // restart visualizer for new audio

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("canplay", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("canplay", updateDuration);
      audio.removeEventListener("ended", handleEnded);

      cancelAnimationFrame(animationRef.current!);
    };
  }, [content]); // ✅ re-run setup whenever audio src changes

  const visualize = () => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        // Resume audio context if suspended
        if (audioCtxRef.current?.state === "suspended") {
          await audioCtxRef.current.resume();
        }
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

  const changeSpeed = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlaybackRate(rate);
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
      <div className="w-full max-w-3xl overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

        {/* Visualizer - show only when playing */}

          <div className={`mb-6 visualizer ${isPlaying ? "visible" : "hidden"}`}>
            <canvas
              ref={canvasRef}
              width={600}
              height={100}
              className="w-full bg-white rounded-lg border border-gray-200"
            />
          </div>


        {/* Cover + Title */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={coverImage || "/default-cover.jpg"}
            alt={title}
            className="w-36 h-36 rounded-xl object-cover flex-shrink-0 border border-gray-200"
            width={96}
            height={96}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg truncate">
              {title}
            </h3>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div
            className="h-2 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8">
          <motion.button
            onClick={() => skip(-15)}
            className="p-3 text-gray-600 hover:text-gray-900 transition-colors"
            whileTap={{ rotate: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <RotateCcw size={28} />
          </motion.button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            disabled={!content}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
          </button>

          <motion.button
            onClick={() => skip(15)}
            className="p-3 text-gray-600 hover:text-gray-900 transition-colors"
            whileTap={{ rotate: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <RotateCw size={28} />
          </motion.button>
        </div>

        {/* Playback Speed Control */}
        <div className="flex justify-center mt-6 gap-3 text-sm">
          {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => changeSpeed(rate)}
              className={`px-3 py-1 rounded-lg ${
                playbackRate === rate
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Hidden Audio Element */}
        <audio key={content} ref={audioRef} preload="metadata">
          <source src={content} type="audio/mpeg" />
          <source src={content} type="audio/ogg" />
          <source src={content} type="audio/wav" />
        </audio>
      </div>
    </div>
  );
}
