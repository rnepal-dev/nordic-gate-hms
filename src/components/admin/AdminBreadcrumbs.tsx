import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

export interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const AdminBreadcrumbs: React.FC<AdminBreadcrumbsProps> = ({ items }) => {
  const { navigate } = useHotel();

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#5D6B78]">
      <ol className="flex items-center space-x-1.5 flex-wrap">
        <li>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1 text-[#5D6B78] hover:text-[#0D1A26] transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only sm:not-sr-only">Admin</span>
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center space-x-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              {isLast || !item.route ? (
                <span className="font-semibold text-[#0D1A26] truncate max-w-[150px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(item.route!)}
                  className="hover:text-[#0D1A26] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
