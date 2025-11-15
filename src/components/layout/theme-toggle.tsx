'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <IconSun className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 hover:bg-primary/10 transition-colors"
        >
            {theme === 'dark' ? (
                <IconSun className="h-5 w-5 text-primary transition-transform hover:rotate-90" />
            ) : (
                <IconMoon className="h-5 w-5 text-primary transition-transform hover:-rotate-12" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
