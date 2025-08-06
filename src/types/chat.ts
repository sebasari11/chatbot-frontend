export interface ChatMessageResponse {
    id: number;
    timestamp: Date;
    question: string;
    chat_session_id: string;
    answer?: string;
};

export interface ChatSessionResponse {
    external_id: string;
    created_at: Date;
    session_name: string | null;
    messages: [ChatMessageResponse];
};