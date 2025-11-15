'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { UserDropdownMenu } from './user-dropdown-menu';
import { User } from '@/contexts/AppProvider';
import Image from 'next/image';

/**
 * General User Navigation Component
 *
 * Usage Examples:
 *
 * 1. Basic usage with user context:
 * <UserNav />
 *
 * 2. With custom user data:
 * <UserNav
 *   user={{ name: "John Doe", email: "john@example.com", avatar: "/avatar.jpg" }}
 *   role="manager"
 * />
 *
 * 3. With custom badge styling:
 * <UserNav
 *   badgeClassName="bg-green-500"
 *   showRole={true}
 * />
 */

export function UserNav({
  user = { id: '1', name: 'Sample User', email: 'user@example.com', avatar: '' },
  role = 'user',
  showRole = true,
  badgeClassName = 'rounded-full border border-white bg-primary',
  className = ''
}) {
  const UserAvatar = ({ user, className = '' }: { user: User | null; className?: string }) => (
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold ${className}`}
    >
      {user?.avatar ? (
        <Image
          src={user.avatar}
          alt={user.name}
          className='w-full h-full rounded-full object-cover'
        />
      ) : (
        user?.name?.charAt(0)?.toUpperCase() || 'U'
      )}
    </div>
  );

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className={`relative h-8 w-8 rounded-full ${className}`}
          >
            <UserAvatar user={user} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className='font-normal flex flex-col items-start'>
            <div className='flex justify-between items-center space-y-1 w-full'>
              <p className='text-sm leading-none font-medium'>{user.name}</p>
              {showRole && (
                <Badge className={badgeClassName}>
                  {role ?? 'User'}
                </Badge>
              )}
            </div>
            <p className='text-muted-foreground text-xs leading-none'>
              {user.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <UserDropdownMenu />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}
