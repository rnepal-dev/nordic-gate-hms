import React from 'react';

export type AdminLocale = 'sv' | 'en';

export interface LocaleTabsProps {
  currentLocale: AdminLocale;
  onChange: (locale: AdminLocale) => void;
  className?: string;
}

export const LocaleTabs: React.FC<LocaleTabsProps> = ({
  currentLocale,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center p-1 bg-[#EDE7DC]/60 rounded-lg border border-[#D3C8B9] ${className}`}
      role="tablist"
      aria-label="Content language"
    >
      <button
        type="button"
        role="tab"
        aria-selected={currentLocale === 'sv'}
        onClick={() => onChange('sv')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
          currentLocale === 'sv'
            ? 'bg-white text-[#0D1A26] shadow-xs'
            : 'text-[#5D6B78] hover:text-[#0D1A26]'
        }`}
      >
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#BF8641]">
          SV
        </span>
        <span>Svenska</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={currentLocale === 'en'}
        onClick={() => onChange('en')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
          currentLocale === 'en'
            ? 'bg-white text-[#0D1A26] shadow-xs'
            : 'text-[#5D6B78] hover:text-[#0D1A26]'
        }`}
      >
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#BF8641]">
          EN
        </span>
        <span>English</span>
      </button>
    </div>
  );
};
