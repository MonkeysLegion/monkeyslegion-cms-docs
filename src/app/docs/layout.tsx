'use client';

import { DocsProvider } from '@/contexts/DocsContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import NavigationSidebar from '@/components/layout/NavigationSidebar';
import { useDocsNavigation } from '@/hooks/useDocsNavigation';
import { ReactNode } from 'react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import Footer from '@/components/ui/footer';

function DocsLayout({ children }: { children: ReactNode }) {
    const { navigation } = useDocsNavigation();

    return (
        <div className="flex min-h-screen w-full bg-background">
            <NavigationSidebar
                logoSrc="/MonkeysLegion.svg"
                logoAlt="Monkeys Legion CMS"
                logoWidth={180}
                logoHeight={180}
                homeUrl="/docs"
                menuItems={navigation}
                className="border-r border-primary/20"
            />
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold text-primary">CMS Documentation</h2>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}

export default function DocsLayoutWrapper({ children }: { children: ReactNode }) {
    return (
        <DocsProvider>
            <SidebarProvider>
                <DocsLayout>{children}</DocsLayout>
            </SidebarProvider>
        </DocsProvider>
    );
}
