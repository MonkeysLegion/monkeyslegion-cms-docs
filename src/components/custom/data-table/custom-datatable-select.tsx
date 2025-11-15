'use client';

import {
  CustomTableFilterConfig,
} from '@/components/custom/data-table/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Check, PlusCircle, X } from 'lucide-react';
import { JSX, useCallback, useEffect, useState } from 'react';
import { FieldValues, FormProps, UseFormReturn } from 'react-hook-form';

interface DataTableSelectFilterProps {
  filter: CustomTableFilterConfig;
  form: UseFormReturn<FieldValues> & FormProps<FieldValues>;
}

export function CustomDataTableSelect({ filter, form }: DataTableSelectFilterProps): JSX.Element {
  const { field, label, type, options } = filter;
  const { setValue, getValues } = form;
  const isMultiSelect = type === 'datatable-multiselect';

  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<Set<string | number>>(new Set());

  useEffect((): void => {
    const initialValues = getValues(field);
    if (initialValues != null && initialValues != undefined) {
      setSelectedValues(
        isMultiSelect
          ? new Set(Array.isArray(initialValues) ? initialValues : [])
          : new Set([initialValues].filter(Boolean))
      );
    } else {
      setSelectedValues(new Set());
    }
  }, [field, getValues, isMultiSelect]);

  const onItemSelect = useCallback(
    (option: NonNullable<CustomTableFilterConfig['options']>[number], isSelected: boolean) => {
      if (option == null) return;

      if (isMultiSelect) {
        setSelectedValues((prev) => {
          const newSet = new Set(prev);
          if (isSelected) {
            newSet.delete(option.value);
          } else {
            newSet.add(option.value);
          }
          setValue(field, Array.from(newSet));
          return newSet;
        });
      } else {
        setSelectedValues(new Set(isSelected ? [] : [option.value]));
        setValue(field, isSelected ? undefined : option.value);
        setOpen(false);
      }
    },
    [field, isMultiSelect, setValue]
  );

  const onReset = useCallback(() => {
    setSelectedValues(new Set());
    setValue(field, isMultiSelect ? [] : undefined);
    setOpen(false);
  }, [field, isMultiSelect, setValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='border-dashed'>
          {selectedValues?.size > 0 ? (
            <div
              role='button'
              aria-label={`Clear ${label} filter`}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className='focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:outline-none'
            >
              <X className='h-4 w-4' />
            </div>
          ) : (
            <PlusCircle className='h-4 w-4' />
          )}
          {label}
          {selectedValues?.size > 0 && (
            <>
              <Separator
                orientation='vertical'
                className='mx-0.5 data-[orientation=vertical]:h-4'
              />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedValues.size}
              </Badge>
              <div className='hidden items-center gap-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    ?.filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.value}
                        className='rounded-sm px-1 font-normal'
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[12.5rem] p-0' align='start'>
        <Command>
          <CommandInput placeholder={label} />
          <CommandList className='max-h-full'>
            <CommandEmpty>Aucune donnée</CommandEmpty>
            <CommandGroup className='max-h-[18.75rem] overflow-x-hidden overflow-y-auto'>
              {options?.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onItemSelect(option, isSelected)}
                  >
                    <div
                      className={cn(
                        'border-primary flex size-4 items-center justify-center rounded-sm border',
                        isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className='h-4 w-4' />
                    </div>
                    <span className='truncate'>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={onReset}
                    className='justify-center text-center'
                  >
                    Effacer
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}