import React from 'react';
import { Control, FieldValues } from 'react-hook-form';

export interface CustomTableFilterConfig {
  field: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'datetime' | 'select' | 'checkbox' | 'datatable-select' | 'datatable-multiselect' | 'custom';
  // option values used in UI as keys/sets — constrain to string | number
  options?: Array<{ value: string | number; label: string }>;
  defaultValue?: unknown;
  onChange?: (value: unknown, form?: unknown) => void;
  render?: (form: unknown) => React.ReactNode;
  component?: (props: {
    control: Control;
    field: FieldValues;
    onChange: (value: unknown) => void;
    value: unknown;
    form: unknown;
  }) => React.ReactNode;
}

export interface CustomTableColumn<T> {
  data: keyof T | string;
  label: string;
  sortable: boolean;
  render?: (value: unknown, row: T, refresh: () => Promise<void>) => React.ReactNode;
  width?: number;
}

export interface CustomTableBulkAction<T> {
  label: string;
  icon: React.ReactNode;
  className?: string;
  // action may call an async refresh
  action: (selected: T[], refresh: () => Promise<void>) => void | Promise<void>;
  disabled?: (selected: T[]) => boolean;
}

export interface ToolbarAction {
  label: string;
  icon: string;
  onClick: () => void;
  showOnDesktop?: boolean;
  showOnMobileFab?: boolean;
  color?: string;
  disabled?: boolean;
}

export interface ExternalAction<T> {
  label: string;
  icon: string;
  onClick: (row: T, refresh: () => Promise<void>) => void | Promise<void>;
  disabled?: (row: T) => boolean;
  color?: string;
  showOnSelected?: boolean;
  refresh?: () => void;
}

export interface CustomTableTableState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pages: number;
  currentPage: number;
  rowsPerPage: number;
  recordCount: number;
  sortBy: keyof T | null;
  sortDir: 'asc' | 'desc';
  selectedRows: T[];
  visibleColumns: (keyof T)[];
  filters: Record<string, unknown>;
}

export interface CustomTableProps<T extends Record<string, unknown>> {
  url: string;
  preFilled?: Record<string, unknown>;
  columns: CustomTableColumn<T>[];
  bulkActions?: CustomTableBulkAction<T>[];
  toolbarActions?: ToolbarAction[];
  externalActions?: ExternalAction<T>[];
  initialState?: Partial<CustomTableTableState<T>>;
  title?: string;
  titleExtra?: React.ReactNode;
  onInit?: (tableInstance: UseCustomTableReturnType<T>) => void;
  onReset?: () => void;
  onSubmit?: (values: unknown) => void;
  filters?: CustomTableFilterConfig[];
  sortBy?: keyof T;
  sortDir?: 'asc' | 'desc';
}

export interface UseTableReturn<T> extends CustomTableTableState<T> {
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setVisibleColumns: (columns: (keyof T)[]) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  onSort: (column: keyof T) => void;
  onSelect: (event: React.ChangeEvent<HTMLInputElement>, row: T) => void;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  refresh: () => Promise<void>;
}

export type UseCustomTableReturnType<T extends Record<string, unknown>> = {
  data: T[];
  loading: boolean;
  error: string | null;
  pages: number;
  currentPage: number;
  rowsPerPage: number;
  recordCount: number;
  sortBy: keyof T | null;
  sortDir: 'asc' | 'desc';
  selectedRows: T[];
  visibleColumns: (keyof T)[];
  filters: Record<string, unknown>;
  columns: CustomTableColumn<T>[];
  bulkActions: CustomTableBulkAction<T>[];
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement> | { target: { checked: boolean } }, row: T) => void;
  onSelectAllRows: (event: React.ChangeEvent<HTMLInputElement> | { target: { checked: boolean } }) => void;
  onSort: (column: keyof T) => void;
  onFilter: (filterData: FieldValues) => void;
  setVisibleColumns: (columns: (keyof T)[]) => void;
  refresh: () => Promise<void>;
};