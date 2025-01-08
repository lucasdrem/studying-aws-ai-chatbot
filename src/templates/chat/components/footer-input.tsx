"use client";

import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import { useRef } from "react";

type FooterInputProps = {
  loading: boolean;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function FooterInput({
  loading,
  input,
  onSubmit,
  onKeyDown,
  handleInputChange,
}: FooterInputProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
    >
      <ChatInput
        value={input}
        onKeyDown={onKeyDown}
        onChange={handleInputChange}
        placeholder="Type an AWS service that you want to study..."
        className="min-h-4 text-left pb-2 rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center p-3 pt-0">
        {/* <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button> */}

        <Button
          disabled={!input || loading}
          type="submit"
          size="sm"
          className="ml-auto gap-1.5"
        >
          Send
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
  );
}
