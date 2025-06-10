import React from "react";
import { type ChatMessageResponse } from "@/types/chat";
import { TypingText } from "@/components/TypingText";

interface Props {
    message: ChatMessageResponse;
    isUser: boolean;
    isLatest?: boolean;
    onTyping?: () => void;
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
                    message.answer
                )}
            </div>
        </div>
    );
};
