import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatSessionsByUserId, startChatSession } from '@/api/chat'

import type { ChatSessionResponse } from "@/types/chat";
import { useAuthContext } from "@/context/AuthContext";

export const Sidebar: React.FC = () => {
    const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const fetchSessions = async () => {
        try {
            const sessions = await getChatSessionsByUserId(user?.external_id);
            setSessions(sessions);
        } catch (error) {
            console.error("Error fetching sessions", error);
        }
    };

    const startNewSession = async () => {
        try {
            const response = await startChatSession();
            const newSession = response.data;
            navigate(`/chat/${newSession.external_id}`);
        } catch (error) {
            console.error("Error starting new session", error);
        }
    };


    useEffect(() => {
        console.log("Fetching sessions for user:", user?.external_id);

        if (user?.external_id) fetchSessions();
    }, [user?.external_id]);

    return (
        <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Tus sesiones</h2>
                <button
                    onClick={startNewSession}
                    className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    + Nueva sesión
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {sessions.map((session) => (
                    <div
                        key={session.external_id}
                        onClick={() => navigate(`/chat/${session.external_id}`)}
                        className="cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
                    >
                        Sesión del {new Date(session.created_at).toLocaleDateString()}
                    </div>
                ))}
            </div>
        </div>
    );
};