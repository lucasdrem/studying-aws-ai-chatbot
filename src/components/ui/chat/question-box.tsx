// components/QuestionBox.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IQuestion } from "@/lib/types";

export type QuestionBoxProps = {
  data: IQuestion.default;
  selectedAnswer?: IQuestion.QuestionChoice | null;
  onSelectAnswer: (answer: IQuestion.QuestionChoice | null) => void;
  className?: string;
};

const QuestionBox = ({
  data,
  selectedAnswer,
  className,
  onSelectAnswer,
}: QuestionBoxProps) => {
  const handleSelectAnswer = (index: number) => {
    if (index.toString() === selectedAnswer?.id) {
      onSelectAnswer(null);
      return;
    }

    onSelectAnswer({
      ...data.answerChoices[index],
      id: index.toString(),
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
              selectedAnswer?.id === index.toString()
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
