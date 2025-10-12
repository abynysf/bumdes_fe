import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface Column<T> {
  /** Column header label */
  header: string;
  /** Accessor function or key to get cell data */
  accessor: keyof T | ((row: T) => ReactNode);
  /** Custom cell renderer */
  cell?: (row: T, value: unknown) => ReactNode;
  /** Column width class (e.g., 'w-24', 'w-1/4') */
  width?: string;
  /** Align content */
  align?: 'left' | 'center' | 'right';
  /** Hide column on mobile */
  hideOnMobile?: boolean;
  /** CSS class for header cell */
  headerClassName?: string;
  /** CSS class for body cell */
  cellClassName?: string;
}

export interface TableProps<T> {
  /** Array of data rows */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Message when no data */
  emptyMessage?: string;
  /** Generate unique key for each row */
  getRowKey?: (row: T, index: number) => string | number;
  /** Additional row className */
  rowClassName?: string | ((row: T, index: number) => string);
  /** Enable hover effect on rows */
  hoverable?: boolean;
  /** Enable horizontal scroll on small screens */
  scrollable?: boolean;
  /** Table size */
  size?: 'sm' | 'md' | 'lg';
  /** Striped rows */
  striped?: boolean;
}

/**
 * Responsive, accessible table component with mobile-friendly design
 */
export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  emptyMessage = 'Tidak ada data yang ditambahkan',
  getRowKey,
  rowClassName,
  hoverable = true,
  scrollable = true,
  size = 'md',
  striped = false,
}: TableProps<T>) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const paddingClasses = {
    sm: 'px-2 py-1.5',
    md: 'px-3 py-2',
    lg: 'px-4 py-3',
  };

  const getCellValue = (row: T, column: Column<T>): unknown => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  const renderCell = (row: T, column: Column<T>, value: unknown): ReactNode => {
    if (column.cell) {
      return column.cell(row, value);
    }
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return String(value);
  };

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const defaultRowKey = (row: T, index: number): string | number => {
    if (getRowKey) return getRowKey(row, index);
    if ('id' in row && row.id) return String(row.id);
    return index;
  };

  const getRowClass = (row: T, index: number): string => {
    const base = clsx(
      'transition-colors',
      hoverable && 'hover:bg-neutral-50',
      striped && index % 2 === 0 && 'bg-neutral-25'
    );

    if (typeof rowClassName === 'function') {
      return clsx(base, rowClassName(row, index));
    }
    return clsx(base, rowClassName);
  };

  const tableContent = (
    <table className="w-full border-separate border-spacing-0">
      <thead>
        <tr className="bg-neutral-50 text-neutral-700">
          {columns.map((column, index) => (
            <th
              key={`header-${index}`}
              className={clsx(
                'border-b border-neutral-200 font-semibold',
                paddingClasses[size],
                sizeClasses[size],
                getAlignClass(column.align),
                column.width,
                column.hideOnMobile && 'hidden sm:table-cell',
                column.headerClassName
              )}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className={clsx(
                'border-b border-neutral-200 text-center text-neutral-400',
                paddingClasses[size]
              )}
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => {
            const key = defaultRowKey(row, rowIndex);
            return (
              <tr key={key} className={getRowClass(row, rowIndex)}>
                {columns.map((column, colIndex) => {
                  const value = getCellValue(row, column);
                  return (
                    <td
                      key={`cell-${key}-${colIndex}`}
                      className={clsx(
                        'border-b border-neutral-200 text-neutral-800',
                        paddingClasses[size],
                        sizeClasses[size],
                        getAlignClass(column.align),
                        column.width,
                        column.hideOnMobile && 'hidden sm:table-cell',
                        column.cellClassName
                      )}
                    >
                      {renderCell(row, column, value)}
                    </td>
                  );
                })}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  if (scrollable) {
    return (
      <div className="overflow-x-auto border border-neutral-200 rounded-lg">
        {tableContent}
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 rounded-lg">
      {tableContent}
    </div>
  );
}

/**
 * Simple loading skeleton for tables
 */
export function TableSkeleton({
  rows = 3,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="animate-pulse space-y-2">
      <div className="flex gap-2">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="h-10 flex-1 rounded bg-neutral-200" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="flex gap-2">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={`cell-${i}-${j}`} className="h-12 flex-1 rounded bg-neutral-100" />
          ))}
        </div>
      ))}
    </div>
  );
}
