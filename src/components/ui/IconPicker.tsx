import React, { useState, useMemo } from 'react';
import {
  Wifi,
  Waves,
  Coffee,
  Utensils,
  Wine,
  Dumbbell,
  Car,
  ParkingCircle,
  Sparkles,
  ShieldCheck,
  Tv,
  Snowflake,
  Accessibility,
  Key,
  Luggage,
  Clock,
  Baby,
  Bath,
  Bed,
  Phone,
  MapPin,
  Bus,
  CreditCard,
  Sun,
  Flame,
  Search,
  Check,
  HelpCircle,
} from 'lucide-react';

export interface IconOption {
  name: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const HOTEL_ICONS: IconOption[] = [
  { name: 'waves', label: 'Pool / Water', icon: Waves },
  { name: 'flame', label: 'Sauna / Heat', icon: Flame },
  { name: 'wifi', label: 'High-speed Wi-Fi', icon: Wifi },
  { name: 'coffee', label: 'Breakfast / Coffee', icon: Coffee },
  { name: 'utensils', label: 'Dining / Restaurant', icon: Utensils },
  { name: 'wine', label: 'Bar & Cocktails', icon: Wine },
  { name: 'dumbbell', label: 'Gym / Fitness', icon: Dumbbell },
  { name: 'parking', label: 'Parking Garage', icon: ParkingCircle },
  { name: 'car', label: 'EV Charging / Car', icon: Car },
  { name: 'bus', label: 'Public Transit', icon: Bus },
  { name: 'bath', label: 'Bathtub / Spa', icon: Bath },
  { name: 'bed', label: 'Bed / Accommodations', icon: Bed },
  { name: 'accessibility', label: 'Accessible / Elevator', icon: Accessibility },
  { name: 'baby', label: 'Family / Crib', icon: Baby },
  { name: 'luggage', label: 'Luggage Storage', icon: Luggage },
  { name: 'clock', label: '24/7 Service', icon: Clock },
  { name: 'key', label: 'Keyless Entry', icon: Key },
  { name: 'credit-card', label: 'Cash-Free Payment', icon: CreditCard },
  { name: 'shield-check', label: 'Safety & Security', icon: ShieldCheck },
  { name: 'tv', label: 'Smart TV / Streaming', icon: Tv },
  { name: 'snowflake', label: 'Air Conditioning', icon: Snowflake },
  { name: 'sparkles', label: 'Premium Amenity', icon: Sparkles },
  { name: 'sun', label: 'Terrace / Solarium', icon: Sun },
  { name: 'phone', label: 'Direct Line / Desk', icon: Phone },
  { name: 'map-pin', label: 'Central Location', icon: MapPin },
];

export const getIconComponent = (iconName?: string): React.ComponentType<{ className?: string }> => {
  if (!iconName) return Sparkles;
  const match = HOTEL_ICONS.find(
    (item) => item.name.toLowerCase() === iconName.toLowerCase()
  );
  return match ? match.icon : Sparkles;
};

export interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  label = 'Facility Icon',
  error,
  helperText = 'Select a representative hotel icon',
}) => {
  const [search, setSearch] = useState('');
  const SelectedIcon = getIconComponent(value);

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return HOTEL_ICONS;
    const q = search.toLowerCase();
    return HOTEL_ICONS.filter(
      (opt) => opt.name.includes(q) || opt.label.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-[#0D1A26] uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Selected Preview Bar */}
      <div className="flex items-center gap-3 p-3 bg-[#F8F5EF]/70 border border-[#D3C8B9] rounded-xl">
        <div className="w-10 h-10 rounded-lg bg-[#0D1A26] text-[#F2C777] flex items-center justify-center shrink-0 shadow-xs">
          <SelectedIcon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[#0D1A26]">
            Selected: <span className="font-mono text-[#BF8641]">{value || 'sparkles'}</span>
          </p>
          <p className="text-[11px] text-[#5D6B78] truncate">
            {HOTEL_ICONS.find((i) => i.name === value)?.label || 'Default Amenity'}
          </p>
        </div>
      </div>

      {/* Icon Search & Grid */}
      <div className="border border-[#EDE7DC] rounded-xl bg-white p-3 space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons (e.g. pool, wifi, parking)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8F5EF]/50 border border-[#EDE7DC] rounded-lg text-[#0D1A26] placeholder-stone-400 focus:outline-none focus:border-[#BF8641]"
          />
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1 scrollbar-thin">
          {filteredIcons.map((opt) => {
            const Icon = opt.icon;
            const isSelected = opt.name === value;
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => onChange(opt.name)}
                title={opt.label}
                className={`relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0D1A26] text-[#F2C777] border-[#0D1A26] shadow-xs'
                    : 'bg-white hover:bg-[#F8F5EF] text-stone-600 hover:text-[#0D1A26] border-[#EDE7DC]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] truncate w-full text-center mt-1 font-medium">
                  {opt.name}
                </span>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#BF8641] text-white rounded-full flex items-center justify-center shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#5D6B78]">{helperText}</p>
      ) : null}
    </div>
  );
};
