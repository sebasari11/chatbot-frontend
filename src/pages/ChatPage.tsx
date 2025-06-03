import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { ChatMessageResponse } from "@/types/chat";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { getSessionMessages, sendMessage } from "@/api/chat";
import { Spinner } from "@/components/Spinner";
import { Sidebar } from "@/components/Sidebar";

export const ChatPage: React.FC = () => {
    const { session_external_id } = useParams();
    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [question, setQuestion] = useState("");
    const [latestAnswerId, setLatestAnswerId] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setError(null);
        setLatestAnswerId(null);
        setLoading(true);
        if (session_external_id) {
            async function fetchMessages() {
                try {
                    const messages = await getSessionMessages(session_external_id as string);
                    setMessages(messages);
                    console.log("Error state:", error);
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    setError("Error cargando messages");
                }
            };
            fetchMessages();
        } else {
            console.error("No session ID provided");
            setError("No se proporcionó ID de sesión");
        }
        setLoading(false);
    }, [error, session_external_id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!question.trim()) return;
        setLoading(true);
        try {
            const userMessage: ChatMessageResponse = {
                id: Math.random(), // temporal, solo para key
                timestamp: new Date(),
                question,
                answer: undefined,
                chat_session_id: session_external_id as string,
            };
            setMessages((prev) => [...prev, userMessage]);
            setQuestion("");
            const response = await sendMessage({
                chat_session_id: session_external_id as string,
                question,
            });
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

    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />
            {/* Chat Content */}
            <div className="flex flex-col max-w-3xl mx-auto h-screen p-4 bg-white dark:bg-gray-900">
                <h1 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Chat de Salud Mental</h1>
                <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    {error && (
                        <p className="text-red-600 dark:text-red-400 mb-2 text-center">{error}</p>
                    )}
                    {messages.map((msg) => {
                        return (
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
                        );
                    })}
                    <div ref={messagesEndRef} />
                    {loading && <Spinner />}
                </div>

                <div className="mt-4 flex space-x-2">
                    <input
                        type="text"
                        className="flex-1 rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
                        placeholder="Escribe tu mensaje..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !question.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-4 rounded-md"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    )
};