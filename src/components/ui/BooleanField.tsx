import React from 'react';

export interface BooleanFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  trueBadge?: string;
  falseBadge?: string;
}

export const BooleanField: React.FC<BooleanFieldProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  trueBadge = 'Yes',
  falseBadge = 'No',
}) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all select-none cursor-pointer ${
        checked
          ? 'bg-amber-50/50 border-[#BF8641]/50'
          : 'bg-[#F8F5EF]/40 border-[#EDE7DC] hover:border-[#D3C8B9]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="pr-4 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-[#0D1A26]">
            {label}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              checked
                ? 'bg-[#BF8641] text-white'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            {checked ? trueBadge : falseBadge}
          </span>
        </div>
        {description && (
          <p className="text-[11px] text-[#5D6B78] mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>

      {/* Switch Toggle */}
      <div
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${
          checked ? 'bg-[#BF8641]' : 'bg-stone-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
    </div>
  );
};
