import { UseCustomTableReturnType } from '@/components/custom/data-table/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { JSX } from 'react';

const CustomTablePagination = <T extends Record<string, unknown>>({ table }: { table: UseCustomTableReturnType<T> }): JSX.Element => {
  const pageSizeOptions = [10, 25, 50, 100];

  return (
    <div className='flex flex-col gap-2.5'>
      <div
        className={cn(
          'flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8'
        )}
      >
        <div className='text-muted-foreground flex-1 text-sm whitespace-nowrap'>
          {table.selectedRows.length > 0 ? (
            <>
              {table.selectedRows.length} sur {table.data.length} lignes sélectionnées
            </>
          ) : (
            <>{table.data.length} lignes au total</>
          )}
        </div>
        <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium whitespace-nowrap'>
              Rows per page
            </p>
            <Select
              value={`${table.rowsPerPage}`}
              onValueChange={(value) => {
                table.setRowsPerPage(Number(value));
              }}
            >
              <SelectTrigger className='h-8 w-[4.5rem] [&[data-size]]:h-8'>
                <SelectValue placeholder={table.rowsPerPage} />
              </SelectTrigger>
              <SelectContent side='top'>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center justify-center text-sm font-medium'>
            Page {table.currentPage + 1} sur {table.pages || 1}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              aria-label='Go to first page'
              variant='outline'
              size='icon'
              className='hidden size-8 lg:flex'
              onClick={() => table.setCurrentPage(0)}
              disabled={!table.currentPage}
            >
              <ChevronsLeft />
            </Button>
            <Button
              aria-label='Go to previous page'
              variant='outline'
              size='icon'
              className='size-8'
              onClick={() => table.setCurrentPage(table.currentPage - 1)}
              disabled={!table.currentPage}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              aria-label='Go to next page'
              variant='outline'
              size='icon'
              className='size-8'
              onClick={() => table.setCurrentPage(table.currentPage + 1)}
              disabled={table.currentPage === table.pages - 1}
            >
              <ChevronRightIcon />
            </Button>
            <Button
              aria-label='Go to last page'
              variant='outline'
              size='icon'
              className='hidden size-8 lg:flex'
              onClick={() => table.setCurrentPage(table.pages - 1)}
              disabled={table.currentPage === table.pages - 1}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CustomTablePagination;