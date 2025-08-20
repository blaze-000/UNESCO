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
} from "lucide-react";

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
    <div className="w-full">
      <video
        controls
        className="w-full rounded-lg bg-gray-900 min-h-[300px] md:min-h-[400px] object-contain"
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
            className="text-3xl font-bold text-gray-900 mt-8 mb-6 first:mt-0"
          >
            {trimmed.slice(2)}
          </h1>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-2xl font-semibold text-gray-900 mt-8 mb-4"
          >
            {trimmed.slice(3)}
          </h2>
        );
      }
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        return (
          <p key={index} className="font-semibold text-gray-900 mb-3 text-lg">
            {trimmed.slice(2, -2)}
          </p>
        );
      }
      if (trimmed === "") {
        return <div key={index} className="h-4" />;
      }

      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4 text-lg">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="prose prose-lg max-w-none overflow-y-auto">
        {formatContent(content)}
      </div>
    </div>
  );
}

function AudioPlayer({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div className="bg-gray-50 rounded-lg p-6">
        <audio controls className="w-full">
          <source src={content} />
          Your browser does not support the audio element.
        </audio>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">Practice Quiz • 1 question</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let className =
              "w-full p-4 text-left rounded-lg border border-gray-200 hover:border-gray-300 transition-all";
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
                  <span className="text-gray-900 text-left flex-1">
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
  );
}

function Sidebar({
  modules,
  activeModule,
  activeItem,
  onSelect,
  isOpen,
  onToggle,
}: {
  modules: Module[];
  activeModule: number;
  activeItem: number;
  onSelect: (moduleIndex: number, itemIndex: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white border-l border-gray-200 
        transform transition-transform duration-300 z-50 flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        lg:relative lg:translate-x-0 lg:z-auto lg:w-80
        ${!isOpen ? "lg:w-0 lg:border-0" : ""}
      `}
      >
        {isOpen && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="font-semibold text-gray-900">Course Content</h3>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 p-4">
              {modules.map((module, mIndex) => (
                <div key={module.id} className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    {module.title}
                  </h4>
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
                          onClick={() => onSelect(mIndex, iIndex)}
                          className={`
                            w-full text-left p-3 rounded-lg transition-all text-sm
                            ${
                              isActive
                                ? "bg-blue-50 text-blue-900 border border-blue-200"
                                : "hover:bg-gray-50 text-gray-700"
                            }
                          `}
                        >
                          <div className="font-medium mb-1">
                            {typeLabels[item.type]} • {item.title}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function TranscriptPanel({
  transcript,
  isOpen,
  onToggle,
}: {
  transcript?: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  if (!transcript) return null;

  return (
    <>
      {/* Backdrop (only mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Panel */}
      <div
        className={`
        fixed left-0 top-0 h-full w-80 max-w-[90vw] bg-white border-r border-gray-200
        transform transition-transform duration-300 z-50 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:z-auto lg:w-80
      `}
      >
        {isOpen && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Transcript</h3>
              </div>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 p-4">
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                {transcript.split("\n\n").map((paragraph, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    {paragraph}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function CoursePlayer() {
  const [moduleIndex, setModuleIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true); // open by default
  const [transcriptOpen, setTranscriptOpen] = useState(true);

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
    setSidebarOpen(true); // keep sidebar open after next
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
    <div className=" flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline cursor-pointer">
                  Back to Course
                </span>
              </button>
            </div>

            <h1 className="font-semibold text-gray-900 text-center flex-1 mx-4 truncate">
              {currentItem.title}
            </h1>

            <div className="flex items-center gap-2">
              {isVideo && (
                <button
                  onClick={() => setTranscriptOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FileText className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Transcript Sidebar */}
        {isVideo && (
          <TranscriptPanel
            transcript={currentItem.transcript}
            isOpen={transcriptOpen}
            onToggle={() => setTranscriptOpen(!transcriptOpen)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 lg:p-8 pb-24">
            <div className="max-w-4xl mx-auto">{content}</div>
          </div>
        </main>

        {/* Course Sidebar */}
        <Sidebar
          modules={modules}
          activeModule={moduleIndex}
          activeItem={itemIndex}
          onSelect={(m, i) => {
            setModuleIndex(m);
            setItemIndex(i);
            setSidebarOpen(true); // always open after select
          }}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Fixed Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex gap-3 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className="flex items-center gap-2 px-4 py-1 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:hover:text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium">Previous</span>
          </button>

          <div className="w-px bg-gray-200"></div>

          <button
            onClick={goNext}
            disabled={!canNext}
            className="flex items-center gap-2 px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600"
          >
            <span className="font-medium">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toggle buttons for desktop - positioned where close buttons are */}
      <div className="hidden lg:block">
        {isVideo && !transcriptOpen && (
          <button
            onClick={() => setTranscriptOpen(true)}
            className="fixed left-4 top-34 p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50 z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed right-4 top-34 p-2 bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50 z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
