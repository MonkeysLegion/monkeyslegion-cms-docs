'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import {
  IconChevronRight,
  IconChevronsDown,
  IconHome,
  IconUsers,
  IconSettings,
  IconFiles,
  IconTicket,
  IconCalendar
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { UserDropdownMenu } from './user-dropdown-menu';
import { User } from '@/contexts/AppProvider';

/**
 * General Application Sidebar Component
 * 
 * Usage Examples:
 * 
 * 1. Basic sidebar with default menu:
 * <AppSidebar />
 * 
 * 2. Custom menu items:
 * <AppSidebar
 *   menuItems={customMenuItems}
 *   user={currentUser}
 * />
 */

// Default fallback menu items
const defaultMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'home',
  },
  {
    title: 'Users',
    url: '/users',
    icon: 'users',
    items: [
      { title: 'All Users', url: '/users' },
      { title: 'Add User', url: '/users/create' },
      { title: 'User Roles', url: '/users/roles' },
    ]
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: 'files',
    items: [
      { title: 'All Projects', url: '/projects' },
      { title: 'Create Project', url: '/projects/create' },
    ]
  },
  {
    title: 'Tasks',
    url: '/tasks',
    icon: 'ticket',
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: 'calendar',
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: 'settings',
  }
];

interface MenuItem {
  title: string,
  url: string,
  icon: string,
  items?: {
    title: string, url: string,
  }[]
  permission?: string
  isActive?: boolean
}

// Icon mapping
const iconMap = {
  home: IconHome,
  users: IconUsers,
  settings: IconSettings,
  files: IconFiles,
  ticket: IconTicket,
  calendar: IconCalendar,
};

interface AppSidebarProps {
  menuItems?: MenuItem[];
  user?: User;
  permissions?: string[];
  hasPermissionFn?: (permissions: string[], permission: string) => boolean;
  logoSrc?: string;
  logoAlt?: string;
  homeUrl?: string;
  className?: string;
}

export default function AppSidebar({
  menuItems = defaultMenuItems,
  user = { id: "1", name: 'John Doe', email: 'john.doe@example.com' },
  permissions = [],
  hasPermissionFn = () => true,
  logoSrc = "/logo.png",
  logoAlt = "Logo",
  homeUrl = "/dashboard",
  className = ""
}: AppSidebarProps) {
  const pathname = usePathname();

  const UserAvatarProfile = ({ user, className = "", showInfo = false }: { user: User, className: string, showInfo: boolean }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
        {user?.avatar ? (
          <Image src={user.avatar} alt={user.name} className="w-full h-full rounded-lg object-cover" />
        ) : (
          user?.name?.charAt(0)?.toUpperCase() || "U"
        )}
      </div>
      {showInfo && (
        <div className="text-left text-sm">
          <div className="font-semibold">{user?.name || "User"}</div>
          <div className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</div>
        </div>
      )}
    </div>
  );

  return (
    <Sidebar collapsible='icon' className={`bg-sidebar text-sidebar-foreground border-r border-primary/20 ${className}`}>
      <SidebarHeader className='flex items-center justify-between px-4 border-b border-primary/20'>
        <Link href={homeUrl}>
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={80}
            height={80}
            onError={(e) => {
              // Hide broken image and show text fallback
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className='overflow-x-hidden text-sidebar-foreground'>
        <SidebarGroup className='space-y-4'>
          <SidebarMenu>
            {menuItems.map((item) => {
              if (item.permission && !hasPermissionFn(permissions, item.permission)) {
                return null;
              }

              const Icon = (item.icon && item.icon in iconMap)
                ? iconMap[item.icon as keyof typeof iconMap]
                : IconHome;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive || false}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                        className="py-3 text-xl font-semibold hover:bg-primary/10 hover:text-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-colors group"
                      >
                        {item.icon && <Icon className="group-hover:text-primary transition-colors" size={24} />}
                        <span className="group-hover:text-primary transition-colors">{item.title}</span>
                        <IconChevronRight className='ml-auto transition-all duration-200 group-data-[state=open]/collapsible:rotate-90 h-6 w-6 group-hover:text-primary' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l border-primary/20">
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                              className="py-2.5 text-base hover:bg-primary/10 hover:text-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-colors group"
                            >
                              <Link href={subItem.url}>
                                <span className="group-hover:text-primary transition-colors">{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    className="py-4 text-lg font-semibold hover:bg-primary/10 hover:text-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-colors group"
                  >
                    <Link href={item.url}>
                      <Icon className="h-6 w-6 group-hover:text-primary transition-colors" />
                      <span className="group-hover:text-primary transition-colors">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  <UserAvatarProfile
                    className='h-8 w-8 rounded-lg'
                    showInfo
                    user={user}
                  />
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg card-bg border-border'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                      user={user}
                    />
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="border-border" />
                <UserDropdownMenu signOutClassName='w-full' />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
