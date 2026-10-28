import React from 'react';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
}) => {
  return (
    <div className={`border-b border-[#EDE7DC] flex gap-2 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold tracking-wide border-b-2 -mb-px transition-colors whitespace-nowrap cursor-pointer ${
              isActive
                ? 'border-[#BF8641] text-[#0D1A26] bg-[#EDE7DC]/20'
                : 'border-transparent text-[#5D6B78] hover:text-[#0D1A26] hover:border-stone-300'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  isActive
                    ? 'bg-[#BF8641] text-white'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
