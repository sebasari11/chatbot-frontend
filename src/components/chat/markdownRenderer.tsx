import React from 'react';

/**
 * Renders basic markdown formatting:
 * - **bold** text
 * - Bullet points (* at start of line)
 */
export function renderMarkdown(text: string): React.ReactNode {
    if (!text || text.trim().length === 0) return null;

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let isInList = false;

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                React.createElement(
                    'ul',
                    { 
                        key: `list-${elements.length}`, 
                        className: 'my-1 ml-4 space-y-1 list-disc'
                    },
                    listItems.map((item, idx) =>
                        React.createElement('li', { key: idx, className: 'ml-2' }, renderInlineMarkdown(item))
                    )
                )
            );
            listItems = [];
            isInList = false;
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check for bullet list (* at start of line)
        const bulletMatch = line.match(/^\*\s+(.+)$/);
        if (bulletMatch) {
            if (!isInList) {
                flushList();
                isInList = true;
            }
            listItems.push(bulletMatch[1]);
            continue;
        }

        // Regular line
        flushList();
        
        if (line) {
            elements.push(
                React.createElement(
                    'div',
                    { key: `line-${i}`, className: 'my-1' },
                    renderInlineMarkdown(line)
                )
            );
        } else {
            // Empty line for spacing
            elements.push(React.createElement('div', { key: `empty-${i}`, className: 'h-2' }));
        }
    }

    flushList();

    return elements.length > 0 ? (
        <div className="markdown-content">{elements}</div>
    ) : null;
}

/**
 * Renders inline markdown (bold text with **)
 */
function renderInlineMarkdown(text: string): React.ReactNode {
    if (!text) return null;
    
    const parts: React.ReactNode[] = [];
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = boldRegex.exec(text)) !== null) {
        // Add text before the bold
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        
        // Add bold text
        parts.push(
            React.createElement('strong', { key: `bold-${key++}`, className: 'font-semibold' }, match[1])
        );
        
        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    // Return single element if no formatting, otherwise return array
    if (parts.length === 0) {
        return text;
    } else if (parts.length === 1 && typeof parts[0] === 'string') {
        return parts[0];
    }
    
    return parts;
}
