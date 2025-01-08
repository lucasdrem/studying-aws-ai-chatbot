// components/QuestionBox.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type QuestionBoxProps = {
  data: {
    question: string;
    answerChoices: {
      answer: string;
      isCorrect: boolean;
      explanation: string;
    }[];
  };
  messageId: string;
  toggleCorrectAnswer: (messageId: string, add: boolean) => void;
  className?: string;
};

const QuestionBox = ({
  data,
  className,
  messageId,
  toggleCorrectAnswer,
}: QuestionBoxProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<{
    index: number;
    answer: string;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  const handleSelectAnswer = (index: number) => {
    if (index === selectedAnswer?.index) {
      toggleCorrectAnswer(messageId, false);
      setSelectedAnswer(null);
      return;
    }

    toggleCorrectAnswer(messageId, data.answerChoices[index]?.isCorrect);
    setSelectedAnswer({
      index,
      ...data.answerChoices[index],
    });
  };

  if (!data?.question) return;

  return (
    <Card
      className={cn("h-fit w-full p-0 bg-transparent shadow-none", className)}
    >
      <CardHeader className="text-sm font-semibold p-0 mb-4">
        {data.question}
      </CardHeader>

      <CardContent className="p-0">
        {data.answerChoices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            className={`block w-full text-left p-2 my-2 border border-white rounded-lg text-sm focus:ring-slate-900 focus:outline-white ${
              selectedAnswer?.index === index
                ? "bg-white text-slate-900 border-slate-900"
                : ""
            }`}
          >
            {choice.answer}
          </button>
        ))}
      </CardContent>

      {selectedAnswer != null && (
        <CardFooter
          className={cn(
            "mx-0 p-2 mt-4 rounded-lg border border-white",
            selectedAnswer.isCorrect ? "bg-green-600" : "bg-destructive/65"
          )}
        >
          <p className="text text-sm">
            <span className="font-semibold">Explanation:</span>{" "}
            {selectedAnswer.explanation}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default QuestionBox;
