import { StatModule, StatIndexEntry } from '@/lib/types';

export type { StatModule };

// Global module cache
const moduleCache = new Map<string, Promise<StatModule>>();

// Add a helper to manage stat module loading with proper caching
const createStatLoader = (id: string, importFunc: () => Promise<unknown>) => {
    return () => {
        // Use the module from cache if available
        if (!moduleCache.has(id)) {
            const modulePromise = importFunc().then((mod) => {
                // Ensure mod is an object before attempting to spread
                if (typeof mod !== 'object' || mod === null) {
                    // Return a valid StatModule shape with meta
                    return {
                        default: (() => null) as unknown,
                        meta: { id, title: id }
                    } as unknown as StatModule;
                }
                // Wrap module to ensure StatModule shape - cast via unknown to satisfy strict overlap rules
                return {
                    ...(mod as Record<string, unknown>),
                    meta: { id, title: id }
                } as unknown as StatModule;
            });
            moduleCache.set(id, modulePromise);
        }
        const cached = moduleCache.get(id);
        if (!cached) {
            // fallback: re-import if somehow missing (should not happen)
            const fallback = importFunc().then((mod) => {
                if (typeof mod !== 'object' || mod === null) {
                    return {
                        default: (() => null) as unknown,
                        meta: { id, title: id }
                    } as unknown as StatModule;
                }
                return {
                    ...(mod as Record<string, unknown>),
                    meta: { id, title: id }
                } as unknown as StatModule;
            });
            moduleCache.set(id, fallback);
            return fallback;
        }
        return cached;
    };
};

export const statsIndex: readonly StatIndexEntry[] = [
    {
        id: 'ChartStats',
        title: 'Chart Stats',
        loader: createStatLoader('ChartStats', () => import('./chart-stats')),
    },
    {
        id: 'MetricsStats',
        title: 'Metrics Stats',
        loader: createStatLoader('MetricsStats', () => import('./metric-stats')),
    },
] as const;

export const statsById = Object.fromEntries(
    statsIndex.map(stat => [stat.id, stat])
) as Record<string, StatIndexEntry>;