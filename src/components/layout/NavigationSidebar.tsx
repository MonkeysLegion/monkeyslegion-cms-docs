'use client';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
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
    IconHome,
    IconProps
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

/**
 * Documentation Navigation Sidebar Component
 * 
 * Usage:
 * <NavigationSidebar
 *   logoSrc="/logo.png"
 *   logoAlt="Monkeys Legion CMS"
 *   homeUrl="/docs"
 *   menuItems={docsNavigation}
 * />
 */

interface NavigationItem {
    title: string;
    url: string;
    icon?: React.ComponentType<IconProps> | React.ElementType;
    isActive?: boolean;
    items?: Array<{
        title: string;
        url: string;
    }>;
}

interface NavigationSidebarProps {
    logoSrc?: string;
    logoAlt?: string;
    logoWidth?: number;
    logoHeight?: number;
    homeUrl?: string;
    menuItems?: NavigationItem[];
    className?: string;
}

const defaultMenuItems: NavigationItem[] = [
    {
        title: 'Getting Started',
        url: '/docs',
        icon: IconHome,
    }
];

export default function NavigationSidebar({
    logoSrc = "/logo.png",
    logoAlt = "Logo",
    logoWidth = 80,
    logoHeight = 80,
    homeUrl = "/",
    menuItems = defaultMenuItems,
    className = ""
}: NavigationSidebarProps) {
    const pathname = usePathname();

    return (
        <Sidebar collapsible='icon' className={`bg-sidebar text-sidebar-foreground border-r border-primary/20 ${className}`}>
            <SidebarHeader className='flex items-center justify-center px-4 py-6 border-b border-primary/20'>
                <Link href={homeUrl} className="flex items-center gap-2 group">
                    <Image
                        src={logoSrc}
                        alt={logoAlt}
                        width={logoWidth}
                        height={logoHeight}
                        className="object-contain transition-transform group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </Link>
            </SidebarHeader>

            <SidebarContent className='overflow-x-hidden text-sidebar-foreground'>
                <SidebarMenu className="space-y-2 px-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon || IconHome;

                        return item?.items && item?.items?.length > 0 ? (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={!!item.isActive}
                                className='group/collapsible'
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={pathname === item.url}
                                            className="py-3 text-base font-semibold transition-all hover:bg-primary/10 data-[state=active]:bg-primary/15 data-[state=active]:border-l-2 data-[state=active]:border-primary"
                                        >
                                            <Icon className="flex-shrink-0 transition-colors" size={20} />
                                            <span className="truncate flex-1 transition-colors">{item.title}</span>
                                            <IconChevronRight className='ml-auto flex-shrink-0 transition-all duration-200 group-data-[state=open]/collapsible:rotate-90 h-5 w-5' />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub className="ml-4 border-l-2 border-border hover:border-primary/30 transition-colors">
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={pathname === subItem.url}
                                                        className="py-2 text-sm transition-all hover:bg-primary/10 hover:text-primary data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:font-semibold"
                                                    >
                                                        <Link href={subItem.url} title={subItem.title}>
                                                            <span className="truncate">{subItem.title}</span>
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
                                    className="py-3 text-base font-semibold transition-all hover:bg-primary/10 data-[state=active]:bg-primary/15 data-[state=active]:border-l-2 data-[state=active]:border-primary"
                                >
                                    <Link href={item.url}>
                                        <Icon className="h-5 w-5 flex-shrink-0 transition-colors" />
                                        <span className="truncate flex-1 transition-colors">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}
