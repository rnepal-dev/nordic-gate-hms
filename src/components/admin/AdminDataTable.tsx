import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TableSkeleton } from '../ui/LoadingSkeleton';
import { EmptyState } from '../ui/EmptyState';
import { Checkbox } from '../ui/Checkbox';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (columnKey: string) => void;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectRow?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  onRowClick?: (item: T) => void;
}

export function AdminDataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyState,
  sortColumn,
  sortDirection,
  onSort,
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  onRowClick,
}: AdminDataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#EDE7DC] overflow-hidden">
        <TableSkeleton rows={6} cols={columns.length + (selectable ? 1 : 0)} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#EDE7DC] overflow-hidden p-8">
        <EmptyState
          title={emptyState?.title || 'No records found'}
          description={
            emptyState?.description || 'There are no items matching your criteria.'
          }
          actionLabel={emptyState?.actionLabel}
          onAction={emptyState?.onAction}
        />
      </div>
    );
  }

  const allSelected =
    data.length > 0 && data.every((item) => selectedIds.includes(keyExtractor(item)));
  const someSelected =
    data.some((item) => selectedIds.includes(keyExtractor(item))) && !allSelected;

  return (
    <div className="bg-white rounded-xl border border-[#EDE7DC] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#EDE7DC] bg-[#F8F5EF]/80 text-[#25303A] text-xs font-semibold tracking-wider uppercase">
              {selectable && (
                <th scope="col" className="w-12 px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={(e) => onSelectAll?.(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D3C8B9] text-[#BF8641] focus:ring-[#BF8641] cursor-pointer"
                      aria-label="Select all rows"
                    />
                  </div>
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortColumn === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-4 py-3.5 whitespace-nowrap ${col.headerClassName || ''}`}
                  >
                    {col.sortable && onSort ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key)}
                        className="inline-flex items-center gap-1.5 hover:text-[#0D1A26] font-semibold cursor-pointer group transition-colors"
                      >
                        <span>{col.header}</span>
                        <span className="text-stone-400 group-hover:text-[#0D1A26]">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-[#BF8641]" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-[#BF8641]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                          )}
                        </span>
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDE7DC]/70">
            {data.map((item, idx) => {
              const id = keyExtractor(item);
              const isSelected = selectedIds.includes(id);

              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors ${
                    isSelected ? 'bg-amber-50/50' : 'hover:bg-[#F8F5EF]/60'
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {selectable && (
                    <td
                      className="w-12 px-4 py-3.5 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={isSelected}
                          onChange={(checked) => onSelectRow?.(id, checked)}
                          aria-label={`Select row ${id}`}
                        />
                      </div>
                    </td>
                  )}

                  {columns.map((col) => {
                    const value = (item as Record<string, any>)[col.key];
                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3.5 text-[#25303A] text-xs sm:text-sm ${
                          col.className || ''
                        }`}
                      >
                        {col.render ? col.render(item, idx) : (value ?? '—')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
