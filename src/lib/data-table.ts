import React from 'react';
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant
} from '@/types/data-table';
import type { Column } from '@tanstack/react-table';

import { dataTableConfig } from '@/config/data-table';

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px hsl(var(--border)) inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px hsl(var(--border)) inset'
          : undefined
      : undefined,
    left: typeof isPinned == "string" && isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: typeof isPinned == "string" && isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: typeof isPinned == "string" && isPinned ? 0.97 : 1,
    position: typeof isPinned == "string" && isPinned ? 'sticky' : 'relative',
    background: typeof isPinned == "string" && isPinned ? 'hsl(var(--background))' : 'hsl(var(--background))',
    width: column.getSize(),
    zIndex: typeof isPinned == "string" && isPinned ? 1 : 0
  };
}

export function getFilterOperators(filterVariant: FilterVariant): FilterOperator[] {
  const operatorMap = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators
  } as const;

  const ops = operatorMap[filterVariant] ?? dataTableConfig.textOperators;

  return ops.map((o) => o.value);
}

export function getDefaultFilterOperator(filterVariant: FilterVariant): string {
  const operators = getFilterOperators(filterVariant);

  return operators[0] ?? (filterVariant === 'text' ? 'iLike' : 'eq');
}

export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[]
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === 'isEmpty' ||
      filter.operator === 'isNotEmpty' ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== '' &&
        filter.value !== null &&
        filter.value !== undefined)
  );
}
