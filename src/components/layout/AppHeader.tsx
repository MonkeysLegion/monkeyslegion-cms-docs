import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { Button } from '../ui/button';
import { IconBell, IconSearch, IconUser } from '@tabler/icons-react';
import React from 'react';

/**
 * General Application Header Component
 * 
 * Usage Examples:
 * 
 * 1. Basic header with breadcrumbs:
 * <AppHeader>
 *   <BreadcrumbNav items={breadcrumbItems} />
 * </AppHeader>
 * 
 * 2. Header with custom actions:
 * <AppHeader 
 *   rightContent={<CustomUserMenu />}
 *   showSeparator={false}
 * />
 * 
 * 3. Header with search and notifications:
 * <AppHeader
 *   leftContent={<SearchBar />}
 *   rightContent={
 *     <div className="flex items-center gap-2">
 *       <NotificationButton />
 *       <UserMenu />
 *     </div>
 *   }
 * />
 */

interface AppHeaderProps {
    children?: React.ReactNode;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    showSidebar?: boolean;
    showSeparator?: boolean;
    className?: string;
    height?: string;
}

export default function AppHeader({
    children,
    leftContent,
    rightContent,
    showSidebar = true,
    showSeparator = true,
    className = "",
    height = "h-16"
}: AppHeaderProps) {

    // Default right content - simple user menu
    const defaultRightContent = (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
                <IconBell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon">
                <IconSearch className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
                <IconUser className="h-4 w-4" />
            </Button>
        </div>
    );

    return (
        <header className={`flex ${height} shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 ${className}`}>
            <div className='flex items-center gap-2 px-4'>
                {showSidebar && <SidebarTrigger />}
                {showSeparator && showSidebar && <Separator orientation='vertical' className='mr-2 h-4' />}
                {leftContent || children}
            </div>

            <div className='flex items-center gap-2 px-4'>
                {rightContent || defaultRightContent}
            </div>
        </header>
    );
}
