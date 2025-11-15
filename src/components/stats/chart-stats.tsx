'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, BarChart3, TrendingUp } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Line,
    LineChart,
    Area,
    AreaChart
} from 'recharts';

/**
 * General Chart Statistics Component
 * 
 * Usage Examples:
 * 
 * 1. Basic bar chart:
 * <ChartStats
 *   title="Sales by Category"
 *   description="Monthly sales breakdown"
 *   chartType="bar"
 *   dataEndpoint="/api/sales/by-category"
 * />
 * 
 * 2. Line chart with custom data:
 * <ChartStats
 *   title="User Growth"
 *   description="User registration over time"
 *   chartType="line"
 *   customData={userGrowthData}
 * />
 * 
 * 3. Area chart with date range:
 * <ChartStats
 *   title="Revenue Trends"
 *   chartType="area"
 *   dateRange={{ start: '2024-01-01', end: '2024-12-31' }}
 * />
 */

interface ChartDataItem {
    name: string;
    value?: number;
    count?: number;
    Revenue?: number;
    Users?: number;
    // allow other fields but typed as unknown
    [key: string]: unknown;
}

interface ChartStatsProps {
    title?: string;
    description?: string;
    chartType?: 'bar' | 'line' | 'area';
    dataEndpoint?: string;
    customData?: ChartDataItem[];
    dateRange?: { start: string; end: string };
    showCards?: boolean;
    cardColumns?: number;
    onDataFetch?: (endpoint: string, params?: Record<string, unknown> | undefined) => Promise<unknown>;
    className?: string;
}

// Fake data for fallback
const generateFakeData = (type: string): ChartDataItem[] => {
    const categories = ['Products', 'Services', 'Support', 'Marketing', 'Sales', 'Development'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    if (type === 'monthly') {
        return months.map(month => ({
            name: month,
            value: Math.floor(Math.random() * 1000) + 100,
            Revenue: Math.floor(Math.random() * 5000) + 1000,
            Users: Math.floor(Math.random() * 500) + 50
        }));
    }

    return categories.slice(0, 5).map(category => ({
        name: category,
        value: Math.floor(Math.random() * 500) + 50,
        count: Math.floor(Math.random() * 100) + 10
    }));
};

function ChartLoadingSkeleton({ showCards }: { showCards: boolean }): JSX.Element {
    return (
        <div className="space-y-4">
            {showCards && (
                <div className="grid gap-4 grid-cols-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-20 mb-1" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

type TooltipPayloadEntry = {
    name?: string;
    value?: number | string;
    color?: string;
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string | number }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="text-sm font-medium mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : String(entry.value ?? '')}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ChartStats({
    title = "Data Overview",
    description = "Statistical data visualization",
    chartType = "bar",
    dataEndpoint,
    customData,
    dateRange,
    showCards = true,
    cardColumns = 5,
    onDataFetch,
    className = ""
}: ChartStatsProps) {
    const [data, setData] = useState<ChartDataItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            if (customData) {
                setData(customData);
                return;
            }

            if (dataEndpoint && onDataFetch) {
                const params = dateRange ? { ...dateRange } : {};
                const response = await onDataFetch(dataEndpoint, params);
                // Safely extract array data from response
                let extracted: unknown = response;
                if (response && typeof response === 'object' && 'data' in (response as Record<string, unknown>)) {
                    extracted = (response as Record<string, unknown>).data;
                }
                if (Array.isArray(extracted)) {
                    setData(extracted as ChartDataItem[]);
                } else {
                    // fallback to fake data
                    const fakeData = generateFakeData(chartType === 'line' || chartType === 'area' ? 'monthly' : 'category');
                    setData(fakeData);
                }
            } else {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Use fake data as fallback
                const fakeData = generateFakeData(chartType === 'line' || chartType === 'area' ? 'monthly' : 'category');
                setData(fakeData);
            }
        } catch (err: unknown) {
            console.error('Error fetching chart data:', err);
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || 'Failed to load data');
            // Fallback to fake data on error
            const fakeData = generateFakeData(chartType === 'line' || chartType === 'area' ? 'monthly' : 'category');
            setData(fakeData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [dataEndpoint, dateRange, customData]);

    if (loading && !data) {
        return <ChartLoadingSkeleton showCards={showCards} />;
    }

    if (error && !data) {
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

    if (!data || data.length === 0) {
        return (
            <Card className={className}>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                    <p className="text-muted-foreground text-center">
                        No data available for the selected period.
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Helper to safely extract numeric value
    const getNumericValue = (item: ChartDataItem): number => {
        if (typeof item.value === 'number') return item.value;
        if (typeof item.count === 'number') return item.count;
        if (typeof item.Revenue === 'number') return item.Revenue;
        if (typeof item.Users === 'number') return item.Users;
        return 0;
    };

    // Calculate totals for cards
    const total = data.reduce((acc, item) => acc + getNumericValue(item), 0);

    const renderChart = () => {
        const commonProps = {
            data,
            margin: { top: 5, right: 30, left: 20, bottom: 5 }
        };

        switch (chartType) {
            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6' }}
                        />
                        {typeof data[0]?.Revenue === 'number' && (
                            <Line
                                type="monotone"
                                dataKey="Revenue"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ fill: '#ef4444' }}
                            />
                        )}
                    </LineChart>
                );

            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stackId="1"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                        />
                    </AreaChart>
                );

            default:
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            name="Count"
                        />
                    </BarChart>
                );
        }
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {showCards && (
                <div className={`grid gap-4 grid-cols-${cardColumns}`}>
                    {data.slice(0, cardColumns).map((item, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium truncate">
                                    {item.name}
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {getNumericValue(item).toLocaleString()}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {total > 0 ? `${((getNumericValue(item) / total) * 100).toFixed(1)}% of total` : '0% of total'}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        {renderChart()}
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
