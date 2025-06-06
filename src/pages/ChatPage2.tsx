import React from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import ChatWelcome from "@/components/chat/ChatWelcome";

export const ChatPage: React.FC = () => {
    const { session_external_id } = useParams();

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1">
                {!session_external_id ? (
                    <>
                        <ChatWelcome />
                    </>
                ) : (
                    <ChatWindow sessionId={session_external_id} />
                )}
            </div>
        </div>
    );
};