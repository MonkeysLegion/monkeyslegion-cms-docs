'use client';

import { useTheme } from 'next-themes';
import React, { JSX } from 'react';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps): JSX.Element => {
  const { theme } = useTheme();

  // Use NonNullable to remove `undefined` from the ToasterProps['theme'] type
  type SonnerTheme = NonNullable<ToasterProps['theme']>;
  const resolvedTheme: SonnerTheme = (theme ?? 'system') as SonnerTheme;

  return (
    <Sonner
      theme={resolvedTheme}
      className='toaster group'
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)'
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
