"use client";
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Controller, type Control, FieldValues } from 'react-hook-form';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import debounce from '@/utils/debounce';
import { imageUrl } from "@/utils/image-url";

/**
 * Local Filter Combobox Component
 * 
 * Usage Examples:
 * 
 * 1. Basic usage with static options:
 * <FilterCombobox
 *   name="category"
 *   label="Category"
 *   options={categories}
 *   control={control}
 *   placeholder="Select category..."
 * />
 * 
 * 2. With avatar rendering:
 * <FilterCombobox
 *   name="user"
 *   label="User"
 *   options={users}
 *   control={control}
 *   renderAvatar={true}
 *   avatarImageKey="avatar"
 *   labelKey="full_name"
 *   valueKey="user_id"
 * />
 * 
 * 3. Without form control (standalone):
 * <FilterCombobox
 *   value={selectedValue}
 *   onValueChange={setSelectedValue}
 *   options={options}
 *   placeholder="Choose option..."
 * />
 */

export interface FilterComboboxOption {
    name: string;
    id: number | string;
    image?: string | null;
}

// New typed props
interface FilterComboboxProps {
    name?: string;
    label?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    control?: Control<FieldValues> | null;
    onValueChange?: (value: string | number | null) => void;
    error?: string | null;
    options?: FilterComboboxOption[];
    disabled?: boolean;
    className?: string;
    labelKey?: keyof FilterComboboxOption & string;
    valueKey?: keyof FilterComboboxOption & string;
    renderAvatar?: boolean;
    avatarImageKey?: keyof FilterComboboxOption & string;
    avatarFallbackBg?: string;
    value?: string | number | null;
    showLabel?: boolean;
}

const FilterCombobox = ({
    name,
    label,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyMessage = "No options found.",
    control,
    onValueChange,
    error,
    options = [
        { id: 1, name: "Sample Option 1", image: null },
        { id: 2, name: "Sample Option 2", image: null },
        { id: 3, name: "Sample Option 3", image: null }
    ],
    disabled = false,
    className = "",
    labelKey = "name" as keyof FilterComboboxOption & string,
    valueKey = "id" as keyof FilterComboboxOption & string,
    renderAvatar = false,
    avatarImageKey = "image" as keyof FilterComboboxOption & string,
    avatarFallbackBg = "bg-gray-500",
    value,
    showLabel = true
}: FilterComboboxProps) => {
    const [filteredOptions, setFilteredOptions] = useState<FilterComboboxOption[]>(options);

    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);

    // Debounced search function
    const debouncedSearch = useMemo(() =>
        debounce((query: string) => {
            if (!query || query.trim() === '') {
                setFilteredOptions(options);
                return;
            }

            const lowerQuery = query.toLowerCase();
            const filtered = options.filter(option => {
                const labelVal = option[labelKey];
                return String(labelVal ?? '').toLowerCase().includes(lowerQuery);
            });
            setFilteredOptions(filtered);
        }, 300),
        [options, labelKey]
    );

    const handleSearch = useCallback((query: string) => {
        debouncedSearch(query);
    }, [debouncedSearch]);

    const renderOption = useCallback((item: FilterComboboxOption) => (
        <div className="flex items-center gap-2">
            {renderAvatar && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage
                        src={imageUrl(item.image ?? '')}
                        alt={String(item[labelKey] ?? '')}
                    />
                    <AvatarFallback className={`text-xs font-semibold ${avatarFallbackBg} text-white flex items-center justify-center w-full h-full`}>
                        {String(item[labelKey] ?? '')?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                </Avatar>
            )}
            <span>{String(item[labelKey] ?? '')}</span>
        </div>
    ), [renderAvatar, avatarImageKey, labelKey, avatarFallbackBg]);

    const normalizeValue = useCallback((val: string | number | null | undefined) => val ?? '', []);
    const handleValueChange = useCallback((newValue: string | number | null) => {
        onValueChange?.(newValue ?? null);
        return newValue;
    }, [onValueChange]);

    // If used without form control
    if (!control) {
        return (
            <div className={className}>
                {showLabel && label && (
                    <Label className="text-sm font-medium mb-2 block">
                        {label}
                    </Label>
                )}
                <Combobox
                    value={normalizeValue(value)}
                    onValueChange={handleValueChange}
                    onSearchChange={handleSearch}
                    options={filteredOptions}
                    placeholder={placeholder}
                    searchPlaceholder={searchPlaceholder}
                    emptyMessage={emptyMessage}
                    getLabel={(item: FilterComboboxOption) => String(item[labelKey] ?? '')}
                    getValue={(item: FilterComboboxOption) => (item[valueKey] as unknown) as string | number}
                    renderOption={renderOption}
                    disabled={disabled}
                />
                {error && (
                    <p className="text-destructive text-sm error-p mt-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className={className}>
            {showLabel && (
                <Label htmlFor={name} className="text-sm font-medium mb-2 block">
                    {label}
                </Label>
            )}
            <Controller
                name={name ?? ''}
                control={control}
                render={({ field }) => (
                    <Combobox
                        value={normalizeValue(field.value)}
                        onValueChange={(v: string | number | null) => {
                            const processedValue = handleValueChange(v);
                            field.onChange(processedValue);
                        }}
                        onSearchChange={handleSearch}
                        options={filteredOptions}
                        placeholder={placeholder}
                        searchPlaceholder={searchPlaceholder}
                        emptyMessage={emptyMessage}
                        getLabel={(item: FilterComboboxOption) => String(item[labelKey] ?? '')}
                        getValue={(item: FilterComboboxOption) => (item[valueKey] as unknown) as string | number}
                        renderOption={renderOption}
                        disabled={disabled}
                    />
                )}
            />
            {error && (
                <p className="text-destructive text-sm error-p mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FilterCombobox;
