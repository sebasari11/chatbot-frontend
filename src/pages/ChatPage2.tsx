import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import ChatWelcome from "@/components/chat/ChatWelcome";
import { getChatSessionsByCurrentUser } from "@/api/chat";
import { useAuthContext } from "@/context/AuthContext";
import type { ChatSessionResponse } from "@/types/chat";

export const ChatPage: React.FC = () => {
    const { session_external_id } = useParams();
    const { user } = useAuthContext();
    const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);

    const fetchSessions = useCallback(async () => {
        if (!user?.id) return;
        try {
            const sessions = await getChatSessionsByCurrentUser(user.id);
            setSessions(sessions);
        } catch (error) {
            console.error("Error fetching sessions", error);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    return (
        <div className="flex h-screen">
            <Sidebar sessions={sessions} fetchSessions={fetchSessions} />
            <div className="flex-1">
                {!session_external_id ? (
                    <>
                        <ChatWelcome onSessionCreated={fetchSessions} />
                    </>
                ) : (
                    <ChatWindow sessionId={session_external_id} />
                )}
            </div>
        </div>
    );
};