'use client';

import React, { useState, useEffect, useRef, JSX } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';

type Primitive = string | number;
type Renderable = string | number | JSX.Element | null | undefined;

interface ComboboxProps<TOption, TValue extends Primitive = string> {
    value?: TValue | null;
    onValueChange: (v: TValue | null) => void;
    onSearchChange?: (v: string) => void;
    options?: TOption[];
    placeholder?: Renderable;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
    getLabel?: (option: TOption) => Renderable;
    getValue?: (option: TOption) => TValue | undefined;
    renderOption?: (option: TOption) => React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    [key: string]: unknown;
}

const Combobox = <TOption, TValue extends Primitive = string>({
    value,
    onValueChange,
    onSearchChange,
    options = [],
    placeholder = "Sélectionner une option",
    searchPlaceholder = "Rechercher...",
    emptyMessage = "Aucune option trouvée.",
    className = "",
    disabled = false,
    isLoading = false,
    getLabel = (option: TOption) => {
        const o = option as Record<string, unknown>;
        if (typeof o.label === 'string' || typeof o.label === 'number') return o.label as Renderable;
        if (typeof o.name === 'string' || typeof o.name === 'number') return o.name as Renderable;
        return String(option);
    },
    getValue = (option: TOption) => {
        const o = option as Record<string, unknown>;
        const candidate = o.value ?? o.id ?? option;
        return candidate as TValue;
    },
    renderOption,
    open,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onOpenChange = (_newOpen: boolean) => { },
    ...props
}: ComboboxProps<TOption, TValue>) => {
    const [internalOpen, setInternalOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Use controlled open state if provided, otherwise use internal state
    const isOpen = open !== undefined ? open : internalOpen;
    const handleOpenChange = (newOpen: boolean): void => {
        if (onOpenChange) {
            onOpenChange(newOpen);
        } else {
            setInternalOpen(newOpen);
        }

        // Focus input when opening
        if (newOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    // Keep input focused when open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            const interval = setInterval(() => {
                if (document.activeElement !== inputRef.current) {
                    inputRef.current?.focus();
                }
            }, 100);

            return () => clearInterval(interval);
        }
        return () => { };
    }, [isOpen]);

    const selectedOption = options.find((option) => {
        const optVal = getValue(option);
        return optVal !== undefined && value !== undefined && optVal === value;
    });

    const handleSearchValueChange = (newSearchValue: string): void => {
        setSearchValue(newSearchValue);
        if (onSearchChange) {
            onSearchChange(newSearchValue);
        }
    };

    // Check if placeholder indicates loading state
    const isPlaceholderLoading = Boolean(placeholder) && (
        String(placeholder).includes('Chargement') ||
        String(placeholder).includes('Loading') ||
        String(placeholder).includes('...')
    );

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between",
                        !value && "text-muted-foreground",
                        className
                    )}
                    {...(props as Record<string, unknown>)}
                >
                    <span className="flex items-center gap-2">
                        {(isLoading || isPlaceholderLoading) && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {selectedOption ? getLabel(selectedOption) : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command key={`command-${options.length}`} shouldFilter={false}>
                    <CommandInput
                        ref={inputRef}
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onValueChange={handleSearchValueChange}
                        autoFocus={true}
                    />
                    <CommandList>
                        <CommandEmpty>
                            <div className="flex items-center justify-center gap-2 py-2">
                                {(emptyMessage.includes('cours') || emptyMessage.includes('Recherche')) && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                {emptyMessage}
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option, index) => {
                                const optVal = getValue(option);
                                const key = (optVal !== undefined ? String(optVal) : `opt-${index}`);
                                return (
                                    <CommandItem
                                        key={key}
                                        onSelect={() => {
                                            onValueChange(optVal ?? null);
                                            handleOpenChange(false);
                                            setSearchValue(''); // Clear search after selection
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value !== undefined && optVal === value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {renderOption ? renderOption(option) : getLabel(option)}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export { Combobox };