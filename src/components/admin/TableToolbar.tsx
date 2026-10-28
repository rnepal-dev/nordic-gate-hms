import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  categoryFilter?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  };
  statusFilter?: {
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  };
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  actions?: React.ReactNode;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  categoryFilter,
  statusFilter,
  onResetFilters,
  hasActiveFilters = false,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white border-b border-[#EDE7DC]">
      {/* Search & Filters */}
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#F8F5EF]/60 border border-[#D3C8B9] rounded-lg text-[#0D1A26] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#BF8641] transition-all"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category filter */}
        {categoryFilter && (
          <div className="relative">
            <select
              value={categoryFilter.value}
              onChange={(e) => categoryFilter.onChange(e.target.value)}
              className="appearance-none bg-white border border-[#D3C8B9] text-xs sm:text-sm text-[#0D1A26] font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#BF8641] cursor-pointer"
            >
              {categoryFilter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status filter */}
        {statusFilter && (
          <div className="relative">
            <select
              value={statusFilter.value}
              onChange={(e) => statusFilter.onChange(e.target.value)}
              className="appearance-none bg-white border border-[#D3C8B9] text-xs sm:text-sm text-[#0D1A26] font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#BF8641] cursor-pointer"
            >
              {statusFilter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reset button if active filters */}
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-[#BF8641] hover:text-[#8C5F27] font-semibold px-2 py-1.5 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5" />
            Reset filters
          </button>
        )}
      </div>

      {/* Action slots */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
};
