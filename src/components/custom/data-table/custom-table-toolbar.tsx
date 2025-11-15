'use client';

import { CustomDataTableSelect } from '@/components/custom/data-table/custom-datatable-select';
import { CustomTableFilterConfig, UseCustomTableReturnType } from '@/components/custom/data-table/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Check, Settings2, X } from 'lucide-react';
import React from 'react';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

interface CustomTableToolbarProps<TData extends Record<string, unknown>>
  extends React.ComponentProps<'div'> {
  table: UseCustomTableReturnType<TData>;
  filters?: CustomTableFilterConfig[];
}

export function CustomTableToolbar<TData extends Record<string, unknown>>({
  table,
  filters = [],
  className,
  ...props
}: CustomTableToolbarProps<TData>): React.JSX.Element {

  const defaultValues = useMemo(() => {
    return filters.reduce<Record<string, unknown>>((acc, filter) => {
      acc[filter.field] = filter.defaultValue ?? (filter.type === 'datatable-multiselect' ? [] : '');
      return acc;
    }, {});
  }, [filters]);

  const filterSchema = useMemo(() => {
    const schema: Record<string, z.ZodTypeAny> = {};
    filters.forEach((filter) => {
      switch (filter.type) {
        case 'text':
          schema[filter.field] = z.string().nullable().optional();
          break;
        case 'number':
          schema[filter.field] = z.union([z.number(), z.string()]).nullable().optional();
          break;
        case 'date':
        case 'datetime':
          schema[filter.field] = z.string().nullable().optional();
          break;
        case 'select':
        case 'datatable-select':
          schema[filter.field] = z.any().nullable().optional();
          break;
        case 'datatable-multiselect':
          schema[filter.field] = z.array(z.any()).optional();
          break;
        case 'checkbox':
          schema[filter.field] = z.boolean().nullable().optional();
          break;
        case 'custom':
          schema[filter.field] = z.any().nullable().optional();
          break;
        default:
          schema[filter.field] = z.any().nullable().optional();
      }
    });
    return z.object(schema);
  }, [filters]);

  const methods = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, control } = methods;

  const handleApplyFilters = handleSubmit((values) => {
    table.onFilter(values);
  });

  const handleResetFilters = (): void => {
    reset(defaultValues);
    table.onFilter({});
  };

  const isFiltered = useMemo(() => {
    return Object.values(table.filters).some(
      (v) => {
        if (Array.isArray(v)) {
          return v.length > 0;
        }
        return v !== '' && v !== null && v !== undefined;
      }
    );
  }, [table.filters]);

  const renderFilter = (filter: CustomTableFilterConfig) => {
    const name = filter.field as never;

    switch (filter.type) {
      case 'text':
      case 'number':
        return (
          <FormField
            control={control}
            name={name}
            render={({ field }) => (
              <Input
                {...field}
                type={filter.type}
                placeholder={filter.label}
                value={field.value || ''}
                onChange={(e) => {
                  const newValue = e;
                  field.onChange(newValue);
                  filter.onChange?.(newValue, methods);
                }}
              />
            )}
          />
        );
      case 'date':
        return (
          <FormField
            control={control}
            name={name}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value), "PPP", { locale: fr }) : <span>{filter.label}</span>}
                    {field.value && (
                      <span
                        className="ml-auto flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange(null);
                        }}
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-red-500 cursor-pointer" />
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date instanceof Date && !isNaN(date.getTime())) {
                        field.onChange(date.toLocaleString('sv-SE'));
                      } else {
                        field.onChange(null);
                      }
                    }}
                    captionLayout="dropdown"
                    showOutsideDays={true}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        );
      case 'datetime':
        return (
          <FormField
            control={control}
            name={name}
            render={({ field }) => (
              <div className="relative space-x-4">
                <DateTimePicker
                  date={field.value ? new Date(field.value) : new Date()}
                  setDate={(date) => {
                    if (date instanceof Date && !isNaN(date.getTime())) {
                      field.onChange(date.toLocaleString('sv-SE'));
                    } else {
                      field.onChange(null);
                    }
                  }}
                  placeholder={filter.label}
                />
                {field.value && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange(null);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-red-500" />
                  </Button>
                )}
              </div>
            )}
          />
        );
      case 'select':
        return (
          filter.options?.length && (
            <FormField
              control={control}
              name={name}
              render={({ field }) => {
                // Create a component wrapper to properly use React hooks
                const SelectFilter = () => {
                  const currentOption = filter.options?.find((option) => String(option.value) === field.value);
                  const isValidValue = field.value && field.value !== "null" && currentOption;

                  // Now useEffect is at the top level of a component
                  React.useEffect(() => {
                    if (field.value && field.value !== "null" && !currentOption) {
                      field.onChange(null);
                      filter.onChange?.(null, methods);
                    }
                  }, [field.value, currentOption]);

                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !isValidValue && "text-muted-foreground"
                          )}
                        >
                          {isValidValue
                            ? currentOption?.label
                            : filter.label}
                          <Settings2 className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder={`Rechercher ${(filter.label || '').toLowerCase()}...`} />
                          <CommandList>
                            <CommandEmpty>Aucune option trouvée.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  field.onChange(null);
                                  filter.onChange?.(null, methods);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    (!field.value || field.value === "null") ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Tous
                              </CommandItem>
                              {filter.options?.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  onSelect={() => {
                                    const value = String(option.value);
                                    field.onChange(value);
                                    filter.onChange?.(value, methods);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === String(option.value) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {option.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  );
                };

                return <SelectFilter />;
              }}
            />
          )
        );

      case 'checkbox':
        return (
          <FormField
            control={control}
            name={name}
            render={({ field }) => (
              <FormItem className='flex items-center space-x-2'>
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id={filter.field}
                  />
                </FormControl>
                <FormLabel htmlFor={filter.field}>{filter.label}</FormLabel>
              </FormItem>
            )}
          />
        );

      case 'datatable-select':
      case 'datatable-multiselect':
        return <CustomDataTableSelect filter={filter} form={methods} />;

      case 'custom':
        return (
          <FormField
            control={control}
            name={name}
            render={({ field }) => {
              if (filter.component) {
                return filter.component({
                  control,
                  field,
                  onChange: (value: unknown) => {
                    field.onChange(value);
                    filter.onChange?.(value, methods);
                  },
                  value: field.value,
                  form: methods,
                }) as React.ReactElement;
              }

              return <div />;
            }}
          />
        );

      default:
        return filter.render?.(methods) ?? null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div
        role='toolbar'
        aria-orientation='horizontal'
        className={cn('flex w-full items-start justify-between gap-2 p-1', className)}
        {...props}
      >
        <div className='flex justify-center gap-4'>
          {filters.map((filter) => (
            <div key={filter.field} className='relative'>
              {renderFilter(filter)}
            </div>
          ))}

          {filters.length > 0 && isFiltered && (
            <Button
              aria-label='Reset filters'
              variant='outline'
              size='sm'
              className='border-dashed'
              onClick={handleResetFilters}
            >
              <X className='mr-2 h-4 w-4' />
              Effacer
            </Button>
          )}

          {filters.length > 0 && (
            <Button aria-label='Apply filters' size='sm' id="apply-filter" onClick={handleApplyFilters}>
              Appliquer
            </Button>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                aria-label='Toggle columns'
                role='combobox'
                variant='outline'
                size='sm'
                className='ml-auto hidden h-8 lg:flex'
              >
                <Settings2 className='mr-2 h-4 w-4' />
                Colonnes
              </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-44 p-0'>
              <Command>
                <CommandInput placeholder="Rechercher une colonne" />
                <CommandList>
                  <CommandEmpty>Aucune donnée</CommandEmpty>
                  <CommandGroup>
                    {table.columns.map((column) => (
                      <CommandItem
                        key={String(column.data)}
                        onSelect={() => {
                          const { data } = column;
                          const isVisible = table.visibleColumns.includes(data as keyof TData);
                          const newCols = isVisible
                            ? table.visibleColumns.filter((c) => c !== data)
                            : [...table.visibleColumns, data as keyof TData];
                          table.setVisibleColumns(newCols);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            table.visibleColumns.includes(column.data as keyof TData)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <span className='truncate'>{column.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </FormProvider>
  );
}