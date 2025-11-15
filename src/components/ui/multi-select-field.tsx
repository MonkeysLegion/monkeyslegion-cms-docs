"use client"
import React, { useEffect, useState, useCallback } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import useApi from "@/hooks/use-api";

interface OptionItem {
    [key: string]: unknown;
    id: number | string;
    name: string;
}

interface MultiSelectFieldProps {
    value?: (string | number)[];
    onValueChange?: (value: string | number | (string | number)[] | null | undefined) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
    apiRoute?: string | null;
    labelKey?: string;
    valueKey?: string;
    fallbackData?: OptionItem[];
    [key: string]: unknown;
}

/**
 * General Multi-Select Field Component
 * 
 * Usage Examples:
 * 
 * 1. With API endpoint:
 * <MultiSelectField
 *   value={selectedTags}
 *   onValueChange={setSelectedTags}
 *   apiRoute="/api/tags"
 *   placeholder="Select tags..."
 *   labelKey="name"
 *   valueKey="id"
 * />
 * 
 * 2. With React Hook Form (pass values directly):
 * const { watch, setValue } = useForm();
 * const tags = watch('tags');
 * 
 * <MultiSelectField
 *   value={tags}
 *   onValueChange={(val) => setValue('tags', val)}
 *   apiRoute="/api/categories"
 *   placeholder="Select categories..."
 * />
 * 
 * 3. With fallback data (no API):
 * <MultiSelectField
 *   value={selected}
 *   onValueChange={setSelected}
 *   fallbackData={[{id: 1, name: "Option 1"}, {id: 2, name: "Option 2"}]}
 *   placeholder="Select options..."
 * />
 * 
 * 4. Standalone usage:
 * const [selected, setSelected] = useState([]);
 * 
 * <MultiSelectField
 *   value={selected}
 *   onValueChange={setSelected}
 *   apiRoute="/api/items"
 * />
 */

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
    value = [],
    onValueChange,
    placeholder = "Select options...",
    searchPlaceholder = "Search...",
    emptyMessage = "No options found.",
    className = "",
    apiRoute = null,
    labelKey = "name",
    valueKey = "id",
    fallbackData = [
        { id: 1, name: "Sample Option 1" },
        { id: 2, name: "Sample Option 2" },
        { id: 3, name: "Sample Option 3" }
    ],
    ...props
}) => {
    const { trigger } = useApi();
    const [options, setOptions] = useState<OptionItem[]>(fallbackData);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleValueChange = (v: string | number | (string | number)[] | null | undefined) => {
        let normalized: (string | number)[] = [];
        if (v == null) {
            normalized = [];
        } else if (Array.isArray(v)) {
            normalized = v as (string | number)[];
        } else {
            normalized = [v as string | number];
        }
        onValueChange?.(normalized);
    };

    const fetchOptions = useCallback(
        async (): Promise<void> => {
            if (!apiRoute) {
                // Use fallback data when no API route provided
                setOptions(fallbackData);
                return;
            }

            setIsLoading(true);
            try {
                const { data } = await trigger<{ data: OptionItem[] }>(apiRoute);
                const apiData = Array.isArray(data?.data) ? (data?.data as OptionItem[]) : fallbackData;
                setOptions(apiData);
            } catch (e) {
                console.warn("API failed, using fallback data:", e);
                setOptions(fallbackData);
            } finally {
                setIsLoading(false);
            }
        },
        [apiRoute, fallbackData, trigger]
    );

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    return (
        <MultiSelect<OptionItem, string | number>
            options={options}
            value={value}
            onValueChange={handleValueChange}
            placeholder={isLoading ? "Loading..." : placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={isLoading ? "Loading..." : emptyMessage}
            getLabel={(item: OptionItem) => String(item[labelKey] ?? '')}
            getValue={(item: OptionItem) => (item[valueKey] as string | number)}
            className={className}
            {...(props as Record<string, unknown>)}
        />
    );
};

export default MultiSelectField;