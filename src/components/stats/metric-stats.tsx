'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
    AlertCircle,
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    ShoppingCart,
    Activity,
    Eye,
    Target
} from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * General Metric Statistics Component
 * 
 * Usage Examples:
 * 
 * 1. Basic metrics grid:
 * <MetricStats
 *   title="Dashboard Overview"
 *   metricsEndpoint="/api/dashboard/metrics"
 * />
 * 
 * 2. Custom metrics with data:
 * <MetricStats
 *   title="Sales Metrics"
 *   customMetrics={salesMetrics}
 *   columns={4}
 * />
 * 
 * 3. With date range:
 * <MetricStats
 *   title="Monthly Report"
 *   dateRange={{ start: '2024-01-01', end: '2024-01-31' }}
 *   showTrends={true}
 * />
 */

interface MetricItem {
    id: string;
    name: string;
    value: number | string;
    previousValue?: number;
    change?: number;
    changeType?: 'increase' | 'decrease' | 'neutral';
    icon?: string;
    color?: string;
    description?: string;
    trend?: 'up' | 'down' | 'neutral';
}

interface MetricStatsProps {
    title?: string;
    description?: string;
    metricsEndpoint?: string;
    customMetrics?: MetricItem[];
    dateRange?: { start: string; end: string };
    showTrends?: boolean;
    columns?: number;
    onDataFetch?: (endpoint: string, params?: unknown) => Promise<{ data: MetricItem[] } | MetricItem[]>;
    className?: string;
}

// Icon mapping
const iconMap = {
    users: Users,
    revenue: DollarSign,
    orders: ShoppingCart,
    activity: Activity,
    views: Eye,
    conversion: Target,
};

// Fake data for fallback
const generateFakeMetrics = (): MetricItem[] => {
    const metrics = [
        {
            id: '1',
            name: 'Total Users',
            value: Math.floor(Math.random() * 10000) + 1000,
            previousValue: Math.floor(Math.random() * 9000) + 800,
            icon: 'users',
            color: 'text-blue-600',
            description: 'Active users this month'
        },
        {
            id: '2',
            name: 'Revenue',
            value: `$${(Math.random() * 100000 + 10000).toFixed(0)}`,
            previousValue: Math.random() * 90000 + 8000,
            icon: 'revenue',
            color: 'text-green-600',
            description: 'Total revenue generated'
        },
        {
            id: '3',
            name: 'Orders',
            value: Math.floor(Math.random() * 5000) + 500,
            previousValue: Math.floor(Math.random() * 4500) + 400,
            icon: 'orders',
            color: 'text-orange-600',
            description: 'Orders processed'
        },
        {
            id: '4',
            name: 'Conversion Rate',
            value: `${(Math.random() * 10 + 1).toFixed(1)}%`,
            previousValue: Math.random() * 9 + 0.5,
            icon: 'conversion',
            color: 'text-purple-600',
            description: 'Visitor to customer conversion'
        },
        {
            id: '5',
            name: 'Page Views',
            value: Math.floor(Math.random() * 50000) + 5000,
            previousValue: Math.floor(Math.random() * 45000) + 4000,
            icon: 'views',
            color: 'text-indigo-600',
            description: 'Total page views'
        },
        {
            id: '6',
            name: 'Active Sessions',
            value: Math.floor(Math.random() * 1000) + 100,
            previousValue: Math.floor(Math.random() * 900) + 80,
            icon: 'activity',
            color: 'text-red-600',
            description: 'Current active sessions'
        }
    ];

    // Calculate trends
    return metrics.map(metric => {
        if (typeof metric.value === 'number' && metric.previousValue) {
            const change = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
            return {
                ...metric,
                change: Math.abs(change),
                changeType: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral',
                trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
            };
        }
        return {
            ...metric,
            change: Math.random() * 20,
            changeType: Math.random() > 0.5 ? 'increase' : 'decrease',
            trend: Math.random() > 0.5 ? 'up' : 'down',
        };
    });
};

function MetricLoadingSkeleton({ columns }: { columns: number }) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className={`grid gap-4 grid-cols-${columns}`}>
                {Array.from({ length: columns * 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-20 mb-1" />
                            <Skeleton className="h-3 w-32 mb-1" />
                            <Skeleton className="h-3 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function MetricStats({
    title = "Metrics Dashboard",
    description = "Key performance indicators",
    metricsEndpoint,
    customMetrics,
    dateRange,
    showTrends = true,
    columns = 3,
    onDataFetch,
    className = ""
}: MetricStatsProps) {
    const [metrics, setMetrics] = useState<MetricItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            if (customMetrics) {
                setMetrics(customMetrics);
                return;
            }

            if (metricsEndpoint && onDataFetch) {
                const params = dateRange ? { ...dateRange } : {};
                const response = await onDataFetch(metricsEndpoint, params);
                // Safely extract data: if response has a 'data' property, use it; otherwise treat response itself as the array
                let extracted: MetricItem[];
                if (response && typeof response === 'object' && 'data' in response) {
                    extracted = (response as { data: MetricItem[] }).data;
                } else if (Array.isArray(response)) {
                    extracted = response as MetricItem[];
                } else {
                    // fallback to fake data
                    extracted = generateFakeMetrics();
                }
                setMetrics(extracted);
            } else {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));
                // Use fake data as fallback
                const fakeMetrics = generateFakeMetrics();
                setMetrics(fakeMetrics);
            }
        } catch (err: unknown) {
            console.error('Error fetching metrics:', err);
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || 'Failed to load metrics');
            // Fallback to fake data on error
            const fakeMetrics = generateFakeMetrics();
            setMetrics(fakeMetrics);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [metricsEndpoint, dateRange, customMetrics]);

    if (loading && !metrics) {
        return <MetricLoadingSkeleton columns={columns} />;
    }

    if (error && !metrics) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                    {error}
                    <Button variant="outline" size="sm" onClick={fetchData}>
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (!metrics || metrics.length === 0) {
        return (
            <Card className={className}>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Metrics Available</h3>
                    <p className="text-muted-foreground text-center">
                        No metrics data available for the selected period.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const renderTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case 'down':
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            default:
                return <Activity className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTrendColor = (changeType: string) => {
        switch (changeType) {
            case 'increase':
                return 'text-green-600 bg-green-50';
            case 'decrease':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>

            <div className={`grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}>
                {metrics.map((metric) => {
                    const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || Activity;

                    return (
                        <Card key={metric.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium truncate">
                                    {metric.name}
                                </CardTitle>
                                <div className={`${metric.color || 'text-gray-600'}`}>
                                    <IconComponent className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold mb-1">
                                    {typeof metric.value === 'number'
                                        ? metric.value.toLocaleString()
                                        : metric.value
                                    }
                                </div>

                                {metric.description && (
                                    <p className="text-xs text-muted-foreground mb-2">
                                        {metric.description}
                                    </p>
                                )}

                                {showTrends && metric.change !== undefined && (
                                    <div className="flex items-center space-x-1">
                                        {renderTrendIcon(metric.trend || 'neutral')}
                                        <Badge
                                            variant="secondary"
                                            className={`text-xs ${getTrendColor(metric.changeType || 'neutral')}`}
                                        >
                                            {metric.changeType === 'increase' ? '+' : metric.changeType === 'decrease' ? '-' : ''}
                                            {metric.change.toFixed(1)}%
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            vs last period
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
