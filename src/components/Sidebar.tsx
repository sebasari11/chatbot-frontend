import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import {
    getChatSessionsByCurrentUser,
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

export const Sidebar: React.FC = () => {
    const { user } = useAuthContext();
    const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);
    const { session_external_id } = useParams<{ session_external_id: string }>();
    const [selectedSession, setSelectedSession] = useState<ChatSessionResponse | null>(null);
    const navigate = useNavigate();

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
                        className={`group flex items-center justify-between gap-2 p-2 rounded text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${session.external_id === session_external_id ? "bg-blue-100 dark:bg-blue-700 pointer-events-none" : ""
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
                <Link to="/resources" className="text-blue-500 hover:underline dark:text-blue-400 mt-4 block">
                    Recursos
                </Link>
            </div>
        </div>
    );
};