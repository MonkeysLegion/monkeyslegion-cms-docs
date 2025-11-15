/**
 * Decodes HTML entities in a string (browser or Node-safe)
 */
export const decodeHtmlEntities = (str: string) : string => {
    if (!str || typeof str !== 'string') return str;

    if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = str;
        return textarea.value;
    }

    // Fallback for Node: simple replacements for common entities
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
};
