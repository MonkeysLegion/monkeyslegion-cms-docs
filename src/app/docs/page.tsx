'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { DocumentationView } from '@/components/docs/documentation-view';
import { Search } from 'lucide-react';
import { documentationData } from '@/data/documentation';
import { useDocs } from '@/contexts/DocsContext';
import { Button } from '@/components/ui/button';

const INITIAL_COMPONENT_LIMIT = 5;

export default function DocsPage() {
    const { searchQuery, setSearchQuery } = useDocs();
    const [showAll, setShowAll] = useState(false);

    const isSearching = searchQuery.trim().length > 0;

    const filteredCategories = documentationData.map(category => {
        const filteredComponents = category.components.filter(component =>
            component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            component.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // When not searching, limit to first N components
        const displayComponents = isSearching || showAll
            ? filteredComponents
            : filteredComponents.slice(0, INITIAL_COMPONENT_LIMIT);

        return {
            ...category,
            components: displayComponents,
            totalComponents: filteredComponents.length,
            hasMore: filteredComponents.length > INITIAL_COMPONENT_LIMIT && !isSearching && !showAll
        };
    }).filter(category => category.components.length > 0);

    const totalComponentsCount = documentationData.reduce(
        (sum, cat) => sum + cat.components.length,
        0
    );
    const displayedCount = filteredCategories.reduce(
        (sum, cat) => sum + cat.components.length,
        0
    );

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Header */}
            <div className="space-y-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">CMS Documentation</h1>
                    <p className="text-muted-foreground text-lg">
                        Complete guide to using and customizing Monkeys Legion CMS
                    </p>
                    {!isSearching && !showAll && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Showing {displayedCount} of {totalComponentsCount} topics
                        </p>
                    )}
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                        name=''
                        type="search"
                        placeholder="Search documentation..."
                        className="pl-10 border-primary/20 focus:border-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-16">
                {filteredCategories.map((category) => (
                    <div key={category.id} id={category.id}>
                        <DocumentationView
                            title={category.title}
                            description={category.description}
                            components={category.components}
                            categoryColor={category.color}
                        />
                        {category.hasMore && (
                            <div className="mt-6 text-center">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAll(true)}
                                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                >
                                    Show {category.totalComponents - category.components.length} more topics in {category.title}
                                </Button>
                            </div>
                        )}
                    </div>
                ))}

                {!isSearching && !showAll && displayedCount < totalComponentsCount && (
                    <div className="text-center py-8">
                        <Button
                            onClick={() => setShowAll(true)}
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-orange-dark"
                        >
                            Show All {totalComponentsCount} Documentation Topics
                        </Button>
                    </div>
                )}

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-muted-foreground text-lg">No documentation found matching your search.</p>
                        <Button
                            variant="link"
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-primary hover:text-orange-dark"
                        >
                            Clear search
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
