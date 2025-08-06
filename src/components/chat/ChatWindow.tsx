import React, { useEffect, useRef, useState } from "react";
import { getSessionMessages, sendMessage } from "@/api/chat";
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble";
import { Spinner } from "@/components/Spinner";
import { ChatInput } from "@/components/chat/ChatInput"; // lo haremos en el siguiente paso
import type { ChatMessageResponse } from "@/types/chat";

interface ChatWindowProps {
    sessionId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ sessionId }) => {
    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [latestAnswerId, setLatestAnswerId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setError(null);
        setLatestAnswerId(null);
        let timeoutId: NodeJS.Timeout;

        async function fetchMessages() {
            setLoading(true);
            try {
                const msgs = await getSessionMessages(sessionId);
                timeoutId = setTimeout(() => {
                    setMessages(msgs);
                    setLoading(false);
                }, 400);
            } catch (err) {
                console.error("Error al cargar mensajes", err);
                setError("Error cargando mensajes");
                setLoading(false);
            }
        }

        if (sessionId) {
            fetchMessages();
        }

        return () => {
            clearTimeout(timeoutId); // <-- limpiar correctamente en desmontaje
        };
    }, [sessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!question.trim()) return;

        const userMessage: ChatMessageResponse = {
            id: Math.random(),
            timestamp: new Date(),
            question,
            answer: undefined,
            chat_session_id: sessionId,
        };

        setMessages((prev) => [...prev, userMessage]);
        setQuestion("");
        setLoading(true);

        try {
            const response = await sendMessage({ chat_session_id: sessionId, question });
            setMessages((prev) =>
                prev
                    .filter((m) => m.id !== userMessage.id)
                    .concat(response)
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            );
            setLatestAnswerId(response.id);
        } catch {
            setError("Error al enviar mensaje");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col max-w-3xl mx-auto h-full p-4 w-full bg-white dark:bg-gray-900">
            <div className="flex-1 overflow-y-auto space-y-2">
                {error && (
                    <p className="text-red-600 dark:text-red-400 mb-2 text-center">{error}</p>
                )}
                {messages.map((msg) => (
                    <React.Fragment key={msg.id}>
                        {msg.question && <ChatMessageBubble message={msg} isUser={true} />}
                        {msg.answer && (
                            <ChatMessageBubble
                                message={msg}
                                isUser={false}
                                isLatest={msg.id === latestAnswerId}
                                onTyping={scrollToBottom}
                            />
                        )}
                    </React.Fragment>
                ))}
                <div ref={messagesEndRef} />
                {loading && <Spinner />}
            </div>

            <div className="mt-4">
                <ChatInput
                    value={question}
                    onChange={setQuestion}
                    onSend={handleSend}
                    loading={loading}
                />
            </div>
        </div>
    );
};