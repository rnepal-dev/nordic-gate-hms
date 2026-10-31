import React, { useState, useMemo } from 'react';
import { Search, X, Check, Sparkles } from 'lucide-react';
import { loadRoomAmenities } from '../../../data/adminMockData';
import { getIconComponent } from '../../../components/ui/IconPicker';
import { RoomAmenity } from '../room-amenities/amenityTypes';

export interface RoomAmenityMultiSelectProps {
  value: number[];
  onChange: (ids: number[]) => void;
  error?: string;
}

export const RoomAmenityMultiSelect: React.FC<RoomAmenityMultiSelectProps> = ({
  value = [],
  onChange,
  error,
}) => {
  const [search, setSearch] = useState('');
  const [allAmenities] = useState<RoomAmenity[]>(() => loadRoomAmenities());

  const selectedIdsSet = useMemo(() => new Set(value), [value]);

  const filteredAmenities = useMemo(() => {
    return allAmenities.filter((a) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
    });
  }, [allAmenities, search]);

  const selectedAmenities = useMemo(() => {
    return allAmenities.filter((a) => selectedIdsSet.has(a.id));
  }, [allAmenities, selectedIdsSet]);

  const handleToggle = (id: number) => {
    if (selectedIdsSet.has(id)) {
      onChange(value.filter((item) => item !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const handleRemove = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((item) => item !== id));
  };

  const handleSelectAllFiltered = () => {
    const combined = new Set([...value, ...filteredAmenities.map((a) => a.id)]);
    onChange(Array.from(combined));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#02070D]">
          Room Amenities ({value.length} selected)
        </label>
        <div className="flex items-center gap-2 text-xs">
          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#5D6B78] hover:text-rose-600 font-medium transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
          {filteredAmenities.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="text-[#BF8641] hover:text-[#8C5F27] font-medium transition-colors cursor-pointer"
            >
              Select All Visible
            </button>
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#5D6B78] -mt-1">
        Select all amenities included with this room type.
      </p>

      {/* Selected Amenity Chips */}
      {selectedAmenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-[#F8F5EF]/60 rounded-xl border border-[#EDE7DC]">
          {selectedAmenities.map((amenity) => {
            const Icon = getIconComponent(amenity.icon);
            return (
              <span
                key={amenity.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-[#0D1A26] text-[#F8F5EF] rounded-lg border border-[#0D1A26] shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-[#F2C777]" />
                <span>{amenity.name}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(amenity.id, e)}
                  className="text-stone-400 hover:text-rose-400 ml-0.5 rounded-full p-0.5 transition-colors cursor-pointer"
                  title={`Remove ${amenity.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A95A0] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter amenities by name or description..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D3C8B9] rounded-xl text-[#0D1A26] placeholder-stone-400 focus:outline-none focus:border-[#BF8641] focus:ring-1 focus:ring-[#BF8641]"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Amenities Grid / List */}
      <div className="max-h-56 overflow-y-auto space-y-1 border border-[#D3C8B9] rounded-xl p-2 bg-white">
        {filteredAmenities.length === 0 ? (
          <div className="text-center py-6 text-xs text-stone-400">
            No amenities found matching &quot;{search}&quot;.
          </div>
        ) : (
          filteredAmenities.map((amenity) => {
            const isSelected = selectedIdsSet.has(amenity.id);
            const Icon = getIconComponent(amenity.icon);

            return (
              <div
                key={amenity.id}
                onClick={() => handleToggle(amenity.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#F2C777]/15 border border-[#BF8641]/30 text-[#0D1A26]'
                    : 'hover:bg-[#F8F5EF] text-[#25303A] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#0D1A26] text-[#F2C777]'
                        : 'bg-[#EDE7DC] text-[#25303A]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#0D1A26] truncate">
                      {amenity.name}
                    </p>
                    {amenity.description && (
                      <p className="text-[11px] text-[#5D6B78] truncate">
                        {amenity.description}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-[#BF8641] border-[#BF8641] text-white'
                      : 'border-[#D3C8B9] bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
