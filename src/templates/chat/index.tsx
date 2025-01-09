"use client";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";

import { useChat } from "ai/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { QuestionBoxProps } from "@/components/ui/chat/question-box";
import FooterInput from "./components/footer-input";
import InitialMessage from "./components/initial-message";
import ChatMessage from "./components/chat-message";
import QuizCounter from "./components/quiz-counter";
import { IQuestion } from "@/lib/types";

export default function ChatMessages() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, IQuestion.QuestionChoice | null>
  >({});

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
  } = useChat({
    onError(error) {
      if (error) {
        setIsGenerating(false);
      }
    },
    onFinish() {
      setIsGenerating(false);
    },
  });

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleActionClick = async (
    action: string,
    message: {
      role: string;
      content: string;
    }
  ) => {
    if (action === "Refresh") {
      setIsGenerating(true);
      try {
        await reload();
      } catch (error) {
        console.error("Error reloading:", error);
      } finally {
        setIsGenerating(false);
      }
    }

    if (action === "Copy") {
      if (message && message.role === "assistant") {
        navigator.clipboard.writeText(message.content);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    handleSubmit(e);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating || isLoading || !input) return;
      setIsGenerating(true);
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const onSelectAnswer =
    (messageId: string) => (answer: IQuestion.QuestionChoice | null) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [messageId]: answer,
      }));
    };

  const { correctAnswers, totalQuestions } = useMemo(() => {
    return {
      correctAnswers: Object.values(selectedAnswers).filter(
        (answer) => !!answer?.isCorrect
      ).length,
      totalQuestions: messages.filter((message) => message.role === "assistant")
        .length,
    };
  }, [messages, selectedAnswers]);

  return (
    <Fragment>
      {!!messages.length && (
        <div className="py-6">
          {/* Quiz Counter Header */}
          <QuizCounter
            correctAnswers={correctAnswers}
            totalQuestions={totalQuestions}
          />
        </div>
      )}

      <div className="flex-1 w-full overflow-y-auto" ref={messagesRef}>
        <ChatMessageList>
          {/* Initial Message */}
          {messages.length === 0 && <InitialMessage />}

          {/* Messages */}
          {messages.length >= 1 &&
            messages.map((message, index) => (
              <ChatMessage
                key={index}
                data={message}
                selectedAnswer={selectedAnswers[index.toString()]}
                isGenerating={isGenerating}
                isLastMessage={index === messages.length - 1}
                onActionClick={handleActionClick}
                onSelectAnswer={onSelectAnswer(index.toString())}
              />
            ))}
        </ChatMessageList>
      </div>

      {/* Form and Footer fixed at the bottom */}
      <div className="w-full px-4 pb-4">
        <FooterInput
          loading={isGenerating}
          input={input}
          handleInputChange={handleInputChange}
          onSubmit={onSubmit}
          onKeyDown={onKeyDown}
        />
      </div>
    </Fragment>
  );
}
