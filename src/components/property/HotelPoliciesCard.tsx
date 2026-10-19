import React from 'react';
import type { HotelPolicy } from '../../types/property.ts';
import { useHotel } from '../../context/HotelContext.tsx';
import { 
  Clock, 
  Baby, 
  HeartHandshake, 
  Car, 
  CreditCard, 
  Accessibility, 
  Info 
} from 'lucide-react';

interface HotelPoliciesCardProps {
  policies: HotelPolicy[];
  title?: string;
}

export const HotelPoliciesCard: React.FC<HotelPoliciesCardProps> = ({ policies, title }) => {
  const { lang } = useHotel();

  const getPolicyIcon = (category: string) => {
    switch (category) {
      case 'check_in_out': return Clock;
      case 'children_beds': return Baby;
      case 'pets': return HeartHandshake;
      case 'parking': return Car;
      case 'payment': return CreditCard;
      case 'accessibility': return Accessibility;
      default: return Info;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE7DC] p-6 lg:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDE7DC]">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
            {lang === 'sv' ? 'Praktisk Information' : 'Essential Policies'}
          </span>
          <h3 className="type-h3 text-xl sm:text-2xl lg:text-3xl text-[#02070D] mt-1 font-semibold">
            {title || (lang === 'sv' ? 'Hotellregler & Villkor' : 'Hotel Policies & Guidelines')}
          </h3>
        </div>
        <span className="text-xs text-[#02070D] font-bold bg-[#EDE7DC] px-3.5 py-1.5 rounded-lg border border-[#D3C8B9] self-start sm:self-auto">
          {lang === 'sv' ? 'Gäller samtliga bokningar' : 'Applies to all stays'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((pol) => {
          const IconComp = getPolicyIcon(pol.category);

          return (
            <div key={pol.key} className="flex items-start gap-4 p-4 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC]">
              <div className="w-10 h-10 rounded-xl bg-white text-[#BF8641] flex items-center justify-center shrink-0 border border-[#D3C8B9] shadow-2xs">
                <IconComp className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#02070D] text-sm block">
                  {lang === 'sv' ? pol.titleSv : pol.titleEn}
                </span>
                <p className="font-semibold text-[#BF8641]">
                  {lang === 'sv' ? pol.valueSv : pol.valueEn}
                </p>
                <p className="text-[#25303A] leading-relaxed pt-0.5">
                  {lang === 'sv' ? pol.detailsSv : pol.detailsEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
