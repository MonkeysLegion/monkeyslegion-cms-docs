'use client';

import React, { useState } from 'react';
import { Plus, X, Link } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface UrlInputProps {
    urls?: string[];
    onUrlsChange: (urls: string[]) => void;
    className?: string;
    placeholder?: string;
    maxUrls?: number;
}

const UrlInput: React.FC<UrlInputProps> = ({
    urls = [],
    onUrlsChange,
    className,
    placeholder = "Enter URL...",
    maxUrls = 10,
}) => {
    const [currentUrl, setCurrentUrl] = useState<string>('');

    const addUrl = (): void => {
        const trimmedUrl = currentUrl.trim();

        if (
            trimmedUrl &&
            !urls.includes(trimmedUrl) &&
            urls.length < maxUrls
        ) {
            const newUrls = [...urls, trimmedUrl];
            onUrlsChange(newUrls);
            setCurrentUrl('');
        } else setCurrentUrl('');

        const urlInput = document.querySelector('.url-input') as HTMLInputElement;
        urlInput.value = '';
    };

    const removeUrl = (index: number): void => {
        const newUrls = urls.filter((_, i) => i !== index);
        onUrlsChange(newUrls);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addUrl();
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            {urls.length < maxUrls && (
                <>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                type="url"
                                value={currentUrl}
                                onChange={(e) => setCurrentUrl(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={placeholder}
                                required={false}
                                className="pr-10 url-input"
                                name="url-input"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addUrl}
                            disabled={!currentUrl.trim() || urls.length >= maxUrls}
                            className="shrink-0"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </>
            )}

            {urls.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Added URLs:</p>
                    <div className="space-y-2">
                        {urls.map((url, index) => (
                            <React.Fragment key={index}>
                                <div className="flex items-center gap-2 p-2 border rounded-md bg-background/50">
                                    <Link className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="flex-1 text-sm truncate" title={url}>
                                        {url}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeUrl(index)}
                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                                <p className={`text-destructive text-sm links.${index}-error error-p `}></p>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {maxUrls && (
                <p className="text-xs text-muted-foreground">
                    {urls.length} / {maxUrls} URLs added
                </p>
            )}
        </div>
    );
};

export { UrlInput };
