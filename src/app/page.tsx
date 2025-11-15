'use client';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/ui/footer';
import { IconBook, IconCode, IconComponents, IconPalette, IconRocket, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background w-full">
      {/* Navigation */}
      <nav className="sticky top-0 z-100 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Monkeys Legion CMS</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild className="bg-primary text-primary-foreground hover:bg-orange-dark">
              <Link href="/docs">Documentation</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-24 md:py-32 w-full">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(234,138,10,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(234,138,10,.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,#000,transparent)]" />

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl bg-gradient-to-r from-slate-900 via-primary to-orange-dark bg-clip-text text-transparent">
            Powerful Content Management Made Simple
          </h1>

          <p className="mb-4 text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto">
            Monkeys Legion CMS is a modern, flexible content management system.
            Manage your content with ease and power.
          </p>

          {/* Powered by MonkeysLegion */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-sm text-muted-foreground">Powered by</span>
            <Image
              src="/MonkeysLegion.svg"
              alt="MonkeysLegion"
              width={150}
              height={30}
              className="h-6 w-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">Why Choose Monkeys Legion CMS</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for modern content management
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <IconComponents className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Intuitive Interface</CardTitle>
                <CardDescription>
                  Clean and user-friendly interface that makes content management a breeze
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <IconPalette className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Beautiful Design System</CardTitle>
                <CardDescription>
                  Luxury orange & black theme with dark mode support for comfortable editing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <IconCode className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Easy to Use</CardTitle>
                <CardDescription>
                  No coding required. Built for everyone - from content creators to developers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <IconBook className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Complete Documentation</CardTitle>
                <CardDescription>
                  Comprehensive guides and API documentation to help you get started quickly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <IconSearch className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Powerful Search</CardTitle>
                <CardDescription>
                  Find any feature or setting instantly with our intelligent search system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <IconRocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Battle-tested and ready to handle your content management needs at scale
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}