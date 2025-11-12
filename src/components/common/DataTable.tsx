import React, { useState, useMemo } from 'react';
import { Table } from './Table';
import { Input } from './Input';
import { Button } from './Button';
import { Badge } from './Badge';
import { Card } from './Card';

type SortDirection = 'asc' | 'desc' | null;

interface Filter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
}

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  filterable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filters?: Filter[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onExport?: (format: 'csv' | 'json') => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  showPageSizeSelector?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  filters = [],
  onRowClick,
  emptyMessage = 'Nenhum item encontrado',
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onExport,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  pageSize: initialPageSize = 10,
  showPageSizeSelector = true,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      result = result.filter((item) => {
        return columns.some((col) => {
          const value = (item as Record<string, unknown>)[col.key];
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
    }

    filters.forEach((filter) => {
      const filterValue = activeFilters[filter.key];
      if (filterValue) {
        result = result.filter((item) => {
          const value = (item as Record<string, unknown>)[filter.key];
          return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortKey];
        const bValue = (b as Record<string, unknown>)[sortKey];

        if (aValue === bValue) return 0;

        const comparison = aValue > bValue ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, activeFilters, sortKey, sortDirection, columns, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedData.slice(start, end);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    let newDirection: SortDirection = 'asc';
    if (sortKey === key && sortDirection === 'asc') {
      newDirection = 'desc';
    } else if (sortKey === key && sortDirection === 'desc') {
      newDirection = null;
    }

    setSortKey(newDirection ? key : null);
    setSortDirection(newDirection);
  };

  const exportToCSV = () => {
    if (onExport) {
      onExport('csv');
      return;
    }

    const headers = columns.map((col) => col.header).join(',');
    const rows = filteredAndSortedData.map((item) =>
      columns.map((col) => {
        const value = col.render ? String(col.render(item)) : String((item as T[keyof T])[col.key as keyof T] || '');
        return `"${value.replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    if (onExport) {
      onExport('json');
      return;
    }

    const json = JSON.stringify(filteredAndSortedData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeFiltersCount = Object.values(activeFilters).filter(Boolean).length + (searchQuery ? 1 : 0);

  return (
    <Card>
      <div className="p-6">
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:w-auto">
            {searchable && (
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {filters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros {activeFiltersCount > 0 && <Badge variant="primary">{activeFiltersCount}</Badge>}
              </Button>
            )}

            {onExport && (
              <div className="relative group">
                <Button variant="outline" size="sm">
                  Exportar ↓
                </Button>
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    CSV
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    JSON
                  </button>
                </div>
              </div>
            )}

            {showPageSizeSelector && (
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
              </select>
            )}
          </div>
        </div>

        {showFilters && filters.length > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  {filter.type === 'text' && (
                    <Input
                      type="text"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={`Filtrar por ${filter.label.toLowerCase()}...`}
                    />
                  )}
                  {filter.type === 'select' && filter.options && (
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Todos</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter.type === 'date' && (
                    <Input
                      type="date"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    />
                  )}
                  {filter.type === 'number' && (
                    <Input
                      type="number"
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={`Filtrar por ${filter.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
            </div>
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="mb-4 text-sm text-gray-600">
          Mostrando {paginatedData.length} de {filteredAndSortedData.length} itens
          {searchQuery && ` (filtrado de ${data.length} total)`}
        </div>

        <Table
          data={paginatedData}
          columns={columns}
          onRowClick={onRowClick}
          emptyMessage={emptyMessage}
          loading={loading}
          selectable={selectable}
          selectedRows={selectedRows}
          onSelectionChange={onSelectionChange}
          sortable
          onSort={handleSort}
        />

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

