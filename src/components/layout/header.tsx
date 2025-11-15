import React from 'react';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import { UserNav } from './user-nav';

/**
 * General Application Header Component
 *
 * Usage Examples:
 *
 * 1. Basic header with breadcrumbs:
 * <Header>
 *   <BreadcrumbNav />
 * </Header>
 *
 * 2. Header with custom left content:
 * <Header
 *   leftContent={<SearchBar />}
 *   showSidebar={false}
 * />
 *
 * 3. Header with custom user menu:
 * <Header
 *   rightContent={<CustomUserMenu />}
 * />
 */

interface HeaderProps {
  children?: React.ReactNode;
  leftContent?: React.ReactNode;
  showRightContent?: boolean;
  rightContent?: React.ReactNode;
  showSidebar?: boolean;
  showSeparator?: boolean;
  className?: string;
}

export default function Header({
  children,
  leftContent,
  showRightContent = true,
  rightContent,
  showSidebar = true,
  showSeparator = true,
  className = '',
}: HeaderProps) {
  // Default breadcrumb component
  const DefaultBreadcrumb = () => (
    <nav className='flex items-center space-x-2 text-sm text-muted-foreground'>
      <span>Dashboard</span>
      <span>/</span>
      <span className='text-foreground'>Current Page</span>
    </nav>
  );

  return (
    <header
      className={`flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 ${className}`}
    >
      <div className='flex items-center gap-2 px-4'>
        {showSidebar && <SidebarTrigger />}
        {showSeparator && showSidebar && (
          <Separator orientation='vertical' className='mr-2 h-4' />
        )}
        {leftContent || children || <DefaultBreadcrumb />}
      </div>

      <div className='flex items-center gap-2 px-4'>
        {showRightContent && (rightContent || <UserNav />)}
      </div>
    </header>
  );
}
