import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-[#EDE7DC] text-xs text-[#5D6B78]">
      {/* Items Range & Page Size */}
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-semibold text-[#0D1A26]">{startItem}</span> to{' '}
          <span className="font-semibold text-[#0D1A26]">{endItem}</span> of{' '}
          <span className="font-semibold text-[#0D1A26]">{totalItems}</span> results
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-[#EDE7DC]">
            <span className="text-stone-400">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent border border-[#EDE7DC] rounded px-1.5 py-0.5 text-xs text-[#0D1A26] focus:border-[#BF8641] focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md border border-[#EDE7DC] hover:bg-[#F8F5EF] text-[#25303A] disabled:text-stone-300 disabled:border-stone-100 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-medium text-[#0D1A26]">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
          className="p-1.5 rounded-md border border-[#EDE7DC] hover:bg-[#F8F5EF] text-[#25303A] disabled:text-stone-300 disabled:border-stone-100 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
