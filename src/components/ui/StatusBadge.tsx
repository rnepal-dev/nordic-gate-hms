import React from 'react';

export type ContentStatus = 'published' | 'draft' | 'archived';
export type StatusType = ContentStatus;

export interface StatusBadgeProps {
  status: ContentStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const config: Record<ContentStatus, { defaultLabel: string; bg: string; text: string; dot: string; border: string }> = {
    published: {
      defaultLabel: 'Publicerad',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      dot: 'bg-emerald-500',
      border: 'border-emerald-200',
    },
    draft: {
      defaultLabel: 'Utkast',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      dot: 'bg-amber-500',
      border: 'border-amber-200',
    },
    archived: {
      defaultLabel: 'Arkiverad',
      bg: 'bg-stone-100',
      text: 'text-stone-700',
      dot: 'bg-stone-400',
      border: 'border-stone-200',
    },
  };

  const current = config[status] || config.draft;
  const displayLabel = label || current.defaultLabel;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md border ${sizeClasses} ${current.bg} ${current.text} ${current.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{displayLabel}</span>
    </span>
  );
};
