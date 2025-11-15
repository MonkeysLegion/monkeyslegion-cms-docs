import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import React from 'react';

interface DataTableSkeletonProps extends React.ComponentProps<'div'> {
  columnCount: number;
  rowCount?: number;
  filterCount?: number;
  cellWidths?: string[];
  withViewOptions?: boolean;
  withPagination?: boolean;
  withBulkActions?: boolean;
  shrinkZero?: boolean;
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  filterCount = 0,
  cellWidths = ['auto'],
  withViewOptions = true,
  withPagination = true,
  withBulkActions = false,
  shrinkZero = false,
  className,
  ...props
}: DataTableSkeletonProps): React.JSX.Element {
  const cozyCellWidths = Array.from(
    { length: columnCount },
    (_, index) => cellWidths[index % cellWidths.length] ?? 'auto'
  );

  // Add checkbox column if bulk actions are enabled
  const totalColumns = withBulkActions ? columnCount + 1 : columnCount;
  const allCellWidths = withBulkActions ? ['50px', ...cozyCellWidths] : cozyCellWidths;

  return (
    <div className={cn('flex flex-1 flex-col space-y-4', className)} {...props}>
      {/* Toolbar Skeleton */}
      <div className='flex w-full items-center justify-between gap-2 overflow-auto p-1'>
        <div className='flex flex-1 items-center gap-2'>
          {filterCount > 0 &&
            Array.from({ length: filterCount }).map((_, i) => (
              <Skeleton key={i} className='h-8 w-[120px] border-dashed rounded-md' />
            ))}
          {filterCount === 0 && <Skeleton className='h-8 w-[200px] rounded-md' />}
        </div>
        <div className='flex items-center gap-2'>
          {withViewOptions && (
            <Skeleton className='ml-auto hidden h-8 w-[80px] lg:flex rounded-md' />
          )}
        </div>
      </div>

      {/* Bulk Actions Skeleton - conditionally rendered */}
      {withBulkActions && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
          <Skeleton className="h-4 w-[100px]" />
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-[80px] rounded-md" />
            <Skeleton className="h-8 w-[90px] rounded-md" />
          </div>
        </div>
      )}

      {/* Table Skeleton */}
      <div className='relative flex flex-1'>
        <div className='absolute inset-0 flex overflow-hidden rounded-lg border'>
          <div className='h-full w-full'>
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                <TableRow className='hover:bg-transparent'>
                  {Array.from({ length: totalColumns }).map((_, j) => (
                    <TableHead
                      key={j}
                      style={{
                        width: allCellWidths[j],
                        minWidth: shrinkZero ? allCellWidths[j] : 'auto'
                      }}
                    >
                      {j === 0 && withBulkActions ? (
                        <Skeleton className='h-4 w-4 rounded' />
                      ) : (
                        <Skeleton className='h-5 w-full max-w-[120px]' />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: rowCount }).map((_, i) => (
                  <TableRow key={i} className='hover:bg-transparent'>
                    {Array.from({ length: totalColumns }).map((_, j) => (
                      <TableCell
                        key={j}
                        style={{
                          width: allCellWidths[j],
                          minWidth: shrinkZero ? allCellWidths[j] : 'auto'
                        }}
                      >
                        {j === 0 && withBulkActions ? (
                          <Skeleton className='h-4 w-4 rounded' />
                        ) : (
                          <Skeleton
                            className={cn(
                              'h-5',
                              // Vary width for more realistic appearance
                              j === 1 ? 'w-[120px]' :
                                j === 2 ? 'w-[80px]' :
                                  j === 3 ? 'w-[100px]' :
                                    'w-[90px]'
                            )}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination Skeleton */}
      {withPagination && (
        <div className='flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8'>
          <Skeleton className='h-5 w-[120px] shrink-0' />
          <div className='flex items-center gap-4 sm:gap-6 lg:gap-8'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-5 w-[100px]' />
              <Skeleton className='h-8 w-[70px] rounded-md' />
            </div>
            <div className='flex items-center justify-center text-sm font-medium'>
              <Skeleton className='h-5 w-[80px]' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='hidden h-8 w-8 rounded-md lg:block' />
              <Skeleton className='h-8 w-8 rounded-md' />
              <Skeleton className='h-8 w-8 rounded-md' />
              <Skeleton className='hidden h-8 w-8 rounded-md lg:block' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
