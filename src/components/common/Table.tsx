import React, { useState, useMemo } from 'react';
import { SkeletonTable } from './Skeleton';
import { Pagination } from './Pagination';

type SortDirection = 'asc' | 'desc' | null;

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  sortable?: boolean;
  onSort?: (key: string, direction: SortDirection) => void;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'Nenhum item encontrado',
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  pagination,
  sortable = false,
  onSort,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: string) => {
    if (!sortable || !columns.find((col) => col.key === key)?.sortable) return;

    let newDirection: SortDirection = 'asc';
    if (sortKey === key && sortDirection === 'asc') {
      newDirection = 'desc';
    } else if (sortKey === key && sortDirection === 'desc') {
      newDirection = null;
    }

    setSortKey(newDirection ? key : null);
    setSortDirection(newDirection);
    onSort?.(key, newDirection);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectable || !onSelectionChange) return;

    if (e.target.checked) {
      onSelectionChange(data.map((item) => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (!selectable || !onSelectionChange) return;

    if (checked) {
      onSelectionChange([...selectedRows, id]);
    } else {
      onSelectionChange(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  const paginatedData = useMemo(() => {
    if (!pagination) return data;
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return data.slice(start, end);
  }, [data, pagination]);

  const totalPages = pagination
    ? Math.ceil(pagination.totalItems / pagination.pageSize)
    : 1;

  if (loading) {
    return <SkeletonTable rows={5} cols={columns.length} />;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum item encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  aria-label="Selecionar todos"
                />
              </th>
            )}
            {columns.map((column) => {
              const isSorted = sortKey === column.key;
              const canSort = sortable && column.sortable;

              return (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.align === 'right'
                      ? 'text-right'
                      : column.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${canSort ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  onClick={() => canSort && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {canSort && (
                      <span className="flex flex-col">
                        <svg
                          className={`w-3 h-3 ${
                            isSorted && sortDirection === 'asc'
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <svg
                          className={`w-3 h-3 -mt-1 ${
                            isSorted && sortDirection === 'desc'
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((item) => {
            const isSelected = selectedRows.includes(item.id);
            return (
              <tr
                key={item.id}
                onClick={() => !selectable && onRowClick?.(item)}
                className={`${
                  onRowClick && !selectable ? 'cursor-pointer hover:bg-gray-50' : ''
                } ${isSelected ? 'bg-primary-50' : ''}`}
              >
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      aria-label={`Selecionar ${item.id}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 text-sm text-gray-900 ${
                      column.align === 'right'
                        ? 'text-right'
                        : column.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${column.key === 'actions' ? 'whitespace-nowrap' : ''}`}
                  >
                    {column.render ? column.render(item) : (item as Record<string, unknown>)[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pagination && totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}

