"use client";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";

import { useChat } from "ai/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { QuestionBoxProps } from "@/components/ui/chat/question-box";
import FooterInput from "./components/footer-input";
import InitialMessage from "./components/initial-message";
import ChatMessage from "./components/chat-message";
import QuizCounter from "./components/quiz-counter";

export default function ChatMessages() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, boolean>>(
    {}
  );

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

  const toggleCorrectAnswer = (messageId: string, add: boolean) => {
    setCorrectAnswers((prev) => ({
      ...prev,
      [messageId]: Boolean(add),
    }));
  };

  return (
    <Fragment>
      <div className="py-6">
        {/* Quiz Counter Header */}
        {!!messages.length && (
          <QuizCounter
            correctAnswers={
              Object.values(correctAnswers).filter(Boolean).length
            }
            totalQuestions={
              messages.filter((message) => message.role === "assistant").length
            }
          />
        )}
      </div>

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
                messageId={index.toString()}
                onActionClick={handleActionClick}
                toggleCorrectAnswer={toggleCorrectAnswer}
                isLastMessage={index === messages.length - 1}
                isGenerating={isGenerating}
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
