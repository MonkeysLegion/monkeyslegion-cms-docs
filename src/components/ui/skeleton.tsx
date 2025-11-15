import { cn } from '@/lib/utils';
import React from 'react';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>): React.JSX.Element {
  return (
    <div
      data-slot='skeleton'
      className={cn('bg-primary animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
