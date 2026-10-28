import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-[#D3C8B9] rounded-2xl bg-[#F8F5EF]/40 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-[#EDE7DC] shadow-xs flex items-center justify-center text-[#BF8641] mb-4">
        {icon || <FolderOpen className="w-7 h-7 stroke-[1.5]" />}
      </div>
      <h3 className="text-base font-bold text-[#0D1A26] mb-1">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-[#5D6B78] max-w-sm mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
