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
    if (!text || text.length === 0) return 1;
    
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

    const minSpeed = 1;   // Máxima velocidad
    const maxSpeed = 3;   // Muy rápido incluso para textos cortos

    const logFactor = Math.min(Math.log10(Math.max(wordCount, 1)) / Math.log10(200), 1);
    
    const baseSpeed = maxSpeed - (logFactor * (maxSpeed - minSpeed));
    
    if (wordCount > 200) {
        return minSpeed;
    }
    
    if (wordCount > 100) {
        return Math.max(minSpeed, Math.min(2, Math.round(baseSpeed)));
    }
    
    return Math.max(minSpeed, Math.min(maxSpeed, Math.round(baseSpeed)));
}

export const ChatMessageBubble: React.FC<Props> = ({ message, isUser, isLatest, onTyping }) => {
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-2xl p-3 my-1 text-sm shadow-md whitespace-pre-line
          ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"}`}
            >
                {isUser ? message.question : isLatest ? (
                    <TypingText 
                        text={message.answer || ""} 
                        speed={calculateTypingSpeed(message.answer || "")} 
                        onTyping={onTyping} 
                    />
                ) : (
                renderMarkdown(message.answer || "")
                )}
            </div>
        </div>
    );
};
