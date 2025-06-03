import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { getChatSessionsByCurrentUser, startChatSession, generate_chat_session_name } from '@/api/chat'
import type { ChatSessionResponse } from "@/types/chat";
import { useAuthContext } from "@/context/AuthContext";

export const Sidebar: React.FC = () => {
    const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { session_external_id } = useParams<{ session_external_id: string }>();

    const fetchSessions = React.useCallback(async () => {
        try {
            const sessions = await getChatSessionsByCurrentUser(user?.id);
            setSessions(sessions);
        } catch (error) {
            console.error("Error fetching sessions", error);
        }
    }, [user?.id]);

    const startNewSession = async () => {
        try {
            const response = await startChatSession();
            const newSession = response.data;
            fetchSessions(); // Refresh the session list
            navigate(`/chat/${newSession.external_id}`);
        } catch (error) {
            console.error("Error starting new session", error);
        }
    };

    const handleSessionClick = async (newExternalId: string) => {
        try {
            const actualSessionName: string | null = sessions.find(session => session.external_id === session_external_id)?.session_name || null;
            console.log("Actual session name", actualSessionName);
            if (session_external_id && session_external_id !== newExternalId && (!actualSessionName || actualSessionName === "Nuevo Chat")) {

                console.log('Updating session name for previous session:', session_external_id);

                await generate_chat_session_name(session_external_id);
            }

            navigate(`/chat/${newExternalId}`);

            await fetchSessions();
        } catch (error) {
            console.error("Error al actualizar el nombre de la sesión anterior", error);
        }
    };


    useEffect(() => {
        if (user?.id) fetchSessions();
    }, [user?.id, fetchSessions]);

    return (
        <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Tus chats</h2>
                <button
                    onClick={startNewSession}
                    className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/50 p-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    <Plus size={16} strokeWidth={1.5} />
                    Nuevo chat
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {sessions.map((session) => (
                    <div
                        key={session.external_id}
                        onClick={() => handleSessionClick(session.external_id)}
                        className={`cursor-pointer p-2 rounded text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${session.external_id === session_external_id ? "bg-blue-100 dark:bg-blue-700 pointer-events-none" : ""
                            }`}
                    >
                        {session.session_name || `Chat del ${new Date(session.created_at).toLocaleDateString()}`}
                    </div>
                ))}
            </div>
        </div>
    );
};