import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

/**
 * General Page Wrapper Component
 * 
 * Usage Examples:
 * 
 * 1. Basic scrollable page:
 * <PageWrapper>
 *   <YourPageContent />
 * </PageWrapper>
 * 
 * 2. Non-scrollable page with custom height:
 * <PageWrapper 
 *   scrollable={false}
 *   height="h-screen"
 *   padding="p-6"
 * >
 *   <FullHeightContent />
 * </PageWrapper>
 * 
 * 3. Page with custom styling:
 * <PageWrapper
 *   className="bg-gray-50"
 *   containerClassName="max-w-4xl mx-auto"
 *   padding="p-8"
 * >
 *   <CenteredContent />
 * </PageWrapper>
 * 
 * 4. Mobile responsive page:
 * <PageWrapper
 *   padding="p-4 md:p-6 lg:p-8"
 *   maxWidth="max-w-7xl"
 * >
 *   <ResponsiveContent />
 * </PageWrapper>
 */

interface PageWrapperProps {
    children: React.ReactNode;
    scrollable?: boolean;
    height?: string;
    padding?: string;
    maxWidth?: string;
    className?: string;
    containerClassName?: string;
    showScrollbar?: boolean;
}

export default function PageWrapper({
    children,
    scrollable = true,
    height = 'h-[calc(100dvh-64px)]',
    padding = 'p-4 md:px-6',
    maxWidth,
    className = '',
    containerClassName = '',
    showScrollbar = false
}: PageWrapperProps) {

    const contentClasses = `flex flex-1 ${padding} ${maxWidth || ''} ${containerClassName}`;

    if (scrollable) {
        return (
            <ScrollArea
                className={`${height} ${className}`}
                style={{
                    scrollbarWidth: showScrollbar ? 'auto' : 'none',
                    msOverflowStyle: showScrollbar ? 'auto' : 'none'
                }}
            >
                <div className={contentClasses}>
                    {children}
                </div>
            </ScrollArea>
        );
    }

    return (
        <div className={`${contentClasses} ${height} ${className}`}>
            {children}
        </div>
    );
}
