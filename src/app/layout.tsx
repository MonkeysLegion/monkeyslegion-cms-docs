'use client';

import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/font';
import { cn } from '@/lib/utils';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Monkeys Legion CMS - Documentation</title>
        <meta name="description" content="Complete documentation for Monkeys Legion CMS - A modern content management system" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={cn(
          'bg-background overscroll-none font-sans antialiased',
          fontVariables
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            showSpinner={false}
            color="#ea8a0a"
            height={3}
          />
          <NuqsAdapter>
            <Toaster />
            {children}
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
