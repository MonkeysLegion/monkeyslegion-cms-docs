/* eslint-env browser */
import DOMPurify from "dompurify";
import { decodeHtmlEntities } from './html-utils';

interface LexicalTextNode {
    detail: number;
    format: number;
    mode: string;
    style: string;
    text: string;
    type: "text";
    version: number;
}

interface LexicalParagraphNode {
    children: LexicalTextNode[];
    direction: string;
    format: string;
    indent: number;
    type: "paragraph";
    version: number;
}

interface LexicalHeadingNode {
    children: LexicalTextNode[];
    direction: string;
    format: string;
    indent: number;
    type: "heading";
    tag: string;
    version: number;
}

interface LexicalCodeNode {
    children: LexicalTextNode[];
    direction: string;
    format: string;
    indent: number;
    type: "code";
    language?: string;
    version: number;
}

interface LexicalRoot {
    root: {
        children: Array<LexicalParagraphNode | LexicalHeadingNode | LexicalCodeNode | LexicalTextNode>;
        direction: string;
        format: string;
        indent: number;
        type: "root";
        version: number;
    };
}

export function htmlToLexical(html: string): LexicalRoot {
    const cleanHtml = DOMPurify.sanitize(html);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanHtml;

    // eslint-disable-next-line no-undef
    function parseNode(node: ChildNode): Array<LexicalTextNode | LexicalParagraphNode | LexicalHeadingNode | LexicalCodeNode> {
        const children: Array<LexicalTextNode | LexicalParagraphNode | LexicalHeadingNode | LexicalCodeNode> = [];

        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = typeof child.textContent === "string" ? child.textContent : '';
                if (text.trim()) {
                    children.push({
                        detail: 0,
                        format: 0,
                        mode: "normal",
                        style: "",
                        text: decodeHtmlEntities(text),
                        type: "text",
                        version: 1,
                    });
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = (child as HTMLElement).tagName.toLowerCase();

                switch (tagName) {
                    case 'p': {
                        const paragraphChildren = parseNode(child);
                        children.push({
                            children: paragraphChildren.length > 0 ? paragraphChildren as LexicalTextNode[] : [{
                                detail: 0,
                                format: 0,
                                mode: "normal",
                                style: "",
                                text: "",
                                type: "text",
                                version: 1,
                            }],
                            direction: "ltr",
                            format: "",
                            indent: 0,
                            type: "paragraph",
                            version: 1,
                        });
                        break;
                    }
                    case 'strong':
                    case 'b': {
                        const boldChildren = parseNode(child);
                        boldChildren.forEach(n => {
                            if (n.type === 'text') n.format = 1;
                        });
                        children.push(...boldChildren);
                        break;
                    }
                    case 'em':
                    case 'i': {
                        const italicChildren = parseNode(child);
                        italicChildren.forEach(n => {
                            if (n.type === 'text') n.format = 2;
                        });
                        children.push(...italicChildren);
                        break;
                    }
                    case 'u': {
                        const underlineChildren = parseNode(child);
                        underlineChildren.forEach(n => {
                            if (n.type === 'text') n.format = 4;
                        });
                        children.push(...underlineChildren);
                        break;
                    }
                    case 'pre': {
                        const codeElement = (child as HTMLElement).querySelector('code');
                        let codeText = '';
                        let language = '';

                        if (codeElement) {
                            codeText = codeElement.innerHTML
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&quot;/g, '"')
                                .replace(/&#x27;/g, "'")
                                .replace(/&amp;/g, '&');

                            const classMatch = codeElement.className.match(/language-(\w+)/) ?? ["", ""];
                            language = typeof classMatch[1] === "string" ? classMatch[1] : '';
                        } else {
                            codeText = typeof child.textContent === "string" ? child.textContent : '';
                        }

                        const codeNode: LexicalCodeNode = {
                            children: [{
                                detail: 0,
                                format: 0,
                                mode: "normal",
                                style: "",
                                text: codeText,
                                type: "text",
                                version: 1,
                            }],
                            direction: "ltr",
                            format: "",
                            indent: 0,
                            type: "code",
                            version: 1,
                        };

                        if (language) {
                            codeNode.language = language;
                        }

                        children.push(codeNode);
                        break;
                    }
                    case 'code': {
                        if ((child as HTMLElement).parentElement?.tagName.toLowerCase() !== 'pre') {
                            const codeText = decodeHtmlEntities(typeof child.textContent === "string" ? child.textContent : '');
                            children.push({
                                detail: 0,
                                format: 0,
                                mode: "normal",
                                style: "background-color: rgb(243, 244, 246); padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace;",
                                text: codeText,
                                type: "text",
                                version: 1,
                            });
                        }
                        break;
                    }
                    case 'br': {
                        children.push({
                            detail: 0,
                            format: 0,
                            mode: "normal",
                            style: "",
                            text: "\n",
                            type: "text",
                            version: 1,
                        });
                        break;
                    }
                    default: {
                        const nodeChildren = parseNode(child);
                        children.push(...nodeChildren);
                    }
                }
            }
        });

        return children;
    }

    const children = parseNode(tempDiv);

    if (!children.length) {
        children.push({
            children: [],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
        });
    }

    return {
        root: {
            children,
            direction: "ltr",
            format: "",
            indent: 0,
            type: "root",
            version: 1,
        },
    };
}
