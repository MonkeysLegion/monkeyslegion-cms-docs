"use client"
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import useApi from '@/hooks/use-api';
import { imageUrl } from '@/utils/image-url';
import { SafeString } from '@/utils/safe-string';

interface OptionItem {
    [key: string]: unknown;
    id: number | string;
    name: string;
    image?: string | null;
}

interface SearchComboboxProps {
    name?: string;
    label?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    control?: Control<FieldValues>;
    onValueChange?: (value: string | number | null) => void;
    error?: string;
    apiRoute?: string | null;
    searchLimit?: number;
    searchColumn?: string;
    searchParams?: Record<string, unknown>;
    disabled?: boolean;
    className?: string;
    debounceMs?: number;
    labelKey?: string;
    valueKey?: string;
    renderAvatar?: boolean;
    avatarImageKey?: string;
    avatarFallbackBg?: string;
    currentValue?: string | number | null;
    showLabel?: boolean;
    fallbackData?: OptionItem[];
    value?: string | number | null;
}

/**
 * API Search Combobox Component
 * 
 * Usage Examples:
 * 
 * 1. Basic API search:
 * <SearchCombobox
 *   name="client_id"
 *   label="Client"
 *   control={control}
 *   apiRoute="/api/clients/search"
 *   searchColumn="name"
 *   placeholder="Select client..."
 * />
 * 
 * 2. With avatar and custom keys:
 * <SearchCombobox
 *   name="user_id"
 *   label="User"
 *   control={control}
 *   apiRoute="/api/users/search"
 *   renderAvatar={true}
 *   labelKey="full_name"
 *   valueKey="user_id"
 *   avatarImageKey="profile_pic"
 * />
 * 
 * 3. With fallback data (when API fails):
 * <SearchCombobox
 *   name="category"
 *   label="Category"
 *   control={control}
 *   apiRoute="/api/categories/search"
 *   fallbackData={[{id: 1, name: "Default Category"}]}
 * />
 * 
 * 4. Standalone without form control:
 * <SearchCombobox
 *   value={selectedValue}
 *   onValueChange={setSelectedValue}
 *   apiRoute="/api/items/search"
 *   placeholder="Search items..."
 * />
 */

// Debounce utility function (preserve parameter types)
function debounce<Args extends unknown[]>(
    func: (...args: Args) => unknown,
    wait: number
): (...args: Args) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(...args: Args) {
        const later = () => {
            clearTimeout(timeout);
            // call with preserved args
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (func as any)(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const SearchCombobox: React.FC<SearchComboboxProps> = ({
    name = "item_id",
    label = "Item",
    placeholder = "Select item...",
    searchPlaceholder = "Search...",
    emptyMessage = "No items found.",
    control,
    onValueChange,
    error,
    apiRoute = null,
    searchLimit = 10,
    searchColumn = 'name',
    searchParams = {},
    disabled = false,
    className = "",
    debounceMs = 300,
    labelKey = "name",
    valueKey = "id",
    renderAvatar = false,
    avatarImageKey = "image",
    avatarFallbackBg = "bg-blue-500",
    currentValue = null,
    showLabel = true,
    fallbackData = [
        { id: 1, name: "Sample Item 1", image: null },
        { id: 2, name: "Sample Item 2", image: null },
        { id: 3, name: "Sample Item 3", image: null }
    ],
    value
}) => {
    const { trigger } = useApi();
    const [options, setOptions] = useState<OptionItem[]>(fallbackData);
    const [selectedItem, setSelectedItem] = useState<OptionItem | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const loadedCurrentValueRef = useRef<string | number | null>(null);
    const initialLoadedRef = useRef<boolean>(false);

    // Load current item if provided
    useEffect(() => {
        const valueToLoad = currentValue || value;
        if (valueToLoad && !initialLoadedRef.current && loadedCurrentValueRef.current !== valueToLoad) {
            const loadCurrentItem = async (): Promise<void> => {
                if (!apiRoute) {
                    // Find in fallback data
                    const fallbackItem = fallbackData.find(item => `${item[valueKey]}` === `${valueToLoad}`);
                    if (fallbackItem) {
                        setSelectedItem(fallbackItem);
                        setOptions([fallbackItem, ...fallbackData.filter(item => item[valueKey] !== valueToLoad)]);
                    }
                    initialLoadedRef.current = true;
                    return;
                }

                setIsLoading(true);
                try {
                    const { data, error } = await trigger<{ data: OptionItem[] }>(apiRoute, {
                        method: 'GET',
                        params: {
                            limit: 1,
                            [searchColumn]: valueToLoad,
                            ...searchParams
                        }
                    });

                    const apiData = (data?.data ?? []) as OptionItem[];
                    if (apiData.length > 0) {
                        const itemData = apiData[0];
                        setSelectedItem(typeof itemData !== 'undefined' ? itemData : null);

                        if (itemData !== null && itemData !== undefined) {
                            setOptions([itemData, ...fallbackData]);
                        } else {
                            setOptions(fallbackData);
                        }
                        loadedCurrentValueRef.current = valueToLoad;
                        initialLoadedRef.current = true;
                    } else {
                        setOptions(fallbackData);
                    }

                    if (error) {
                        console.warn('Failed to load current item, using fallback:', error);
                        setOptions(fallbackData);
                    }
                } catch (err) {
                    console.warn('Failed to load current item, using fallback:', err);
                    setOptions(fallbackData);
                } finally {
                    setIsLoading(false);
                }
            };

            loadCurrentItem();
        }
    }, [currentValue, value, valueKey, apiRoute, searchColumn, searchParams, fallbackData, trigger]);

    // debounced function will accept a single string argument (the query)
    const debouncedSearchRef = useRef<((query: string) => void) | null>(null);

    useEffect(() => {
        debouncedSearchRef.current = debounce(async (query: string) => {
            if (!apiRoute) {
                // Filter fallback data locally
                if (!query || query.length < 2) {
                    setOptions(selectedItem ? [selectedItem, ...fallbackData.filter(item => item[valueKey] !== selectedItem[valueKey])] : fallbackData);
                } else {
                    const filtered = fallbackData.filter(item =>
                        String(item[labelKey] ?? '').toLowerCase().includes(query.toLowerCase())
                    );
                    setOptions(selectedItem && !filtered.find(item => item[valueKey] === selectedItem[valueKey])
                        ? [selectedItem, ...filtered]
                        : filtered
                    );
                }
                setIsSearching(false);
                return;
            }

            if (!query || query.length < 2) {
                if (query.length === 0) {
                    setOptions(selectedItem ? [selectedItem, ...fallbackData] : fallbackData);
                }
                setIsSearching(false);
                return;
            }

            try {
                const { data, error } = await trigger<{ data: OptionItem[] }>(apiRoute, {
                    method: 'GET',
                    params: {
                        limit: searchLimit,
                        [searchColumn]: query,
                        ...searchParams
                    }
                });

                const apiData = (data?.data ?? []) as OptionItem[];
                if (apiData.length > 0) {
                    setOptions(apiData);
                } else {
                    const filtered = fallbackData.filter(item =>
                        String(item[labelKey] ?? '').toLowerCase().includes(query.toLowerCase())
                    );
                    setOptions(filtered);
                }

                if (error) {
                    console.warn('Search error, using fallback data:', error);
                    const filtered = fallbackData.filter(item =>
                        String(item[labelKey] ?? '').toLowerCase().includes(query.toLowerCase())
                    );
                    setOptions(filtered);
                }
            } catch (err) {
                console.warn('Search request failed, using fallback data:', err);
                const filtered = fallbackData.filter(item =>
                    String(item[labelKey] ?? '').toLowerCase().includes(query.toLowerCase())
                );
                setOptions(filtered);
            } finally {
                setIsSearching(false);
            }
        }, debounceMs) as (query: string) => void;
    }, [apiRoute, searchLimit, searchColumn, searchParams, debounceMs, selectedItem, fallbackData, labelKey, valueKey, trigger]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        if (query && query.length >= 1) {
            setIsSearching(true);
        }
        debouncedSearchRef.current?.(query);
    }, []);

    const renderItemOption = useCallback((item: OptionItem) => (
        <div className="flex items-center gap-2">
            {renderAvatar && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage
                        src={imageUrl(String(item[avatarImageKey] ?? ''))}
                        alt={String(item[labelKey] ?? '')}
                    />
                    <AvatarFallback className={`text-xs font-semibold ${avatarFallbackBg} text-white flex items-center justify-center w-full h-full`}>
                        {String(item[labelKey] ?? '').charAt(0)?.toUpperCase() || 'I'}
                    </AvatarFallback>
                </Avatar>
            )}
            <span>{typeof item[labelKey] === 'string' ? item[labelKey] : ''}</span>
        </div>
    ), [renderAvatar, avatarImageKey, labelKey, avatarFallbackBg]);

    const normalizeValue = useCallback((val: string | number | null | undefined): string | number => {
        return typeof val === 'string' ? val : (typeof val === 'number' ? val : '');
    }, []);

    const handleValueChange = useCallback((newValue: string | number | null) => {
        onValueChange?.(newValue);
        return newValue;
    }, [onValueChange]);

    const getEmptyMessage = (): string => {
        if (isLoading || isSearching) {
            return "Searching...";
        }
        if (searchQuery && searchQuery.length > 0 && searchQuery.length < 2) {
            return "Type at least 2 characters";
        }
        return emptyMessage;
    };

    const getPlaceholder = (): string => {
        if (isLoading) {
            return "Loading...";
        }
        return placeholder;
    };

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
                    onValueChange={(newValue: string | number | null) => {
                        const processedValue = handleValueChange(newValue);
                        const newSelectedItem = options.find(opt => `${opt[valueKey]}` === `${newValue}`);
                        // ensure we pass OptionItem | null (cast to satisfy TS)
                        setSelectedItem((newSelectedItem ?? null) as OptionItem | null);
                        return processedValue;
                    }}
                    onSearchChange={handleSearch}
                    options={options}
                    placeholder={getPlaceholder()}
                    searchPlaceholder={searchPlaceholder}
                    emptyMessage={getEmptyMessage()}
                    getLabel={(item: OptionItem) => String(item[labelKey] ?? '')}
                    getValue={(item: OptionItem) => item[valueKey] as string | number}
                    renderOption={renderItemOption}
                    disabled={disabled || isLoading}
                />
                {typeof error === 'string' && (
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
                name={name}
                control={control}
                defaultValue={currentValue}
                render={({ field }) => {
                    const activeFieldValue = field.value;

                    const finalOptions = ((): OptionItem[] => {
                        const currentOptions = [...options];

                        if (selectedItem && `${selectedItem[valueKey]}` === `${activeFieldValue}`) {
                            const existsInOptions = currentOptions.find(opt => `${opt[valueKey]}` === `${activeFieldValue}`);
                            if (!existsInOptions) {
                                currentOptions.unshift(selectedItem);
                            }
                        }

                        return currentOptions;
                    })();

                    return (
                        <Combobox
                            value={normalizeValue(field.value)}
                            onValueChange={(value: string | number | null) => {
                                const processedValue = handleValueChange(value);
                                field.onChange(processedValue);

                                const newSelectedItem = options.find(opt => `${opt[valueKey]}` === `${value}`);
                                setSelectedItem((newSelectedItem ?? null) as OptionItem | null);
                            }}
                            onSearchChange={handleSearch}
                            options={finalOptions}
                            placeholder={getPlaceholder()}
                            searchPlaceholder={searchPlaceholder}
                            emptyMessage={getEmptyMessage()}
                            getLabel={(item: OptionItem) => String(item[labelKey] ?? '')}
                            getValue={(item: OptionItem) => item[valueKey] as string | number}
                            renderOption={renderItemOption}
                            disabled={disabled || isLoading}
                        />
                    );
                }}
            />
            <p className={`text-destructive text-sm ${name}-error error-p mt-1`}>
                {SafeString(error, '')}
            </p>
        </div>
    );
};

export default SearchCombobox;
