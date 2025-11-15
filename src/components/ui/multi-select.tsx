"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// New typed API
type Primitive = string | number

interface MultiSelectProps<TItem, TValue extends Primitive = string> {
    options: TItem[]
    value?: TValue | TValue[] | null
    // allow undefined to be passed in some flows under strict exactOptionalPropertyTypes
    onValueChange: (v: TValue | TValue[] | null | undefined) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    getLabel?: (item: TItem) => React.ReactNode
    getValue?: (item: TItem) => TValue
    className?: string
    badgeClassName?: string
}

export function MultiSelect<TItem = unknown, TValue extends Primitive = string>({
    options,
    value,
    onValueChange,
    placeholder = "Select items...",
    searchPlaceholder = "Search items...",
    emptyMessage = "No items found.",
    getLabel = (item: TItem) => {
        const it = item as Record<string, unknown>;
        if (typeof it.name === 'string') return it.name;
        if (typeof it.label === 'string') return it.label;
        return String(it);
    },
    getValue = (item: TItem) => {
        const it = item as Record<string, unknown>;
        const candidate = it.id ?? it.value ?? it;
        return (candidate as unknown) as TValue;
    },
    className = "",
    badgeClassName = "",
}: MultiSelectProps<TItem, TValue>) {
    const [open, setOpen] = React.useState<boolean>(false)
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)

    // Local alias with an explicit type including `undefined` to satisfy strict checks
    const currentValue: TValue | TValue[] | null | undefined = value;

    const normalizeValue = React.useCallback((/* was: val: unknown */ val: TValue | TValue[] | null | undefined): TValue[] => {
        if (val === null || val === undefined) return []
        if (Array.isArray(val)) return val as TValue[]
        return [val as TValue]
    }, [])

    const isValueSelected = React.useCallback((itemValue: TValue, currentValue: TValue | TValue[] | null | undefined): boolean => {
        const normalizedValue = normalizeValue(currentValue)
        return normalizedValue.includes(itemValue)
    }, [normalizeValue])

    const selectedItems = React.useMemo(() => {
        if (!Array.isArray(options)) return []
        const normalizedValue = normalizeValue(currentValue)
        return options.filter(item => normalizedValue.includes(getValue(item)))
    }, [value, options, getValue, normalizeValue])

    const handleSelect = React.useCallback((item: TItem): void => {
        const itemValue = getValue(item)
        const isSelected = isValueSelected(itemValue, currentValue)
        const normalizedValue = normalizeValue(currentValue)
        let updatedValue: TValue[] | TValue | null | undefined

        if (isSelected) {
            const filtered = normalizedValue.filter(v => v !== itemValue)
            updatedValue = Array.isArray(value) ? filtered : (filtered.length > 0 ? filtered[0] : null)
        } else {
            if (Array.isArray(value)) {
                updatedValue = [...normalizedValue, itemValue]
            } else {
                updatedValue = itemValue
            }
        }
        onValueChange(updatedValue)
    }, [value, onValueChange, getValue, isValueSelected, normalizeValue, currentValue])

    const handleRemove = React.useCallback((e: React.MouseEvent, itemValue: TValue): void => {
        e.stopPropagation()
        const normalizedValue = normalizeValue(currentValue)
        const filtered = normalizedValue.filter(v => v !== itemValue)

        if (Array.isArray(value)) {
            onValueChange(filtered)
        } else {
            onValueChange(filtered.length > 0 ? filtered[0] : null)
        }
    }, [value, onValueChange, normalizeValue])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full min-h-10 h-auto py-2 px-3", className)}
                >
                    <div className="flex-1 flex flex-wrap gap-1 items-center">
                        {selectedItems.length === 0 ? (
                            <span className="text-muted-foreground hover:text-foreground">{placeholder}</span>
                        ) : selectedItems.length <= 3 ? (
                            <div className="flex flex-wrap gap-1 w-full">
                                {selectedItems.map((item) => {
                                    const itemKey = String(getValue(item))
                                    return (
                                        <Badge
                                            key={itemKey}
                                            variant="secondary"
                                            className={cn("mr-1 mb-1", badgeClassName)}
                                        >
                                            {getLabel(item)}
                                            <button
                                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                onMouseDown={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                                onClick={(e) => handleRemove(e, getValue(item))}
                                            >
                                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        </Badge>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 w-full">
                                <Badge variant="secondary" className={cn("", badgeClassName)}>
                                    {selectedItems.length} sélectionnés
                                </Badge>
                                <button
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onValueChange([] as TValue[])
                                    }}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </div>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0"
                align="start"
                sideOffset={5}
                style={{
                    width: triggerRef.current ? `${triggerRef.current.offsetWidth}px` : 'auto',
                    maxWidth: '100vw'
                }}
            >
                <Command className="w-full">
                    <CommandInput placeholder={searchPlaceholder} className="h-9" />
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                        {options.map((item) => {
                            const itemValue = getValue(item)
                            const isSelected = isValueSelected(itemValue, value)
                            const key = String(itemValue)
                            return (
                                <CommandItem
                                    key={key}
                                    onSelect={() => handleSelect(item)}
                                    className="flex items-center gap-2"
                                >
                                    <div className={cn(
                                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                                    )}>
                                        {isSelected && <Check className="h-3 w-3" />}
                                    </div>
                                    <span>{getLabel(item)}</span>
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
