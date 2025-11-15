'use client';

import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    IconProps,
    IconSettings,
    IconUser
} from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

/**
 * General User Dropdown Menu Component
 * 
 * Usage Examples:
 * 
 * 1. Basic usage:
 * <UserDropdownMenu role="user" />
 * 
 * 2. Admin with custom permissions:
 * <UserDropdownMenu 
 *   role="admin" 
 *   permissions={['read_users', 'manage_settings']}
 *   hasPermissionFn={checkPermission}
 * />
 * 
 * 3. Custom menu items:
 * <UserDropdownMenu
 *   role="manager"
 *   customMenuItems={managerMenuItems}
 * />
 */

type MenuItem = {
    label: string;
    href: string;
    icon: React.ComponentType<IconProps>;
    permission?: string;
};

// Default admin menu items with fake data
const defaultAdminMenuItems: MenuItem[] = [
    {
        label: 'Settings',
        href: '/admin/settings',
        icon: IconSettings,
        permission: '',
    }
];

interface UserDropdownMenuProps {
    signOutClassName?: string;
    permissions?: string[];
    hasPermissionFn?: (permissions: string[], permission: string) => boolean;
    customMenuItems?: MenuItem[];
    profileUrl?: string;
    onSignOut?: () => void;
}

export function UserDropdownMenu({
    signOutClassName = "",
    customMenuItems,
    profileUrl = "/profile",
    onSignOut
}: UserDropdownMenuProps) {
    const menuItems = customMenuItems || defaultAdminMenuItems;

    const handleSignOut = () => {
        if (onSignOut) {
            onSignOut();
        } else {
            console.log('Sign out clicked - implement your sign out logic');
        }
    };

    return (
        <>
            <DropdownMenuGroup>
                <Link href={profileUrl}>
                    <DropdownMenuItem className="group text-foreground hover:bg-primary hover:text-white">
                        <IconUser className="mr-2 h-4 w-4 stroke-foreground group-hover:stroke-white" />
                        Profile
                    </DropdownMenuItem>
                </Link>

                {menuItems.map(({ label, href, icon: IconComponent, permission }) => {
                    return (
                        <Link key={permission || href} href={href}>
                            <DropdownMenuItem className="group text-foreground hover:bg-primary hover:text-white">
                                <IconComponent className="mr-2 h-4 w-4 stroke-foreground group-hover:stroke-white" />
                                {label}
                            </DropdownMenuItem>
                        </Link>
                    );
                })}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="border-border" />

            <DropdownMenuItem
                onClick={handleSignOut}
                className={`group text-foreground hover:bg-destructive hover:text-destructive-foreground cursor-pointer ${signOutClassName}`}
            >
                <IconUser className="mr-2 h-4 w-4 stroke-foreground group-hover:stroke-destructive-foreground" />
                Sign Out
            </DropdownMenuItem>
        </>
    );
}