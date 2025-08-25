"use client";

import { useEffect, useState } from "react";
import {  CheckCircle, XCircle } from "lucide-react";

export function Quiz({ 
  title, 
  question, 
  options, 
  correctAnswer 
}: { 
  title: string; 
  question: string; 
  options: string[]; 
  correctAnswer: number; 
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);



  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-8">Choose the best answer</p>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{question}</h2>
          
          <div className="space-y-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  showResult
                    ? index === correctAnswer
                      ? "border-green-500 bg-green-50 text-green-800"
                      : index === selectedAnswer && selectedAnswer !== correctAnswer
                      ? "border-red-500 bg-red-50 text-red-800"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                    : selectedAnswer === index
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {showResult && index === correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                  )}
                  {showResult && index === selectedAnswer && selectedAnswer !== correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showResult && (
          <div className={`p-6 rounded-lg border-2 ${
            isCorrect 
              ? "border-green-200 bg-green-50" 
              : "border-red-200 bg-red-50"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <h3 className={`text-lg font-semibold ${
                isCorrect ? "text-green-800" : "text-red-800"
              }`}>
                {isCorrect ? "Correct!" : "Incorrect"}
              </h3>
            </div>
            <p className={`${isCorrect ? "text-green-700" : "text-red-700"}`}>
              {isCorrect 
                ? "Great job! You've selected the right answer."
                : `The correct answer is: ${options[correctAnswer]}`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}