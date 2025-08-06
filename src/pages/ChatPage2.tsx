import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import ChatWelcome from "@/components/chat/ChatWelcome";
import { getChatSessionsByCurrentUser } from "@/api/chat";
import { useAuthContext } from "@/context/AuthContext";
import type { ChatSessionResponse } from "@/types/chat";
import UserMenu from "@/components/home/UserMenu";

export const ChatPage: React.FC = () => {
    const { user, loading } = useAuthContext();
    const { session_external_id } = useParams();
    const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);

    const fetchSessions = useCallback(async () => {
        if (!user?.external_id) return;
        try {
            const sessions = await getChatSessionsByCurrentUser(user.external_id);
            setSessions(sessions);
        } catch (error) {
            console.error("Error fetching sessions", error);
        }
    }, [user?.external_id]);

    useEffect(() => {
        if (!loading && user?.external_id) {
            fetchSessions();
        }
    }, [loading, user?.external_id, fetchSessions]);

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900">
            <Sidebar sessions={sessions} fetchSessions={fetchSessions} />

            <div className="flex-1 flex flex-col">
                <div className="flex justify-end items-center p-4 bg-white dark:bg-gray-900">
                    <UserMenu />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {!session_external_id ? (
                        <ChatWelcome onSessionCreated={fetchSessions} />
                    ) : (
                        <ChatWindow sessionId={session_external_id} />
                    )}
                </div>
            </div>
        </div>
    );
};