'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDateRangeFromPreset, presetLabels } from '@/lib/dates';
import { DateRange, Preset } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
    value: DateRange;
    onChangeAction: (range: DateRange) => void;
    className?: string;
}

export function DateRangePicker({ value, onChangeAction, className }: DateRangePickerProps) {
    const handlePresetChange = (preset: Preset) => {
        const newRange = getDateRangeFromPreset(preset);
        onChangeAction(newRange);
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Select value={value.preset} onValueChange={handlePresetChange}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(presetLabels).map(([preset, label]) => (
                        <SelectItem key={preset} value={preset}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}