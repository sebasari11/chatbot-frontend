// src/api/chat.ts
import API from "./auth";
import type { ChatMessageResponse } from "@/types/chat";

export async function startChatSession() {
    const response = await API.post("/chat/sessions/start");



    return response.data;
}

export async function sendMessage({
    chat_session_id,
    question,
    model = "gemma3:latest",
}: {
    chat_session_id: string;
    question: string;
    model?: string;
}): Promise<ChatMessageResponse> {
    const response = await API.post("/chat/sessions/send_message", {
        chat_session_id,
        question,
        model,
    });
    return response.data;
}

export async function getSessionMessages(chat_session_id: string) {
    const response = await API.get(`/chat/sessions/${chat_session_id}/messages`);
    return response.data;
}

export async function getChatSessionsByUserId(userId: string | undefined) {
    if (!userId) throw new Error("User ID is required");
    const response = await API.get(`/users/${userId}/chat_sessions`);
    return response.data;
}
