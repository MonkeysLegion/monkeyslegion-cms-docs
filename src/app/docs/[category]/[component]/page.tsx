'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { documentationData } from '@/data/documentation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface PageProps {
    params: Promise<{
        category: string;
        component: string;
    }>;
}

export default function ComponentPage({ params }: PageProps) {
    const { category: categoryId, component: componentId } = use(params);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const category = documentationData.find(cat => cat.id === categoryId);
    const component = category?.components.find(comp => comp.id === componentId);

    if (!component || !category) {
        notFound();
    }

    const copyToClipboard = async (code: string, id: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/docs" className="hover:text-foreground">Documentation</Link>
                <span>/</span>
                <Link href={`/docs#${categoryId}`} className="hover:text-foreground">{category.title}</Link>
                <span>/</span>
                <span className="text-foreground">{component.name}</span>
            </div>

            {/* Component Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-4xl font-bold">{component.name}</h1>
                    <Badge variant="secondary">{component.category}</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-2">{component.description}</p>
                <code className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                    {component.path}
                </code>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="props" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="props">Props</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="props" className="space-y-4">
                    {component.props && component.props.length > 0 ? (
                        <div className="space-y-3">
                            {component.props.map((prop, index) => (
                                <Card key={index}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <code className="text-base font-semibold">{prop.name}</code>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {prop.type}
                                            </Badge>
                                            {prop.required && (
                                                <Badge variant="destructive" className="text-xs">required</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{prop.description}</p>
                                        {prop.default && (
                                            <p className="text-xs text-muted-foreground">
                                                Default: <code className="bg-muted px-1 py-0.5 rounded">{prop.default}</code>
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No props documented yet.</p>
                    )}
                </TabsContent>

                <TabsContent value="examples" className="space-y-6">
                    {component.examples && component.examples.length > 0 ? (
                        <div className="space-y-6">
                            {component.examples.map((example, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="text-xl">{example.title}</CardTitle>
                                        {example.description && (
                                            <CardDescription>{example.description}</CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative">
                                            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                                <code>{example.code}</code>
                                            </pre>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="absolute top-2 right-2"
                                                onClick={() => copyToClipboard(example.code, `${component.id}-${index}`)}
                                            >
                                                {copiedCode === `${component.id}-${index}` ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No examples available yet.</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
