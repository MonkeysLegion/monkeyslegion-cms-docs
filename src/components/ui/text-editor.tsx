"use client"

import { useState, useEffect, JSX } from "react"
import { SerializedEditorState } from "lexical"
import { Editor } from "../blocks/editor-00/editor"
import { SafeString } from "@/utils/safe-string"

const createInitialValue = (text?: string): SerializedEditorState => {
    return {
        root: {
            children: [
                {
                    children: typeof text == "string"
                        ? [
                            {
                                detail: 0,
                                format: 0,
                                mode: "normal",
                                style: "",
                                text: text,
                                type: "text",
                                version: 1,
                            },
                        ]
                        : [],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    type: "paragraph",
                    version: 1,
                },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "root",
            version: 1,
        },
    } as unknown as SerializedEditorState
}

const htmlToLexical = (html: string): SerializedEditorState => {
    // Enhanced HTML to Lexical conversion that preserves code blocks
    try {
        // If the HTML contains code blocks, we need to handle them specially
        if (html.includes('<pre') || html.includes('<code')) {
            // Use the full HTML to Lexical conversion from our utils
            const { htmlToLexical: fullHtmlToLexical } = require('@/utils/html-to-lexical');
            return fullHtmlToLexical(html);
        }

        // For simple HTML, do basic conversion
        const textContent = html
            .replace(/<[^>]*>/g, ' ') // Remove all HTML tags
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();

        return createInitialValue(textContent);
    } catch (error) {
        console.log("Error has occured while converting html to lexical", error);
        // Fallback to text content
        const textContent = html
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return createInitialValue(textContent);
    }
}

const isLexicalJSON = (value: string): boolean => {
    try {
        const parsed = JSON.parse(value) as unknown;
        if (typeof parsed !== 'object' || parsed === null) return false;
        const p = parsed as Record<string, unknown>;
        const root = p.root;
        if (typeof root !== 'object' || root === null) return false;
        const rootObj = root as Record<string, unknown>;
        return typeof rootObj.type === 'string' && rootObj.type === "root";
    } catch {
        return false;
    }
}

const isHTML = (value: string): boolean => {
    return value.includes('<') && value.includes('>');
}

interface TextEditorProps {
    value?: string
    placeholder?: string
    onEditorChange?: (content: string) => void
    initialValue?: string
    className?: string
}

export default function TextEditor({
    value = "",
    placeholder = "Start typing...",
    onEditorChange = (): void => { },
    initialValue,
    className,
    ...props
}: TextEditorProps): JSX.Element {
    const [editorState, setEditorState] = useState<SerializedEditorState | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        // Only initialize once, prioritizing value over initialValue
        if (!isInitialized) {
            let stateToSet: SerializedEditorState;

            const valueToUse = value || initialValue;

            if (typeof valueToUse == "string") {
                try {
                    // Check if it's Lexical JSON format
                    if (isLexicalJSON(valueToUse)) {
                        const parsedValue = JSON.parse(valueToUse) as unknown;
                        // validated shape — assert as SerializedEditorState
                        stateToSet = parsedValue as SerializedEditorState;
                    }
                    // Check if it's HTML format
                    else if (isHTML(valueToUse)) {
                        stateToSet = htmlToLexical(valueToUse);
                    }
                    // Try to parse as JSON (for backward compatibility)
                    else {
                        try {
                            const parsedValue = JSON.parse(valueToUse) as unknown;
                            if (typeof parsedValue === 'object' && parsedValue !== null) {
                                const pv = parsedValue as Record<string, unknown>;
                                const root = pv.root;
                                if (typeof root === 'object' && root !== null && Object.hasOwn(root as Record<string, unknown>, 'type')) {
                                    stateToSet = parsedValue as SerializedEditorState;
                                } else {
                                    stateToSet = createInitialValue(valueToUse);
                                }
                            } else {
                                stateToSet = createInitialValue(valueToUse);
                            }
                        } catch {
                            // If not JSON, treat as plain text
                            stateToSet = createInitialValue(valueToUse);
                        }
                    }
                } catch (error) {
                    console.warn('Error parsing editor content, falling back to plain text:', error);
                    // If any parsing fails, treat as plain text
                    stateToSet = createInitialValue(valueToUse);
                }
            } else {
                stateToSet = createInitialValue();
            }

            setEditorState(stateToSet);
            setIsInitialized(true);
        }
    }, [value, initialValue, isInitialized])

    const handleEditorChange = (newState: SerializedEditorState): void => {
        setEditorState(newState)
        onEditorChange(JSON.stringify(newState))
    }

    // Don't render until we have an initial state
    if (!editorState) {
        return <div className={className}>Loading editor...</div>;
    }

    return (
        <div className={`${SafeString(className, '')}`}>
            <Editor
                editorSerializedState={editorState}
                onSerializedChange={handleEditorChange}
                placeholder={placeholder}
                {...props}
            />
            <style jsx>{`
                :global(.editor-paragraph) {
                    margin: 0 !important;
                    padding: 0 !important;
                    line-height: 1.4 !important;
                }
                :global(.editor-paragraph + .editor-paragraph) {
                    margin-top: 0.5em !important;
                }
                :global(.editor-text) {
                    line-height: 1.4 !important;
                }
                :global(.bg-background.overflow-hidden.rounded-lg.border.shadow) {
                    height: 100% !important;
                    display: flex !important;
                    flex-direction: column !important;
                }
                :global(.bg-background.overflow-hidden.rounded-lg.border.shadow .relative.w-full.h-full) {
                    flex: 1 !important;
                    display: flex !important;
                    flex-direction: column !important;
                }
                :global(.bg-background.overflow-hidden.rounded-lg.border.shadow .relative.flex-1.flex.flex-col.min-h-0) {
                    flex: 1 !important;
                }
                :global(.bg-background.overflow-hidden.rounded-lg.border.shadow .flex-1.flex.flex-col.min-h-0) {
                    flex: 1 !important;
                }
                :global(.bg-background.overflow-hidden.rounded-lg.border.shadow [contenteditable="true"]) {
                    flex: 1 !important;
                    min-height: 200px !important;
                }
            `}</style>
        </div>
    )
}