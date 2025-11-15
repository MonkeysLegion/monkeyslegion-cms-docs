import DOMPurify from "dompurify";
import { SafeString } from "./safe-string";

// Add explicit types for lexical nodes we care about
type LexicalTextNode = {
    type: "text";
    text?: string;
    format?: number;
    style?: string;
};

type LexicalNode = {
    type: string;
    children?: LexicalNode[];
    text?: string;
    format?: number;
    style?: string;
    highlightType?: string;
    language?: string;
    url?: string;
    href?: string;
    tag?: string;
    listType?: string;
    headerState?: number;
    colSpan?: number;
    rowSpan?: number;
    backgroundColor?: string;
};

type SerializedState = {
    root?: {
        children?: LexicalNode[];
    };
};

// Exported function with typed parameter and return type
export function lexicalToHtml(serializedState: SerializedState): string {
    function getFormatStyle(format?: number): string {
        let style = "";
        if (typeof format !== "number") return style;
        // Lexical uses bit flags for format
        // use explicit comparisons instead of truthy checks
        if ((format & 1) !== 0) style += "font-weight:bold;";
        if ((format & 2) !== 0) style += "font-style:italic;";
        if ((format & 4) !== 0) style += "text-decoration:underline;";
        if ((format & 8) !== 0) style += "text-decoration:line-through;";
        return style;
    }

    function mergeStyles(style1?: string, style2?: string): string {
        // Merge two style strings, style2 takes precedence
        const styleObj: Record<string, string> = {};
        for (const s of (SafeString(style1, "")).split(";")) {
            const [kRaw, vRaw] = s.split(":");
            const k = kRaw?.trim();
            const v = vRaw?.trim();
            if (typeof k === "string" && k.length > 0 && typeof v === "string" && v.length > 0) {
                styleObj[k] = v;
            }
        }
        for (const s of (SafeString(style2, "")).split(";")) {
            const [kRaw, vRaw] = s.split(":");
            const k = kRaw?.trim();
            const v = vRaw?.trim();
            if (typeof k === "string" && k.length > 0 && typeof v === "string" && v.length > 0) {
                styleObj[k] = v;
            }
        }
        return Object.entries(styleObj).map(([k, v]) => `${k}:${v}`).join(";");
    }

    function renderTextNode(textNode: LexicalTextNode): string {
        const formatStyle = getFormatStyle(textNode.format);
        const style = mergeStyles(formatStyle, SafeString(textNode.style, ""));
        let text = SafeString(textNode.text, "");
        // Escape HTML special chars
        text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        if (typeof style === "string" && style.length > 0) {
            return `<span style="${style}">${text}</span>`;
        } else {
            return text;
        }
    }

    function parseChildren(children: LexicalNode[] | undefined): string {
        let html = "";
        if (!Array.isArray(children) || children.length === 0) return html;

        for (const node of children) {
            if (node == null || typeof node.type !== "string") continue;

            if (node.type === "text") {
                // safe cast because we checked the type
                html += renderTextNode(node as LexicalTextNode);
            } else if (node.type === "code-highlight") {
                let text = typeof node.text === "string" ? node.text : "";
                const highlightType = typeof node.highlightType === "string" && node.highlightType.length ? node.highlightType : undefined;
                // Escape HTML special chars in the text
                text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
                if (highlightType != null) {
                    html += `<span class="token ${highlightType}">${text}</span>`;
                } else {
                    html += text;
                }
            } else if (node.type === "linebreak") {
                html += "\n";
            } else if (node.type === "code") {
                let content = "";
                if (Array.isArray(node.children) && node.children.length > 0) {
                    content = parseChildren(node.children);
                } else if (typeof node.text === "string" && node.text.length > 0) {
                    content = node.text
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#x27;");
                } else {
                    content = "";
                }

                const language = typeof node.language === "string" && node.language.length ? node.language : "";
                const languageClass = language ? ` class="language-${language}"` : "";
                html += `<pre class="editor-code-block"><code${languageClass}>${content}</code></pre>`;
            } else if (node.type === "autolink" || node.type === "link") {
                const content = Array.isArray(node.children) && node.children.length > 0 ? parseChildren(node.children) : "";
                const urlCandidate = (typeof node.url === "string" && node.url.length)
                    ? node.url
                    : (typeof node.href === "string" && node.href.length ? node.href : content || "#");
                const url = String(urlCandidate);
                const attrs = ` href="${url}" target="_blank" rel="noopener noreferrer" `;
                html += `<a ${attrs}>${content}</a>`;
            } else if (node.type === "listitem") {
                const itemContent = Array.isArray(node.children) ? parseChildren(node.children) : "";
                html += `<li>${itemContent}</li>`;
            } else if (node.type === "list") {
                const listTag = (typeof node.tag === "string" && node.tag.length) ? node.tag : (node.listType === "number" ? "ol" : "ul");
                const listContent = Array.isArray(node.children) ? parseChildren(node.children) : "";
                html += `<${listTag}>${listContent}</${listTag}>`;
            } else if (node.type === "heading") {
                const content = Array.isArray(node.children) ? parseChildren(node.children) : "";
                const tag = (typeof node.tag === "string" && node.tag.length) ? node.tag : "h3";
                html += `<${tag}>${content}</${tag}>`;
            } else if (node.type === "quote") {
                const content = Array.isArray(node.children) ? parseChildren(node.children) : "";
                html += `<blockquote>${content}</blockquote>`;
            } else if (node.type === "paragraph") {
                const content = Array.isArray(node.children) ? parseChildren(node.children) : "";
                if (typeof content === "string" && content.trim().length > 0) {
                    html += `<p>${content}</p>`;
                } else {
                    html += '<br>';
                }
            } else if (node.type === "table") {
                const tableContent = Array.isArray(node.children) ? parseChildren(node.children) : "";
                html += `<table class="editor-table">${tableContent}</table>`;
            } else if (node.type === "tablerow") {
                const rowContent = Array.isArray(node.children) ? parseChildren(node.children) : "";
                html += `<tr>${rowContent}</tr>`;
            } else if (node.type === "tablecell") {
                const cellContent = Array.isArray(node.children) ? parseChildren(node.children) : "";
                const tag = node.headerState === 1 ? "th" : "td";
                let attrs = "";
                if (typeof node.colSpan === "number" && node.colSpan > 1) {
                    attrs += ` colspan="${node.colSpan}"`;
                }
                if (typeof node.rowSpan === "number" && node.rowSpan > 1) {
                    attrs += ` rowspan="${node.rowSpan}"`;
                }
                if (typeof node.backgroundColor === "string" && node.backgroundColor.length > 0) {
                    attrs += ` style="background-color:${node.backgroundColor}"`;
                }
                html += `<${tag}${attrs}>${cellContent}</${tag}>`;
            }
        }
        return html;
    }

    // Defensive check for root and children
    const state = serializedState as SerializedState;
    if (
        state == null ||
        typeof state !== "object" ||
        state.root === undefined ||
        !Array.isArray(state.root?.children)
    ) {
        return "";
    }

    const children = state.root?.children as LexicalNode[] | undefined;
    const parsed = parseChildren(children);
    // Sanitize output before returning
    return DOMPurify.sanitize(parsed);
}