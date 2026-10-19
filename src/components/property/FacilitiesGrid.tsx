import React, { useState } from 'react';
import type { FacilityItem, FacilityCategory } from '../../types/property.ts';
import { useHotel } from '../../context/HotelContext.tsx';
import { 
  Droplets, 
  Sparkles, 
  Waves, 
  Coffee, 
  UtensilsCrossed, 
  Wine, 
  Car, 
  Wifi, 
  HeartHandshake, 
  Users, 
  Accessibility, 
  Clock, 
  Activity,
  Check,
  Briefcase,
  Zap,
  Ban
} from 'lucide-react';

interface FacilitiesGridProps {
  facilities: FacilityItem[];
  title?: string;
  subtitle?: string;
  showCategoryFilter?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Droplets,
  Sparkles,
  Waves,
  Coffee,
  UtensilsCrossed,
  Wine,
  Car,
  Wifi,
  HeartHandshake,
  Users,
  Accessibility,
  Clock,
  Activity,
  Briefcase,
  Zap,
  Ban,
};

export const FacilitiesGrid: React.FC<FacilitiesGridProps> = ({ 
  facilities,
  title,
  subtitle,
  showCategoryFilter = true
}) => {
  const { lang } = useHotel();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories: { key: string; labelEn: string; labelSv: string }[] = [
    { key: 'all', labelEn: 'All Facilities', labelSv: 'Alla Faciliteter' },
    { key: 'wellness', labelEn: 'Pool & Wellness', labelSv: 'Pool & Relax' },
    { key: 'dining', labelEn: 'Breakfast & Dining', labelSv: 'Frukost & Restaurang' },
    { key: 'family', labelEn: 'Family & Pets', labelSv: 'Familj & Husdjur' },
    { key: 'parking', labelEn: 'Parking & Access', labelSv: 'Parkering & Tillgänglighet' },
  ];

  const filteredFacilities = facilities.filter(item => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'wellness') return item.category === 'wellness';
    if (activeCategory === 'dining') return item.category === 'dining';
    if (activeCategory === 'family') return item.category === 'family' || item.category === 'pets';
    if (activeCategory === 'parking') return item.category === 'parking' || item.category === 'accessibility';
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center max-w-2xl mx-auto space-y-2">
          {subtitle && (
            <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="type-h2 text-2xl sm:text-3xl lg:text-4xl text-[#02070D]">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Category filter tabs */}
      {showCategoryFilter && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-[#F8F5EF] rounded-lg max-w-xl mx-auto border border-[#EDE7DC]">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-[#0D1A26] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'sv' ? cat.labelSv : cat.labelEn}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacilities.map((fac) => {
          const IconComponent = ICON_MAP[fac.iconName] || Check;

          return (
            <div
              key={fac.id}
              className="p-5 bg-white rounded-xl border border-[#EDE7DC] hover:border-[#BF8641]/50 transition-all flex items-start gap-4 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F8F5EF] text-[#BF8641] flex items-center justify-center shrink-0 border border-[#EDE7DC]">
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="type-h3 text-base sm:text-lg font-semibold text-slate-900 leading-tight">
                  {lang === 'sv' ? fac.nameSv : fac.nameEn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === 'sv' ? fac.descriptionSv : fac.descriptionEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
