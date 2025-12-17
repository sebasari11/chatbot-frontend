import React from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { renderMarkdown } from './markdownRenderer';

interface TypingTextProps {
    text: string;
    speed?: number;
    onTyping?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = ({ text, speed = 30, onTyping }) => {
    const [typedText, { isDone }] = useTypewriter({
        words: [text],
        loop: 1,
        typeSpeed: speed,
        deleteSpeed: 0,
        delaySpeed: 1000,
        onType: onTyping,
    });

    return (
        <div className="inline-block">
            {renderMarkdown(typedText)}
            {!isDone && <Cursor cursorStyle="|" />}
        </div>
    );
};