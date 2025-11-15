import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

/**
 * General Page Container Component
 *
 * Usage Examples:
 *
 * 1. Basic scrollable container for dashboard pages:
 * <PageContainer fullHeight>
 *   <YourContent />
 * </PageContainer>
 *
 * 2. Marketing page with natural flow (for footers):
 * <PageContainer fullHeight={false}>
 *   <MarketingContent />
 *   <Footer />
 * </PageContainer>
 *
 * 3. Custom styling:
 * <PageContainer
 *   padding="p-6"
 *   className="bg-gray-50"
 * >
 *   <YourContent />
 * </PageContainer>
 */

interface PageContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  fullHeight?: boolean;
  height?: string;
  padding?: string;
  className?: string;
}

export default function PageContainer({
  children,
  scrollable = true,
  fullHeight = false,
  height,
  padding = 'p-4 md:px-6',
  className = ''
}: PageContainerProps) {
  // Default height calculation for dashboard-style pages
  const calculatedHeight = height || (fullHeight ? 'h-[calc(100dvh-64px)]' : 'min-h-0');

  return (
    <>
      {scrollable && fullHeight ? (
        // Scrollable container with fixed height (for dashboard style pages)
        <ScrollArea className={`${calculatedHeight} ${className}`}>
          <div className={`flex flex-1 ${padding}`}>{children}</div>
        </ScrollArea>
      ) : (
        // Natural flow container (better for marketing pages with footers)
        <div className={`flex flex-1 flex-col ${padding} ${fullHeight ? calculatedHeight : ''} ${className}`}>{children}</div>
      )}
    </>
  );
}