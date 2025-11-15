import { FileText, ImageIcon, SheetIcon } from "lucide-react";
import { JSX } from "react";

// Download a file from a given URL with a specified name
const downloadFile = (fileUrl: string, fileName: string): void => {
    if (typeof window === "undefined") return;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Get MIME type from file extension
const getMimeType = (ext: string): string => {
    const mimeTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'txt': 'text/plain',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp'
    };
    return typeof mimeTypes[ext] === "string" ? mimeTypes[ext] : 'application/octet-stream';
};

// Get file type (image, document, spreadsheet, file) from file name
const getFileType = (fileName: string): 'image' | 'document' | 'spreadsheet' | 'file' => {
    let tempExt = fileName.split('.').pop()?.toLowerCase();
    const extension = typeof tempExt === "string" ? tempExt : '';
    const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    const documentTypes = ['pdf', 'doc', 'docx'];
    const spreadsheetTypes = ['xls', 'xlsx', 'csv'];
    if (imageTypes.includes(extension)) return 'image';
    if (documentTypes.includes(extension)) return 'document';
    if (spreadsheetTypes.includes(extension)) return 'spreadsheet';
    return 'file';
};

/**
 * Returns the appropriate icon component for a file type.
 * Pass icon components as arguments to keep this utility UI-agnostic.
 * Example usage:
 *   getFileIcon(fileName, { ImageIcon, FileText })
 */
const getFileIcon = (
    fileName: string,
): JSX.Element => {
    const fileType = getFileType(fileName);
    switch (fileType) {
        case 'image':
            return <ImageIcon className="w-8 h-8 text-blue-500" />;
        case 'document':
            return <FileText className="w-8 h-8 text-red-500" />;
        case 'spreadsheet':
            return <SheetIcon className="w-8 h-8 text-green-500" />;
        default:
            return <FileText className="w-8 h-8 text-gray-500" />;
    }
};

export { downloadFile, getMimeType, getFileType, getFileIcon };

