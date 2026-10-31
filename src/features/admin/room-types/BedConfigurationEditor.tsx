import React, { useState } from 'react';
import { Plus, Trash2, Code2, Bed, Check } from 'lucide-react';

export interface BedConfigurationEditorProps {
  value: Record<string, number | string>;
  onChange: (newConfig: Record<string, number | string>) => void;
  error?: string;
}

const COMMON_BED_SUGGESTIONS = [
  { key: 'king_bed', label: 'King Bed (180-210cm)', defaultCount: 1 },
  { key: 'queen_bed', label: 'Queen Bed (160cm)', defaultCount: 1 },
  { key: 'single_bed', label: 'Single Bed (90cm)', defaultCount: 2 },
  { key: 'twin_bed', label: 'Twin Bed', defaultCount: 2 },
  { key: 'sofa_bed', label: 'Convertible Sofa Bed', defaultCount: 1 },
  { key: 'bunk_bed', label: 'Bunk Bed', defaultCount: 1 },
];

export const BedConfigurationEditor: React.FC<BedConfigurationEditorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [showRawJson, setShowRawJson] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState<number>(1);

  const entries = Object.entries(value || {});

  const handleUpdateEntry = (key: string, newCount: number | string) => {
    onChange({
      ...value,
      [key]: newCount,
    });
  };

  const handleRemoveEntry = (keyToRemove: string) => {
    const updated = { ...value };
    delete updated[keyToRemove];
    onChange(updated);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKey.trim()) return;

    const formattedKey = customKey
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    onChange({
      ...value,
      [formattedKey]: customValue,
    });
    setCustomKey('');
    setCustomValue(1);
  };

  const handleAddSuggestion = (key: string, defaultCount: number) => {
    onChange({
      ...value,
      [key]: (value && value[key] !== undefined) ? value[key] : defaultCount,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#02070D]">
          Bed Configuration (JSON Object) <span className="text-rose-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowRawJson(!showRawJson)}
          className="text-[11px] font-semibold text-[#BF8641] hover:text-[#8C5F27] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{showRawJson ? 'Hide JSON' : 'View JSON Preview'}</span>
        </button>
      </div>

      <p className="text-[11px] text-[#5D6B78] -mt-1">
        Configure bed arrangement (e.g. 1 Queen Bed, 2 Single Beds, or Sofa Bed).
      </p>

      {/* Quick Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#F8F5EF]/60 rounded-xl border border-[#EDE7DC]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1">
          <Bed className="w-3 h-3 text-[#BF8641]" />
          Presets:
        </span>
        {COMMON_BED_SUGGESTIONS.map((preset) => {
          const isAdded = value && value[preset.key] !== undefined;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => handleAddSuggestion(preset.key, preset.defaultCount)}
              className={`px-2 py-1 text-xs rounded-lg border font-medium flex items-center gap-1 transition-all cursor-pointer ${
                isAdded
                  ? 'bg-[#0D1A26] text-[#F2C777] border-[#0D1A26]'
                  : 'bg-white hover:bg-[#EDE7DC]/50 text-[#25303A] border-[#D3C8B9]'
              }`}
            >
              {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-[#BF8641]" />}
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Key/Value Entries */}
      <div className="space-y-2 border border-[#D3C8B9] rounded-xl p-3 bg-white">
        {entries.length === 0 ? (
          <div className="text-center py-4 text-xs text-stone-400">
            No bed types added yet. Select a preset above or add a custom arrangement below.
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map(([key, count]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3 p-2 bg-[#F8F5EF]/50 rounded-lg border border-[#EDE7DC]"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Bed className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span className="font-mono text-xs font-bold text-[#0D1A26] truncate">
                    {key}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-400 font-medium">Qty:</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={count}
                      onChange={(e) => handleUpdateEntry(key, parseInt(e.target.value, 10) || 1)}
                      className="w-14 px-2 py-1 text-xs font-mono font-semibold text-center bg-white border border-[#D3C8B9] rounded-md text-[#0D1A26] focus:border-[#BF8641] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(key)}
                    className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title={`Remove ${key}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Entry Row */}
        <div className="pt-2 border-t border-[#EDE7DC]/70 flex items-center gap-2">
          <input
            type="text"
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            placeholder="Custom key (e.g. baby_crib, futon)..."
            className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#D3C8B9] rounded-lg text-[#0D1A26] placeholder-stone-400 focus:outline-none focus:border-[#BF8641]"
          />
          <input
            type="number"
            min={1}
            max={10}
            value={customValue}
            onChange={(e) => setCustomValue(parseInt(e.target.value, 10) || 1)}
            className="w-16 px-2 py-1.5 text-xs font-mono text-center bg-white border border-[#D3C8B9] rounded-lg text-[#0D1A26] focus:outline-none focus:border-[#BF8641]"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customKey.trim()}
            className="px-3 py-1.5 text-xs font-semibold bg-[#BF8641] text-white rounded-lg hover:bg-[#8C5F27] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
          >
            Add Key
          </button>
        </div>
      </div>

      {/* Live JSON Preview */}
      {showRawJson && (
        <div className="p-3 bg-[#0D1A26] text-[#F8F5EF] rounded-xl border border-[#25303A] font-mono text-xs">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-[10px] text-stone-400">
            <span>JSON Object Representation</span>
            <span className="text-[#F2C777]">application/json</span>
          </div>
          <pre className="text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
            {JSON.stringify(value || {}, null, 2)}
          </pre>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
