import React, { useEffect, useState } from "react";

interface TypingTextProps {
    text: string;
    speed?: number;
    onTyping?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({ text, speed = 30, onTyping }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text[index]);
            if (onTyping) onTyping();
            index++;
            if (index >= text.length - 1) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onTyping]);

    return <span>{displayedText}</span>;
};