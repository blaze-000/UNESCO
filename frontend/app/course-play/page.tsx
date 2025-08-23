"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  XCircle,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Types
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ContentItem {
  type: "video" | "text" | "audio" | "quiz";
  title: string;
  content: string | QuizQuestion[];
  transcript?: string;
}

interface Module {
  id: string;
  title: string;
  items: ContentItem[];
}

// Data
const modules: Module[] = [
  {
    id: "m1",
    title: "Module 1: Introduction",
    items: [
      {
        type: "video",
        title: "Welcome to MIL",
        content: "http://127.0.0.1:5000/get_video/sample",
        transcript: `Welcome to Media and Information Literacy course.\n\nIn this comprehensive program, we'll explore the fundamental concepts of media literacy, information evaluation, and critical thinking skills that are essential in our digital age.\n\nToday's digital landscape presents both opportunities and challenges. We have unprecedented access to information, but we also face the challenge of distinguishing credible sources from misinformation.\n\nThis course will equip you with the tools and knowledge needed to navigate this complex information environment effectively.`,
      },
      {
        type: "text",
        title: "Identifying Misinformation Patterns",
        content: `# Identifying Misinformation Patterns\n\nMedia literacy encompasses the ability to access, analyze, evaluate, and create media in a variety of forms. It involves understanding how media messages are constructed, who controls them, and how they influence our perceptions and behaviors.\n\n## Key Components of Media Literacy:\n\n**Access:** Finding and retrieving information effectively\n\n**Analysis:** Understanding how media messages are constructed\n\n**Evaluation:** Critically assessing the credibility and bias of sources\n\n**Creation:** Producing responsible and ethical media content`,
      },
      {
        type: "audio",
        title: "Podcast: MIL Stories",
        content: "https://www.example.com/audio1.mp3",
      },
      {
        type: "quiz",
        title: "Module 1 Exercise",
        content: [
          {
            question:
              "Which of the following is NOT a key component of media literacy?",
            options: [
              "Access - Finding and retrieving information effectively",
              "Analysis - Understanding how media messages are constructed",
              "Automation - Using AI to filter information automatically",
              "Evaluation - Critically assessing the credibility and bias of sources",
            ],
            correctAnswer: 2,
            explanation:
              'The correct answer is "Automation". Media literacy focuses on human skills like access, analysis, and evaluation rather than automated processes.',
          },
        ],
      },
    ],
  },
  {
    id: "m2",
    title: "Module 2: Evaluating Sources",
    items: [
      {
        type: "video",
        title: "Source Evaluation Basics",
        content: "https://www.example.com/video2",
        transcript: `This is a placeholder transcript for Module 2 video.`,
      },
      {
        type: "text",
        title: "CRAAP Framework",
        content: `# The CRAAP Framework\n\nUse this framework to evaluate information sources:\n\n## Currency\nIs the information current and up-to-date?\n\n## Relevance\nDoes the information relate to your topic?\n\n## Authority\nWho is the author? Are they qualified?\n\n## Accuracy\nIs the information reliable and correct?\n\n## Purpose\nWhy was this information created?`,
      },
    ],
  },
];



// Components
function VideoPlayer({ content }: { content: string }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <video
        controls
        className="w-full rounded-lg bg-gray-900 aspect-video object-contain shadow-lg"
        src={content}
      >
        Your browser does not support embedded videos.
      </video>
    </div>
  );
}

function TextContent({ content }: { content: string }) {
  const formatContent = (text: string) => {
    return text.split("\n").map((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("# ")) {
        return (
          <h1
            key={index}
            className="text-3xl font-bold text-foreground mt-8 mb-6 first:mt-0"
          >
            {trimmed.slice(2)}
          </h1>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-2xl font-semibold text-foreground mt-8 mb-4"
          >
            {trimmed.slice(3)}
          </h2>
        );
      }
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        return (
          <p key={index} className="font-semibold text-foreground mb-3 text-lg">
            {trimmed.slice(2, -2)}
          </p>
        );
      }
      if (trimmed === "") {
        return <div key={index} className="h-4" />;
      }

      return (
        <p
          key={index}
          className="text-muted-foreground leading-relaxed mb-4 text-lg"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="prose prose-lg max-w-none">{formatContent(content)}</div>
    </div>
  );
}

function AudioPlayer({ title, content }: { title: string; content: string }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-6">
          {title}
        </h2>
        <div className="bg-muted rounded-lg p-6">
          <audio controls className="w-full">
            <source src={content} />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
}

function QuizComponent({
  title,
  questions,
  onComplete,
}: {
  title: string;
  questions: QuizQuestion[];
  onComplete: () => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const question = questions[0];

  useEffect(() => {
    if (selectedAnswer !== null) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedAnswer, onComplete]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Practice Quiz • 1 question
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-medium text-card-foreground">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              let className =
                "w-full p-4 text-left rounded-lg border hover:border-muted-foreground/50 transition-all";
              let icon = null;

              if (selectedAnswer === index) {
                if (index === question.correctAnswer) {
                  className =
                    "w-full p-4 text-left rounded-lg border-2 border-green-500 bg-green-50";
                  icon = (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  );
                } else {
                  className =
                    "w-full p-4 text-left rounded-lg border-2 border-red-500 bg-red-50";
                  icon = (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  );
                }
              } else if (
                selectedAnswer !== null &&
                index === question.correctAnswer
              ) {
                className =
                  "w-full p-4 text-left rounded-lg border-2 border-green-500 bg-green-50";
                icon = (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={className}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-card-foreground text-left flex-1">
                      {option}
                    </span>
                    {icon}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-900 mb-2">Explanation:</p>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CourseSidebar({
  modules,
  activeModule,
  activeItem,
  onSelect,
  isOpen,
  onClose,
}: {
  modules: Module[];
  activeModule: number;
  activeItem: number;
  onSelect: (moduleIndex: number, itemIndex: number) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 bottom-0 w-80 bg-background border-l z-50 flex flex-col",
          "lg:block lg:z-auto lg:border-l",
          "transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          !isOpen && "lg:hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mt-16.25 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h2 className="font-semibold text-foreground">Course Content</h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Show course content"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {modules.map((module, mIndex) => (
            <div key={module.id}>
              <h3 className="font-medium text-foreground mb-3 text-sm uppercase tracking-wide">
                {module.title}
              </h3>
              <div className="space-y-2">
                {module.items.map((item, iIndex) => {
                  const isActive =
                    mIndex === activeModule && iIndex === activeItem;
                  const typeLabels = {
                    video: "Video",
                    text: "Reading",
                    audio: "Audio",
                    quiz: "Quiz",
                  };

                  return (
                    <button
                      key={iIndex}
                      onClick={() => {
                        onSelect(mIndex, iIndex);
                        // Removed onClose() to keep sidebar open
                      }}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-all text-sm",
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="font-medium">
                        {typeLabels[item.type]} • {item.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

function TranscriptSidebar({
  transcript,
  isOpen,
  onClose,
}: {
  transcript?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!transcript) return null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-80 bg-background border-r z-50 flex flex-col",
          "lg:block lg:z-auto lg:border-r",
          "transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          !isOpen && "lg:hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Transcript</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable transcript content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            {transcript.split("\n\n").map((paragraph, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                {paragraph}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default function CoursePlayer() {
  const [moduleIndex, setModuleIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  const router = useRouter();

  const currentModule = modules[moduleIndex];
  const currentItem = currentModule.items[itemIndex];
  const isVideo = currentItem.type === "video";

  const canPrev = moduleIndex > 0 || itemIndex > 0;
  const canNext =
    moduleIndex < modules.length - 1 ||
    itemIndex < currentModule.items.length - 1;

  const goNext = useCallback(() => {
    if (itemIndex < currentModule.items.length - 1) {
      setItemIndex(itemIndex + 1);
    } else if (moduleIndex < modules.length - 1) {
      setModuleIndex(moduleIndex + 1);
      setItemIndex(0);
    }
    setSidebarOpen(true);
  }, [itemIndex, moduleIndex, currentModule.items.length]);

  const goPrev = () => {
    if (itemIndex > 0) {
      setItemIndex(itemIndex - 1);
    } else if (moduleIndex > 0) {
      setModuleIndex(moduleIndex - 1);
      setItemIndex(modules[moduleIndex - 1].items.length - 1);
    }
  };

  const content = useMemo(() => {
    switch (currentItem.type) {
      case "video":
        return <VideoPlayer content={currentItem.content as string} />;
      case "text":
        return <TextContent content={currentItem.content as string} />;
      case "audio":
        return (
          <AudioPlayer
            title={currentItem.title}
            content={currentItem.content as string}
          />
        );
      case "quiz":
        return (
          <QuizComponent
            title={currentItem.title}
            questions={currentItem.content as QuizQuestion[]}
            onComplete={goNext}
          />
        );
      default:
        return null;
    }
  }, [currentItem, goNext]);

   


  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0  bg-background/95 max-w-4xl mx-auto w-full ">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <button onClick={() => router.push("/course")} 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline font-medium cursor-pointer">
                Back to Course
              </span>
            </button>

            {/* Title */}
            <h1 className="font-semibold text-foreground text-center mx-4 truncate">
              {currentItem.title}
            </h1>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isVideo && (
                <button
                  onClick={() => setTranscriptOpen((open) => !open)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title={transcriptOpen ? "Hide transcript" : "Show transcript"}
                >
                  <FileText className="w-4 h-4" />
                </button>
              )}
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Show course content"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main layout */}
      {isVideo && (
        <TranscriptSidebar
          transcript={currentItem.transcript}
          isOpen={transcriptOpen}
          onClose={() => setTranscriptOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto bg-background lg:mx-80",
          transcriptOpen && "lg:ml-80",
          sidebarOpen && "lg:mr-80"
        )}
      >
        <div className="p-4 lg:p-8 pb-24 max-w-4xl mx-auto">{content}</div>
      </main>

      {/* Course sidebar (right) */}
      <CourseSidebar
        modules={modules}
        activeModule={moduleIndex}
        activeItem={itemIndex}
        onSelect={(m, i) => {
          setModuleIndex(m);
          setItemIndex(i);
          setSidebarOpen(true);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Navigation buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg border px-3 py-2">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors rounded-md hover:bg-muted"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Previous</span>
          </button>

          <div className="w-px h-6 bg-border"></div>

          <button
            onClick={goNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
          >
            <span className="font-medium text-sm">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
