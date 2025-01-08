"use client";

import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import {
  CopyIcon,
  // Mic,
  RefreshCcw,
  // Volume2,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeDisplayBlock from "@/components/code-display-block";
import QuestionBox, {
  QuestionBoxProps,
} from "@/components/ui/chat/question-box";

type ChatMessageProps = {
  data: {
    role: string;
    content: string;
  };
  messageId: string;
  isLastMessage: boolean;
  isGenerating: boolean;
  onActionClick: (
    action: string,
    message: {
      role: string;
      content: string;
    }
  ) => void;
  toggleCorrectAnswer: (messageId: string, add: boolean) => void;
};

const ChatAiIcons = [
  {
    icon: CopyIcon,
    label: "Copy",
  },
  {
    icon: RefreshCcw,
    label: "Refresh",
  },
  // {
  //   icon: Volume2,
  //   label: "Volume",
  // },
];

export default function ChatMessage({
  data,
  messageId,
  isLastMessage,
  isGenerating,
  onActionClick,
  toggleCorrectAnswer,
}: ChatMessageProps) {
  const parseQuestionData = (data: string): QuestionBoxProps["data"][] => {
    try {
      const parsedData = JSON.parse(data);
      if (!Array.isArray(parsedData)) {
        return [parsedData];
      }

      return parsedData;
    } catch (error) {
      //
    }

    return [];
  };

  return (
    <ChatBubble variant={data.role == "user" ? "sent" : "received"}>
      <ChatBubbleAvatar fallback={data.role == "user" ? "👨🏽" : "🤖"} />

      <ChatBubbleMessage
        className="text-sm p-4"
        isLoading={data.role === "assistant" && isLastMessage && isGenerating}
      >
        {data.role === "user" &&
          data.content.split("```").map((part: string, index: number) => {
            if (index % 2 === 0) {
              return (
                <Markdown key={index} remarkPlugins={[remarkGfm]}>
                  {part}
                </Markdown>
              );
            } else {
              return (
                <pre className="whitespace-pre-wrap pt-2" key={index}>
                  <CodeDisplayBlock code={part} lang="" />
                </pre>
              );
            }
          })}

        {data.role === "assistant" && (
          <>
            {data.content.includes("question") &&
              parseQuestionData(data.content)?.map((questionData, index) => (
                <QuestionBox
                  data={questionData}
                  key={index}
                  messageId={messageId}
                  toggleCorrectAnswer={toggleCorrectAnswer}
                  className={index > 0 ? "mt-4" : ""}
                />
              ))}

            {isLastMessage && (
              <div className="flex items-center mt-1.5 gap-1">
                {!isGenerating && (
                  <>
                    {ChatAiIcons.map((icon, iconIndex) => {
                      const Icon = icon.icon;
                      return (
                        <ChatBubbleAction
                          variant="outline"
                          className="size-5"
                          key={iconIndex}
                          icon={<Icon className="size-2" />}
                          onClick={() => onActionClick(icon.label, data)}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </ChatBubbleMessage>
    </ChatBubble>
  );
}
