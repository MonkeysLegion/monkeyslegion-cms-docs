'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DocsContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeCategory: string | null;
    setActiveCategory: (category: string | null) => void;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export function DocsProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <DocsContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                activeCategory,
                setActiveCategory,
            }}
        >
            {children}
        </DocsContext.Provider>
    );
}

export function useDocs() {
    const context = useContext(DocsContext);
    if (context === undefined) {
        throw new Error('useDocs must be used within a DocsProvider');
    }
    return context;
}
