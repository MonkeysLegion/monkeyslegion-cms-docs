// lib/dates.ts
import { DateRange, Preset } from './types';

export const presetToDays: Record<Exclude<Preset, 'custom'>, number> = {
    '3d': 3,
    '7d': 7,
    '1m': 30,
    '3m': 90,
    '1y': 365,
};

export const presetLabels: Record<Preset, string> = {
    '3d': 'Last 3 days',
    '7d': 'Last 7 days',
    '1m': 'Last month',
    '3m': 'Last 3 months',
    '1y': 'Last year',
};

export function getDateRangeFromPreset(preset: Preset): DateRange {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - presetToDays[preset]);

    return { start, end, preset };
}

export function formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0] ?? '';
}

export function getDateRangePayload(range: DateRange): { start_date: string; end_date: string } {
    return {
        start_date: formatDateForAPI(range.start),
        end_date: formatDateForAPI(range.end),
    };
}