import React from "react";
import { type ChatMessageResponse } from "@/types/chat";
import { TypingText } from "@/components/chat/TypingText";
import { renderMarkdown } from "./markdownRenderer";

interface Props {
    message: ChatMessageResponse;
    isUser: boolean;
    isLatest?: boolean;
    onTyping?: () => void;
}

function calculateTypingSpeed(text: string): number {
    const length = text.length;

    const minSpeed = 15;
    const maxSpeed = 60;

    if (length === 0) return maxSpeed;
    const clampedLength = Math.min(Math.max(length, 10), 300);
    const normalized = (clampedLength - 10) / (300 - 10);
    return maxSpeed - normalized * (maxSpeed - minSpeed);
}

export const ChatMessageBubble: React.FC<Props> = ({ message, isUser, isLatest, onTyping }) => {
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-2xl p-3 my-1 text-sm shadow-md whitespace-pre-line
          ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"}`}
            >
                {isUser ? message.question : isLatest ? (
                    <TypingText text={message.answer || ""} speed={30} onTyping={onTyping} />
                ) : (
                renderMarkdown(message.answer || "")
                )}
            </div>
        </div>
    );
};
