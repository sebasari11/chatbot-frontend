import React from "react";
import type { ChatMessageResponse } from "@/types/chat";
import { ChatMessageBubble } from "./ChatMessageBubble";
type ChatMessageListProps = {
    messages: ChatMessageResponse[];
    latestAnswerId: number | null;
}

export const ChatMessageList = ({ messages, latestAnswerId }: ChatMessageListProps) => (
    <>
        {messages.map((msg) => (
            <React.Fragment key={msg.id}>
                {msg.question && <ChatMessageBubble message={msg} isUser={true} />}
                {msg.answer && (
                    <ChatMessageBubble
                        message={msg}
                        isUser={false}
                        isLatest={msg.id === latestAnswerId}
                    />
                )}
            </React.Fragment>
        ))}
    </>
);
