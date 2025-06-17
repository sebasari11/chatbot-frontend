import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import {
    startChatSession,
    generate_chat_session_name,
    deleteChatSession
} from '@/api/chat'
import type { ChatSessionResponse } from "@/types/chat";
import { useAuthContext } from "@/context/AuthContext";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import HomeButton from "./home/HomeButton";

type SidebarProps = {
    sessions: ChatSessionResponse[];
    fetchSessions: () => Promise<void>;
};

export const Sidebar: React.FC<SidebarProps> = ({ sessions, fetchSessions }) => {
    const { user } = useAuthContext();
    const { session_external_id } = useParams<{ session_external_id: string }>();
    const [selectedSession, setSelectedSession] = useState<ChatSessionResponse | null>(null);
    const navigate = useNavigate();

    const startNewSession = async () => {
        try {
            const response = await startChatSession();
            const newSession = response.data;
            fetchSessions();
            navigate(`/chat/${newSession.external_id}`);
        } catch (error) {
            console.error("Error starting new session", error);
        }
    };

    const handleSessionClick = async (newExternalId: string) => {
        navigate(`/chat/${newExternalId}`);
        try {
            const actualSessionName: string | null = sessions.find(session => session.external_id === session_external_id)?.session_name || null;
            console.log("Actual session name", actualSessionName);
            if (session_external_id && session_external_id !== newExternalId && (!actualSessionName || actualSessionName === "Nuevo Chat")) {

                console.log('Updating session name for previous session:', session_external_id);

                await generate_chat_session_name(session_external_id);
            }
            await fetchSessions();
        } catch (error) {
            console.error("Error al actualizar el nombre de la sesión anterior", error);
        }
    };

    const handleDelete = async () => {
        if (selectedSession) {
            try {
                await deleteChatSession(selectedSession.external_id);
                setSelectedSession(null);
                await fetchSessions();
                if (session_external_id === selectedSession.external_id) {
                    navigate("/"); // Navega a raíz si se elimina la sesión actual
                }
            } catch (error) {
                console.error("Error deleting session", error);
            }
        }
    };

    useEffect(() => {
        if (user?.external_id) fetchSessions();
    }, [user?.external_id, fetchSessions]);

    return (
        <div className="w-64 h-screen bg-white dark:bg-[#1e1e20] border-r dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b dark:border-gray-700 flex flex-col gap-4">
                <div className="flex justify-center">
                    <HomeButton size={10} />
                </div>
                <button
                    onClick={startNewSession}
                    className="flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-[#2a2a2e] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    <Plus size={16} />
                    Nuevo chat
                </button>

                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">
                    Chats
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
                {sessions.map((session) => (
                    <div
                        key={session.external_id}
                        className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${session.external_id === session_external_id
                            ? "bg-blue-100 dark:bg-blue-700 pointer-events-none"
                            : ""
                            }`}
                    >
                        <span
                            onClick={() => handleSessionClick(session.external_id)}
                            className="flex-1 cursor-pointer truncate"
                        >
                            {session.session_name || `Chat del ${new Date(session.created_at).toLocaleDateString()}`}
                        </span>

                        <Dialog>
                            <DialogTrigger asChild>
                                <button
                                    onClick={() => setSelectedSession(session)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>¿Eliminar sesión?</DialogTitle>
                                </DialogHeader>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta sesión?
                                </p>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setSelectedSession(null)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="destructive" onClick={handleDelete}>
                                        Eliminar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                ))}
            </div>
        </div>
    );
};