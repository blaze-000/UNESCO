"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { modules } from "@/data/courseData";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export default function Quiz({
  title,
  questions,
  moduleId,
  itemId,
}: {
  title: string;
  questions: Question[];
  moduleId: string;
  itemId: string;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= questions.length;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
    setShowResult(true);
    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);

    if (currentQuestionIndex < questions.length - 1) {
      // still more questions in this quiz
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // quiz finished
      const currentModuleIndex = modules.findIndex((m) => m.id === moduleId);
      if (currentModuleIndex === -1) return;

      const currentModule = modules[currentModuleIndex];
      const currentItemIndex = currentModule.items.findIndex(
        (i) => i.id === itemId
      );

      if (currentItemIndex < currentModule.items.length - 1) {
        // go to next item in same module
        const nextItem = currentModule.items[currentItemIndex + 1];
        router.push(`/course/${moduleId}/${nextItem.id}`);
      } else {
        // last item in this module → go to next module
        const nextModule = modules[currentModuleIndex + 1];
        if (nextModule && nextModule.items.length > 0) {
          router.push(`/course/${nextModule.id}/${nextModule.items[0].id}`);
        } else {
          // no more modules → fallback to course overview
          router.push(`/course`);
        }
      }
    }
  };

  const getOptionClasses = (option: string) => {
    if (showResult) {
      if (option === currentQuestion.correctAnswer)
        return "border-green-500 bg-green-50 text-green-800";
      if (option === selectedAnswer)
        return "border-red-500 bg-red-50 text-red-800";
      return "border-gray-200 bg-gray-50 text-gray-500";
    }
    if (selectedAnswer === option)
      return "border-blue-500 bg-blue-50 text-blue-800";
    return "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
  };

  if (isQuizFinished) {
    return (
      <div className="h-full flex flex-col justify-start pt-4 md:pt-0 md:items-center md:justify-center">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quiz Complete!
            </h1>
            <p className="text-gray-600 mb-8">
              You scored {score} out of {questions.length}.
            </p>
            <Button onClick={handleNextQuestion}>
              Continue to Next Lesson
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-start pt-4 md:pt-0 md:items-center md:justify-center">
      <div className="max-w-4xl mx-auto w-full px-4 md:px-0">
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {title}
          </h1>
          <p className="text-gray-600 mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>

          {/* Question */}
          <div className="mb-1">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 md:space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${getOptionClasses(
                    option
                  )} ${showResult ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm md:text-base">{option}</span>
                    {showResult && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                    )}
                    {showResult &&
                      option === selectedAnswer &&
                      selectedAnswer !== currentQuestion.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                      )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {showResult && (
            <div
              className={`p-4 md:p-6 rounded-lg border-2 mt-4 ${
                isCorrect
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <h3
                  className={`text-lg font-semibold ${
                    isCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h3>
              </div>
              <p
                className={`text-sm md:text-base ${
                  isCorrect ? "text-green-700" : "text-red-700"
                }`}
              >
                {isCorrect
                  ? "Great job! You've selected the right answer."
                  : `The correct answer is: ${currentQuestion.correctAnswer}`}
              </p>

              {/* Show explanation only when answer is incorrect */}
              {!isCorrect && currentQuestion.explanation && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                    Explanation:
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              <Button
                onClick={handleNextQuestion}
                className="mt-4 bg-red-500 cursor-pointer hover:bg-red-700"
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
