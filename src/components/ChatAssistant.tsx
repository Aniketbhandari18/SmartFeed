"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./chat/conversation";
import { Message, MessageContent } from "./chat/message";
import { Response } from "./chat/response";
import {
  PromptInput,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "./chat/prompt-input";
import { Bot, MicIcon } from "lucide-react";
import { ChatLoader } from "./chat/chat-loader";

export default function ChatAssistant({ spaceId }: { spaceId: string }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        spaceId,
      },
    }),
  });

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-foreground">
        AI Feedback Assistant
      </h2>

      <div className="p-2 relative size-full rounded-lg border h-[650px] bg-gray-50">
        <div className="flex flex-col h-full">
          <Conversation>
            <ConversationContent className="pt-0">
              <Message from="assistant" className="flex items-start gap-3">
                <MessageContent className="bg-gray-200!">
                  Hi! I'm your SmartFeed AI assistant. I can help you analyze
                  feedback patterns, suggest improvements, and answer questions
                  about your feedback data.
                </MessageContent>
                <Bot className="h-6 w-6 text-blue-600 mt-1" />
              </Message>
              {messages.map((message) => (
                <Message
                  from={message.role}
                  key={message.id}
                  className="flex items-start gap-3"
                >
                  <MessageContent
                    className={`${
                      message.role === "user" ? "bg-blue-500!" : "bg-gray-200!"
                    }`}
                  >
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          console.log("part.text:", part.text);
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                  {message.role === "assistant" && (
                    <Bot className="h-6 w-6 text-blue-600 mt-1" />
                  )}
                </Message>
              ))}
              {status === "submitted" && <ChatLoader />}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <PromptInput
            onSubmit={handleSend}
            className="m-1 mt-4 max-w-[calc(100%-0.5rem)]"
          >
            <PromptInputTextarea
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setInput(e.target.value)
              }
              value={input}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton>
                  <MicIcon size={16} />
                </PromptInputButton>
              </PromptInputTools>
              <PromptInputSubmit disabled={!input} status={status} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
