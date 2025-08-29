"use client";

import React from "react";
import type { ReactElement } from "react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type StreamEvent = {
  type: "progress" | "result" | "error";
  content: string;
};

type Message = {
  id: string;
  type: "user" | "assistant" | "progress" | "error";
  content: string;
  timestamp: Date;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL 

const EXAMPLE_PROMPTS = [
  "Colgate Optic White Renewal is a high-performance whitening toothpaste designed to remove up to 15 years of stains with its 5% hydrogen peroxide formula. It targets deep-set discoloration from coffee, tea, and wine while remaining gentle on enamel. With a refreshing mint flavor and fluoride protection, it not only brightens your smile but also strengthens teeth and fights cavities.",
  "Infused with Vitamin C and turmeric, Mamaearth’s Vitamin C Face Wash is crafted to illuminate dull skin and fight free radical damage. Its antioxidant-rich formula gently cleanses while promoting an even skin tone and natural radiance. Suitable for all skin types, it’s free from sulfates and parabens, making it a safe choice for daily use.",
];

const InputComponent = React.memo(
  ({
    inputValue,
    onInputChange,
    onKeyDown,
    isLoading,
    onSubmit,
    textareaRef,
    className = "",
  }: {
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    isLoading: boolean;
    onSubmit: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    className?: string;
  }) => (
    <div
      className={`flex items-center gap-2 w-full border-2 border-gray-200 bg-white rounded-2xl transition-all duration-200 hover:border-gray-300 ${className}`}
    >
      <textarea
        ref={textareaRef}
        placeholder="Paste marketing text here..."
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        className="flex-1 border-0 bg-transparent text-gray-600 placeholder-gray-500 focus:outline-none focus:ring-0 px-3 py-2 text-base sm:text-sm font-normal resize-none min-h-[48px] sm:min-h-[56px] max-h-[120px] leading-6 font-sans"
        style={{ height: "auto" }}
      />

      <Button
        variant="ghost"
        size="icon"
        className="mr-2 mb-2 items-center justify-center rounded-full text-gray-500 hover:bg-red-500 hover:text-white transition-colors flex-shrink-0 focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
        onClick={onSubmit}
        disabled={!inputValue.trim() || isLoading}
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  )
);

InputComponent.displayName = "InputComponent";

export default function ChatsPage(): ReactElement {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isIdle = useMemo(() => {
    return !isLoading && messages.length === 0;
  }, [isLoading, messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentProgress]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => {
      textareaRef.current?.focus();
      adjustTextareaHeight();
    }, 0);
  };

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 24;
      const maxLines = 5;
      const maxHeight = lineHeight * maxLines;

      if (scrollHeight <= maxHeight) {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = "hidden";
      } else {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto";
      }
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      adjustTextareaHeight();
    },
    [adjustTextareaHeight]
  );

  const addMessage = (type: Message["type"], content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const startVerification = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    // 🔹 Clear previous chat
    setMessages([]);

    setIsLoading(true);
    setCurrentProgress(null);
   
    setInputValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    addMessage("user", text);

    try {
      const res = await fetch(`${BACKEND_URL}/start_verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to start verification");
      }

      const data = (await res.json()) as { session_id: string };

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const es = new EventSource(
        `${BACKEND_URL}/stream_progress/${data.session_id}`
      );
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const parsed: StreamEvent = JSON.parse(event.data);
          if (parsed.type === "progress") {
            setCurrentProgress(parsed.content);
          } else if (parsed.type === "result") {
            addMessage("assistant", parsed.content);
            setCurrentProgress(null);
            setIsLoading(false);
            es.close();
          } else if (parsed.type === "error") {
            const errorMessage = `Analysis failed: ${parsed.content}`;
            addMessage("error", errorMessage);
            setCurrentProgress(null);
            setIsLoading(false);
            es.close();
          }
        } catch {}
      };

      es.onerror = () => {
        addMessage("error", "Connection lost while streaming progress");
        setCurrentProgress(null);
        setIsLoading(false);
        es.close();
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unexpected error";
      addMessage("error", errorMessage);
      setCurrentProgress(null);
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        startVerification();
      }
    },
    [startVerification]
  );

  const ThinkingDots = () => (
    <motion.div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.4,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );

  const renderMessage = (message: Message) => {
    switch (message.type) {
      case "user":
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right"
          >
            <div className="inline-block max-w-full sm:max-w-3xl text-left">
              <p className="text-gray-900 bg-gray-100 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 inline-block whitespace-pre-wrap text-sm sm:text-base">
                {message.content}
              </p>
            </div>
          </motion.div>
        );

      case "assistant":
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left"
          >
            <div className="inline-block max-w-full sm:max-w-3xl">
              <div className="bg-white rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left"
          >
            <div className="inline-block max-w-full sm:max-w-3xl">
              <div className="bg-red-50 border border-red-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                <p className="text-red-700 text-sm sm:text-base">
                  {message.content}
                </p>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] bg-white flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Front page idle view */}
        {isIdle ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full px-3 sm:px-4 flex-1 flex flex-col items-center justify-center"
          >
            <div className="max-w-3xl mx-auto w-full">
              <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold  text-gray-900 mb-3 sm:mb-5">
                Meet <span className="text-red-500">Luma</span>
              </motion.h1>
              <motion.p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-10 max-w-xl mx-auto px-2 sm:px-4">
                Your AI assistant for{" "}
                <span className="font-semibold">
                  marketing claim verification
                </span>
                . Paste any text, and Luma will check the facts for you in real
                time.
              </motion.p>

              <motion.div className="mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-500 mb-3">
                  Try one of these examples:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  {EXAMPLE_PROMPTS.map((prompt, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleExampleClick(prompt)}
                      className="block w-full cursor-pointer text-left p-3 sm:p-4 md:p-5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition text-sm md:text-base"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <InputComponent
                inputValue={inputValue}
                onInputChange={handleInputChange}
                onKeyDown={handleKeyDown}
                isLoading={isLoading}
                onSubmit={startVerification}
                textareaRef={textareaRef}
              />
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {messages.map(renderMessage)}

              <AnimatePresence mode="wait">
                {isLoading && currentProgress && (
                  <motion.div
                    key={currentProgress}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-left"
                  >
                    <div className="inline-block max-w-full sm:max-w-3xl">
                      <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                        <ThinkingDots />
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {currentProgress}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {!isIdle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-t border-gray-100 px-3 sm:px-4 py-3 sm:py-4 shadow-lg"
        >
          <div className="max-w-2xl mx-auto">
            <InputComponent
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              isLoading={isLoading}
              onSubmit={startVerification}
              textareaRef={textareaRef}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
