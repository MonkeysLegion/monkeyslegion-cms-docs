import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserAvatarProfileProps } from '@/types';
import { SafeString } from '@/utils/safe-string';
import { JSX } from 'react';



export function UserAvatarProfileSideBar({
  className,
  showInfo = false,
  user
}: UserAvatarProfileProps): JSX.Element {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className + ' text-black text-sm'}>
        <AvatarFallback className='rounded-lg'>
          {SafeString(user?.name?.slice(0, 2)?.toUpperCase(), 'CN')}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{SafeString(user?.name, '')}</span>
          <span className='truncate text-xs'>{SafeString(user?.email, '')}</span>
        </div>
      )}
    </div>
  );
}
