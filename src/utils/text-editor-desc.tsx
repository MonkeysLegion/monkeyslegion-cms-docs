import { lexicalToHtml } from './lexical-to-html';
import React, { useRef } from 'react';
import { SerializedEditorState } from "lexical";

// Add types
type ParsedLexical = unknown;
type ContentInput = string | null | undefined;
type EditorNode = {
    type?: string;
    text?: string;
    children?: EditorNode[];
    // Avoid DOM-specific NodeListOf typing in environments without DOM libs.
    childNodes?: unknown[];
}

// Convert lexical parsed content to HTML and wrap links
const lexicalToHtmlWithLinks = (parsedContent: ParsedLexical): string => {
    let html = lexicalToHtml(parsedContent as SerializedEditorState);
    // Fallback: If the output still contains autolink/link nodes as plain text, patch them
    // (This is a simple post-process for missed links)
    // If lexicalToHtml already supports them, this will have no effect
    // Try to find URLs and wrap them in <a> tags
    html = html.replace(/(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)(?![^<]*>)/g, (url: string) => {
        // Avoid double-wrapping if already inside an <a>
        if (/<a [^>]*?>.*$/.test(url)) return url;
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
    return html;
};

const TextEditorDesc: React.FC<{ content?: ContentInput }> = ({ content }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    // explicit check for null/undefined/empty
    if (content === null || content === undefined || content === '') return null;

    const isLexicalJSON = (value: ContentInput): boolean => {
        if (typeof value !== 'string') return false;
        try {
            const parsed = JSON.parse(value) as { root?: { type?: string } };
            return parsed !== null && parsed.root !== undefined && parsed.root.type === "root";
        } catch {
            return false;
        }
    };

    const isHTML = (value: ContentInput): boolean => {
        return typeof value === 'string' && value.includes('<') && value.includes('>');
    };

    // Enhanced HTML processing with proper code formatting preservation
    const processCodeBlocks = (html: string): string => {
        return html.replace(
            /<pre class="editor-code-block"><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g,
            (match: string, attrs: string, code: string): string => {
                const languageMatch = attrs.match(/class="language-(\w+)"/);
                const language = languageMatch?.[1] ?? 'plaintext';

                // Don't decode if the code already contains syntax highlighting spans
                let processedCode = code;
                if (!code.includes('<span class="token')) {
                    processedCode = code
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#x27;/g, "'");
                }

                return `
                    <div class="code-block-wrapper" data-language="${language}">
                        <div class="code-block-header">
                            <span class="code-language">${language}</span>
                        </div>
                        <pre class="language-${language}"><code class="language-${language}">${processedCode}</code></pre>
                    </div>
                `;
            }
        );
    };

    let htmlContent = '';

    try {
        if (isLexicalJSON(content)) {
            // Convert Lexical JSON to HTML
            const parsedContent: ParsedLexical = JSON.parse(content as string);
            htmlContent = lexicalToHtmlWithLinks(parsedContent);
        } else if (isHTML(content)) {
            // Already HTML, use as is
            htmlContent = content as string;
        } else {
            // Plain text, wrap in paragraph
            htmlContent = `<p>${content}</p>`;
        }

        // Process code blocks for enhanced styling
        htmlContent = processCodeBlocks(htmlContent);

        // Remove trailing <br> tags from the final HTML content (only at the end)
        htmlContent = htmlContent.replace(/(<br\s*\/?>)+$/gi, '').trim();
    } catch (error) {
        console.error('Error processing content:', error);
        // Fallback to plain text
        htmlContent = `<p>${content}</p>`;
    }

    return (
        <div
            ref={containerRef}
            className="prose prose-sm max-w-none text-editor-content editor-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};

// New function to extract plain text from editor content
export const extractTextFromContent = (content?: ContentInput): string => {
    if (content === null || content === undefined || content === '') return '';

    const isLexicalJSON = (value?: ContentInput): boolean => {
        if (typeof value !== 'string') return false;
        try {
            const parsed = JSON.parse(value) as { root?: { type?: string } };
            return parsed !== null && parsed.root !== undefined && parsed.root.type === "root";
        } catch {
            return false;
        }
    };

    const isHTML = (value?: ContentInput): boolean => {
        return typeof value === 'string' && value.includes('<') && value.includes('>');
    };

    try {
        if (isLexicalJSON(content)) {
            // Extract text from Lexical JSON
            const parsedContent = JSON.parse(content as string) as { root?: EditorNode | { children?: EditorNode[] } };
            const rootNode = parsedContent.root ?? null;
            const extractTextFromNode = (node: EditorNode | null): string => {
                if (node === null) return '';

                if (node.type === 'text') {
                    return node.text ?? '';
                }

                if (node.children !== undefined && Array.isArray(node.children)) {
                    return node.children.map((child) => extractTextFromNode(child)).join(' ');
                }

                return '';
            };

            return extractTextFromNode(rootNode).trim();
        } else if (isHTML(content)) {
            // Strip HTML tags
            return (content as string).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        } else {
            // Already plain text
            return (content as string).trim();
        }
    } catch (error) {
        console.error('Error extracting text from content:', error);
        return typeof content === 'string' ? content.trim() : '';
    }
};

export default TextEditorDesc;