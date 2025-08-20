"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
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

const BACKEND_URL = "http://127.0.0.1:5000";

export default function ChatsPage() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [askedQuestion, setAskedQuestion] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isIdle = useMemo(() => {
    const idle = !isLoading && messages.length === 0;
    console.log("isIdle calculation:", {
      isLoading,
      messagesLength: messages.length,
      idle,
    });
    return idle;
  }, [isLoading, messages.length]);

  // Auto-scroll to bottom when new content is added
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

  const addMessage = (type: Message["type"], content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const startVerification = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setCurrentProgress(null);
    setAskedQuestion(text);
    setInputValue(""); // Clear the input

    // Add user message to chat history
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

      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const es = new EventSource(
        `${BACKEND_URL}/stream_progress/${data.session_id}`
      );
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        console.log("Received event:", event.data);
        try {
          const parsed: StreamEvent = JSON.parse(event.data);
          console.log("Parsed event:", parsed);
          if (parsed.type === "progress") {
            setCurrentProgress(parsed.content);
          } else if (parsed.type === "result") {
            // Add final result to chat history
            addMessage("assistant", parsed.content);
            setCurrentProgress(null);
            setIsLoading(false);
            es.close();
          } else if (parsed.type === "error") {
            console.error("Backend error:", parsed.content);
            const errorMessage = `Analysis failed: ${parsed.content}. Please try again with different text.`;
            addMessage("error", errorMessage);
            setCurrentProgress(null);
            setIsLoading(false);
            es.close();
          }
        } catch (parseError) {
          console.error("Error parsing event data:", parseError);
          // Don't close connection on parse errors, just ignore malformed chunks
        }
      };

      es.onerror = (error) => {
        console.error("EventSource error:", error);
        const errorMessage = "Connection lost while streaming progress";
        addMessage("error", errorMessage);
        setCurrentProgress(null);
        setIsLoading(false);
        es.close();
      };

      es.onopen = () => {
        console.log("EventSource connection opened");
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unexpected error";
      addMessage("error", errorMessage);
      setCurrentProgress(null);
      setIsLoading(false);
    }
  };

  const retryVerification = () => {
    // Remove the last error message and retry
    setMessages((prev) => prev.filter((msg) => msg.type !== "error"));
    setCurrentProgress(null);
    if (askedQuestion) {
      setInputValue(askedQuestion);
      startVerification();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      startVerification();
    }
  };

  // Animated thinking dots component
  const ThinkingDots = () => (
    <motion.div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );

  // Format progress message to remove emoji and make it more readable
  const formatProgressMessage = (message: string) => {
    return message.trim();
  };

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
            <div className="inline-block max-w-3xl text-left">
              <p className="text-gray-900 bg-gray-100 rounded-2xl px-4 py-3 inline-block">
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
            <div className="inline-block max-w-3xl">
              <div className="bg-white rounded-2xl px-4 py-3">
                <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold mb-3 mt-0 text-gray-900 leading-tight">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold mb-2 mt-4 first:mt-0 text-gray-900 leading-tight">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-medium mb-2 mt-3 first:mt-0 text-gray-900 leading-tight">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 mb-3 last:mb-0 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-3 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700 leading-relaxed">
                          {children}
                        </li>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline transition-colors"
                        >
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-3">
                          <table className="table-auto border-collapse border border-gray-300 w-full">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-gray-50">{children}</thead>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-900">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">
                          {children}
                        </td>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-900 text-white p-3 rounded-md my-3 overflow-x-auto">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3">
                          {children}
                        </blockquote>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-700">{children}</em>
                      ),
                    }}
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
            <div className="inline-block max-w-3xl">
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <p className="text-red-700 mb-0">{message.content}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800 mt-2 px-0"
                  onClick={retryVerification}
                >
                  Retry
                </Button>
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
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isIdle ? (
          // Initial state - centered content
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center w-full px-4 flex-1 flex flex-col items-center justify-center"
          >
            <div className="max-w-2xl mx-auto">
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Marketing Claim Verifier
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 mb-8 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Paste any marketing text and I&rsquo;ll verify the claims using
                AI-powered fact-checking
              </motion.p>

              <motion.div
                className="w-full max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center w-full border-2 border-gray-200 bg-white rounded-2xl transition-colors">
                  <Input
                    type="text"
                    placeholder="Paste marketing text here..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 line-clamp-3 border-0 bg-transparent text-gray-700 placeholder-gray-400 focus-visible:ring-0 px-4 py-6 focus-visible:ring-offset-0 text-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    onClick={startVerification}
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Chat state - conversation history
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Render all messages in conversation history */}
              {messages.map(renderMessage)}

              {/* Current progress/thinking - single step display */}
              <AnimatePresence mode="wait">
                {isLoading && currentProgress && (
                  <motion.div
                    key={currentProgress}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-left"
                  >
                    <div className="inline-block max-w-3xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                        <ThinkingDots />
                      </div>
                      <p className="text-gray-600 text-sm">
                        {formatProgressMessage(currentProgress)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom search bar - only show when not in idle state */}
      {!isIdle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-t border-gray-100 px-4 py-4"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center w-full border-2 border-gray-200 bg-white rounded-2xl transition-colors">
              <Input
                type="text"
                placeholder="Paste marketing text here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-0 bg-transparent text-gray-700 placeholder-gray-400 focus-visible:ring-0 px-4 py-6 focus-visible:ring-offset-0 text-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                onClick={startVerification}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
