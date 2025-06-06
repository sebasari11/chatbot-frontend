import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import logo from "@/assets/ucalma-logo.webp";
import { ChatInput } from "./ChatInput";
import { startChatSession, sendMessage } from "@/api/chat";

const ChatWelcome: React.FC = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSend = async () => {
        if (!question.trim()) return;
        setLoading(true);
        try {
            const response = await startChatSession();
            const session_external_id = response.external_id;
            await sendMessage({
                chat_session_id: session_external_id,
                question,
            });
            navigate(`/chat/${session_external_id}`);

        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Sparkles size={48} className="text-blue-400 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">¡Bienvenido!</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
                Estoy aquí para ayudarte. Puedes empezar una conversación seleccionando un chat o creando uno nuevo.
            </p>
            <img
                src={logo}
                alt="Bienvenida"
                className="mt-6 max-w-xs"
            />
            <div className="mt-8 w-full max-w-2xl">
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

export default ChatWelcome;