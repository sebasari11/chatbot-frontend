import React, { useEffect, useState, useRef } from "react";
import type { ChatMessageResponse, ChatSessionResponse } from "@/types/chat";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { startChatSession, sendMessage, getSessionMessages } from "@/api/chat";
import { Spinner } from "@/components/Spinner";
import { Sidebar } from "@/components/Sidebar";
export const ChatPage: React.FC = () => {
    const [session, setSession] = useState<ChatSessionResponse | null>(null);
    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        async function initChat() {
            try {
                setLoading(true);
                const newSession = await startChatSession();
                setSession(newSession);

                const msgs = await getSessionMessages(newSession.external_id);
                setMessages(msgs);
            } catch (e) {
                console.error("Error al iniciar chat:", e);
                setError("Error al iniciar chat");
            } finally {
                setLoading(false);
            }
        }

        initChat();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!question.trim() || !session) return;

        setLoading(true);
        setError(null);

        try {
            // Optimista: agregamos la pregunta de usuario de inmediato
            const userMessage: ChatMessageResponse = {
                id: Math.random(), // temporal, solo para key
                timestamp: new Date(),
                question,
                answer: undefined,
                chat_session_id: session.external_id,
            };
            setMessages((prev) => [...prev, userMessage]);
            setQuestion("");

            // Llamamos al backend para obtener respuesta
            const response = await sendMessage({
                chat_session_id: session.external_id,
                question,
            });

            // Actualizamos el mensaje con la respuesta (remplazando el temporal)
            setMessages((prev) =>
                prev
                    .filter((m) => m.id !== userMessage.id)
                    .concat(response)
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            );
        } catch {
            setError("Error al enviar mensaje");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Chat Content */}
            <div className="flex flex-col max-w-3xl mx-auto h-screen p-4 bg-white dark:bg-gray-900">
                <h1 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Chat de Salud Mental</h1>

                <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    {loading && <p className="text-center text-gray-500">Cargando...</p>}

                    {error && (
                        <p className="text-red-600 dark:text-red-400 mb-2 text-center">{error}</p>
                    )}

                    <div className="flex flex-col space-y-2">
                        {messages.map((msg) => (
                            <React.Fragment key={msg.id}>
                                <ChatMessageBubble message={msg} isUser={true} />
                                {msg.answer && <ChatMessageBubble message={msg} isUser={false} />}
                            </React.Fragment>
                        ))}
                        <div ref={messagesEndRef} />
                        {loading && <Spinner />}
                    </div>
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
    );
};