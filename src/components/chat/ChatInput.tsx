type ChatInputProps = {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    loading: boolean;
};

export const ChatInput = ({ value, onChange, onSend, loading }: ChatInputProps) => (
    <div className="mt-4 flex space-x-2">
        <input
            type="text"
            className="flex-1 rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:text-white"
            placeholder="Escribe tu mensaje..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            disabled={loading}
        />
        <button
            onClick={onSend}
            disabled={loading || !value.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-4 rounded-md"
        >
            Enviar
        </button>
    </div>
);