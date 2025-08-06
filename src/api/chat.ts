// src/api/chat.ts
import API from "./auth";
import type { ChatMessageResponse, ChatSessionResponse } from "@/types/chat";

export async function startChatSession() {
    const response = await API.post("/chat/sessions/start");
    return response.data;
}

export async function sendMessage({
    chat_session_id,
    question,
    model = "gemini",
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

export async function getSessionMessages(chat_session_id: string): Promise<ChatMessageResponse[]> {
    const response = await API.get(`/chat/sessions/${chat_session_id}/messages`);
    return response.data;
}

export async function getChatSessionsByCurrentUser(userId: string | undefined) {
    if (!userId) throw new Error("User ID is required");
    const response = await API.get(`/users/me/chat_sessions/`);
    return response.data;
}

export async function generate_chat_session_name(externalId: string): Promise<ChatSessionResponse> {
    const response = await API.put(`/chat/sessions/${externalId}/name`);
    return response.data;
}
export const deleteChatSession = (chat_session_id: string) => API.delete(`/chat/sessions/${chat_session_id}`);