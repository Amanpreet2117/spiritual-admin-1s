import React from 'react';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: keyof T | ((record: T) => string | number);
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    className?: string;
  };
  className?: string;
  emptyText?: string;
}

export interface TableHeaderProps {
  columns: Column<any>[];
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  onSort,
  sortKey,
  sortOrder,
}) => {
  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(key, newOrder);
  };

  return (
    <thead className="table-header">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={clsx(
              'table-header-cell',
              {
                'cursor-pointer hover:bg-gray-100': column.sorter,
                'text-left': column.align === 'left' || !column.align,
                'text-center': column.align === 'center',
                'text-right': column.align === 'right',
              },
              column.className
            )}
            style={{ width: column.width }}
            onClick={() => column.sorter && handleSort(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.title}</span>
              {column.sorter && (
                <div className="flex flex-col">
                  <ChevronUp
                    className={clsx('h-3 w-3', {
                      'text-primary-600': sortKey === column.key && sortOrder === 'asc',
                      'text-gray-400': sortKey !== column.key || sortOrder !== 'asc',
                    })}
                  />
                  <ChevronDown
                    className={clsx('h-3 w-3 -mt-1', {
                      'text-primary-600': sortKey === column.key && sortOrder === 'desc',
                      'text-gray-400': sortKey !== column.key || sortOrder !== 'desc',
                    })}
                  />
                </div>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableBody: React.FC<{ 
  data: any[];
  columns: Column<any>[];
  rowKey: string | ((record: any) => string | number);
  onRow?: (record: any, index: number) => { onClick?: () => void; className?: string };
  loading?: boolean;
  emptyText?: string;
}> = ({ data, columns, rowKey, onRow, loading, emptyText }) => {
  if (loading) {
    return (
      <tbody className="table-body">
        <tr>
          <td colSpan={columns.length} className="table-cell text-center py-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="loading-spinner h-6 w-6"></div>
              <span className="text-gray-500">Loading...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  if (data.length === 0) {
    return (
      <tbody className="table-body">
        <tr>
          <td colSpan={columns.length} className="table-cell text-center py-8">
            <div className="text-gray-500">
              {emptyText || 'No data available'}
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="table-body">
      {data.map((record, index) => {
        const rowProps = onRow ? onRow(record, index) : {};
        const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey];

        return (
          <tr
            key={key}
            className={clsx('table-row', rowProps.className)}
            onClick={rowProps.onClick}
          >
            {columns.map((column) => {
              const value = column.dataIndex ? record[column.dataIndex] : null;
              const renderedValue = column.render ? column.render(value, record, index) : value;

              return (
                <td
                  key={column.key}
                  className={clsx(
                    'table-cell',
                    {
                      'text-left': column.align === 'left' || !column.align,
                      'text-center': column.align === 'center',
                      'text-right': column.align === 'right',
                    },
                    column.className
                  )}
                >
                  {renderedValue}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

function Table<T>({
  data,
  columns,
  loading = false,
  pagination,
  rowKey = 'id',
  onRow,
  className,
  emptyText,
}: TableProps<T>) {
  return (
    <div className={clsx('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="table">
          <TableHeader columns={columns} />
          <TableBody
            data={data}
            columns={columns}
            rowKey={rowKey}
            onRow={onRow}
            loading={loading}
            emptyText={emptyText}
          />
        </table>
      </div>
      
      {pagination && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                disabled={pagination.current === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                disabled={pagination.current * pagination.pageSize >= pagination.total}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.current - 1) * pagination.pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                    disabled={pagination.current === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                    disabled={pagination.current * pagination.pageSize >= pagination.total}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Table };
