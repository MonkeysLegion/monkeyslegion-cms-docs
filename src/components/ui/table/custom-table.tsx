import CustomTablePagination from '@/components/custom/data-table/custom-table-pagination';
import { CustomTableToolbar } from '@/components/custom/data-table/custom-table-toolbar';
import { CustomTableProps } from '@/components/custom/data-table/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useCustomTable } from '@/hooks/use-custom-table';
import { IconLoader } from '@tabler/icons-react';
import React, { useEffect, useState, ChangeEvent, JSX } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

const CustomTable = <T extends { id: string | number } & Record<string, unknown>>({
  url,
  preFilled,
  columns,
  filters,
  bulkActions = [],
  onInit,
}: CustomTableProps<T>): JSX.Element => {
  const table = useCustomTable<T>(url, columns, bulkActions, preFilled);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    if (onInit) {
      onInit(table);
    }
  }, []);

  useEffect(() => {
    setShowBulkActions(table.selectedRows.length > 0);
  }, [table.selectedRows]);

  const areAllRowsSelected = table.data.length > 0 &&
    table.data.every(row =>
      table.selectedRows.some(selectedRow => selectedRow.id === row.id)
    );

  return (
    <div className='flex flex-1 flex-col space-y-4'>
      <div className={table.loading ? 'hidden' : ''}>
        <CustomTableToolbar table={table} filters={filters ?? []} />
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && bulkActions.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <span className="text-sm font-medium">{table.selectedRows.length} sélectionné(s)</span>
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => action.action(table.selectedRows, table.refresh)}
                disabled={action.disabled ? action.disabled(table.selectedRows) : false}
                className={`flex items-center rounded-lg shadow-sm gap-1 ${action.className ?? ''}`}
              >
                {action.icon != null && action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Show skeleton when loading */}
      {table.loading && (
        <DataTableSkeleton
          columnCount={table.visibleColumns.length}
          rowCount={table.rowsPerPage}
          filterCount={filters ? Object.keys(filters).length : 0}
          withBulkActions={bulkActions.length > 0}
          withPagination={true}
          withViewOptions={false}
        />
      )}

      {!table.loading && (
        <>
          <div className='relative flex flex-1'>
            {table.loading && (
              <div className='bg-accent absolute inset-0 z-50 flex h-full w-full items-center justify-center rounded-lg border opacity-40'>
                <IconLoader className='animate-spin' />
              </div>
            )}

            <div
              className={`absolute inset-0 flex overflow-hidden rounded-lg border ${table.loading && 'blur-sm'}`}
            >
              <ScrollArea className='h-full w-full'>
                <Table>
                  <TableHeader className='bg-muted sticky top-0 z-10'>
                    <TableRow>
                      {/* Selection checkbox column */}
                      {bulkActions.length > 0 && (
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={areAllRowsSelected}
                            onCheckedChange={(checked) => {
                              const event = {
                                target: { checked: checked === true }
                              } as ChangeEvent<HTMLInputElement>;
                              table.onSelectAllRows(event);
                            }}
                            aria-label="Select all"
                            className="rounded-lg"
                          />
                        </TableHead>
                      )}

                      {table.columns.map((col) => {
                        if (!table.visibleColumns.includes(col.data as string)) return null;

                        const key = String(col.data);
                        const colSpan = typeof col.width !== 'undefined' ? +col.width : 1;

                        return (
                          <TableHead
                            key={key}
                            colSpan={colSpan}
                            className={col.sortable ? 'cursor-pointer hover:bg-muted-foreground/10' : ''}
                            onClick={() => {
                              if (col.sortable) {
                                table.onSort(col.data);
                              }
                            }}
                          >
                            <div className="flex items-center">
                              {col.label}
                              {col.sortable && (
                                <span className="ml-1">
                                  {table.sortBy === col.data && table.sortDir === 'asc' && '▲'}
                                  {table.sortBy === col.data && table.sortDir === 'desc' && '▼'}
                                </span>
                              )}
                            </div>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.data?.length ? (
                      table.data.map((row) => (
                        <TableRow key={row.id}>
                          {/* Row selection checkbox */}
                          {bulkActions.length > 0 && (
                            <TableCell>
                              <Checkbox
                                checked={table.selectedRows.some(
                                  (selectedRow) => selectedRow.id === row.id
                                )}
                                onCheckedChange={(checked) => {
                                  const event = {
                                    target: { checked }
                                  } as ChangeEvent<HTMLInputElement>;
                                  table.onCheckboxChange(event, row);
                                }}
                                aria-label="Select row"
                                className="rounded-lg"
                              />
                            </TableCell>
                          )}

                          {table.columns.map((col) => {
                            if (!table.visibleColumns.includes(col.data as string)) return null;
                            const colKey = `${String(col.data)}-${row.id}`;
                            const span = typeof col.width !== 'undefined' ? +col.width : 1;

                            if (col.render) {
                              return (
                                <TableCell key={colKey} colSpan={span}>
                                  {col.render(row[col.data] as unknown, row, table.refresh)}
                                </TableCell>
                              );
                            }

                            const raw = row[col.data as keyof typeof row] as unknown;
                            let content: React.ReactNode;

                            if (raw === null || raw === undefined) {
                              content = '';
                            } else if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
                              content = String(raw);
                            } else if (React.isValidElement(raw)) {
                              content = raw;
                            } else {
                              // Fallback: stringify object/other types
                              try {
                                content = String(raw);
                              } catch {
                                content = '';
                              }
                            }

                            return (
                              <TableCell key={colKey} colSpan={span}>
                                {content}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={(bulkActions.length > 0 ? 1 : 0) + (table.visibleColumns.length ?? 0)}
                          className='h-24 text-center'
                        >
                          Aucune donnée disponible
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation='horizontal' />
              </ScrollArea>
            </div>
          </div>
          <CustomTablePagination<T> table={table} />
        </>
      )}
    </div>
  );
};

export default CustomTable;