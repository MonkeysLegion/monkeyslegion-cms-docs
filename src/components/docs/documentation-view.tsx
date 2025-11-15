'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { ComponentDoc } from '@/types/docs';

interface DocumentationViewProps {
    title: string;
    description: string;
    components: ComponentDoc[];
    categoryColor: string;
}

export function DocumentationView({
    title,
    description,
    components,
}: DocumentationViewProps) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = async (code: string, id: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Category Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <h2 className="text-2xl font-bold text-primary">{title}</h2>
                </div>
                <p className="text-muted-foreground text-lg">{description}</p>
            </div>

            {/* Components Grid */}
            <div className="grid gap-6">
                {components.map((component) => (
                    <Card key={component.id} className="h-full border-primary/20 hover:border-primary transition-colors">
                        <CardHeader>
                            <div className="flex items-center justify-between gap-2">
                                <CardTitle className="text-lg truncate flex-1">{component.name}</CardTitle>
                                <Badge variant="secondary" className="flex-shrink-0 bg-primary/10 text-primary border-primary/20">{component.category}</Badge>
                            </div>
                            <CardDescription className="line-clamp-2">{component.description}</CardDescription>
                            <div className="text-xs text-muted-foreground font-mono truncate">
                                {component.path}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="props" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-primary/5">
                                    <TabsTrigger value="props" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Props</TabsTrigger>
                                    <TabsTrigger value="examples" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Examples</TabsTrigger>
                                </TabsList>

                                <TabsContent value="props" className="space-y-4">
                                    {component.props && component.props.length > 0 ? (
                                        <div className="space-y-2">
                                            {component.props.map((prop, index) => (
                                                <div key={index} className="border border-primary/20 rounded p-3 hover:border-primary/40 transition-colors">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <code className="text-sm font-medium break-all text-primary">{prop.name}</code>
                                                        <Badge variant={prop.required ? "destructive" : "outline"} className="text-xs flex-shrink-0">
                                                            {prop.type}
                                                        </Badge>
                                                        {prop.required && (
                                                            <Badge variant="destructive" className="text-xs flex-shrink-0 bg-primary text-primary-foreground">required</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground break-words">{prop.description}</p>
                                                    {prop.default && (
                                                        <p className="text-xs text-muted-foreground mt-1 break-all">
                                                            Default: <code className="bg-primary/10 text-primary px-1 py-0.5 rounded">{prop.default}</code>
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No props documented yet.</p>
                                    )}
                                </TabsContent>

                                <TabsContent value="examples" className="space-y-4">
                                    {component.examples && component.examples.length > 0 ? (
                                        <div className="space-y-4">
                                            {component.examples.map((example, index) => (
                                                <div key={index} className="space-y-2">
                                                    <h4 className="text-sm font-medium break-words text-primary">{example.title}</h4>
                                                    {example.description && (
                                                        <p className="text-xs text-muted-foreground break-words">{example.description}</p>
                                                    )}
                                                    <div className="relative">
                                                        <pre className="bg-primary/5 border border-primary/20 p-3 rounded text-sm overflow-x-auto max-w-full">
                                                            <code className="break-all whitespace-pre-wrap">{example.code}</code>
                                                        </pre>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-primary/20 hover:text-primary"
                                                            onClick={() => copyToClipboard(example.code, `${component.id}-${index}`)}
                                                        >
                                                            {copiedCode === `${component.id}-${index}` ? (
                                                                <Check className="h-3 w-3 text-primary" />
                                                            ) : (
                                                                <Copy className="h-3 w-3" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No examples available yet.</p>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
