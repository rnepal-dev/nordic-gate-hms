import React, { useState } from 'react';
import { 
  Check, 
  ShieldCheck, 
  Coffee, 
  Waves, 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles 
} from 'lucide-react';
import type { AvailableRoomType, AvailableRoomRatePlan } from '@/redux/feature/bookings/bookingTypes.ts';
import { formatSEK } from '../../lib/pricing.ts';

export interface RatePlanSelectorProps {
  roomType: AvailableRoomType;
  selectedRatePlanId: number;
  onSelectRatePlan: (plan: AvailableRoomRatePlan) => void;
  nights: number;
  lang: 'sv' | 'en';
}

export const RatePlanSelector: React.FC<RatePlanSelectorProps> = ({
  roomType,
  selectedRatePlanId,
  onSelectRatePlan,
  nights,
  lang,
}) => {
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);

  const toggleBreakdown = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPlanId((prev) => (prev === id ? null : id));
  };

  if (!roomType.rate_plans || roomType.rate_plans.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          {lang === 'sv'
            ? 'Inga tillgängliga prisplaner för detta rum under valda datum.'
            : 'No applicable rate plans available for this room on the chosen dates.'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-3 border-t border-[#EDE7DC]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#02070D]">
          {lang === 'sv' ? 'Välj pristyp & avbokningsvillkor' : 'Select Rate Plan & Cancellation Policy'}
        </span>
        <span className="text-[11px] text-[#5D6B78]">
          {roomType.rate_plans.length} {lang === 'sv' ? 'alternativ tillgängliga' : 'options available'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {roomType.rate_plans.map((plan) => {
          const isSelected = selectedRatePlanId === plan.rate_plan_id;
          const isExpanded = expandedPlanId === plan.rate_plan_id;
          const isFlexible = plan.cancellation_policy === 'flexible';

          return (
            <div
              key={plan.rate_plan_id}
              onClick={() => onSelectRatePlan(plan)}
              className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#BF8641] bg-amber-50/40 ring-1 ring-[#BF8641] shadow-xs'
                  : 'border-[#EDE7DC] bg-white hover:border-[#D3C8B9] hover:bg-stone-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Plan info & inclusions */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#0D1A26]">
                      {plan.rate_plan_name}
                    </span>
                    {isFlexible ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        {lang === 'sv' ? 'Fri avbokning' : 'Free Cancellation'}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-semibold">
                        {lang === 'sv' ? 'Bästa pris · Ej ombokningsbar' : 'Best Price · Non-Refundable'}
                      </span>
                    )}
                  </div>

                  {/* Benefit icons */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#5D6B78]">
                    {plan.breakfast_included && (
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Coffee className="w-3.5 h-3.5" />
                        <span>{lang === 'sv' ? 'Frukostbuffé ingår' : 'Breakfast included'}</span>
                      </span>
                    )}
                    {plan.pool_included && (
                      <span className="flex items-center gap-1 text-sky-700">
                        <Waves className="w-3.5 h-3.5" />
                        <span>{lang === 'sv' ? 'Pool & bastu ingår' : 'Pool & sauna included'}</span>
                      </span>
                    )}
                    {isFlexible && plan.free_cancellation_deadline_hours && (
                      <span className="flex items-center gap-1 text-stone-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {lang === 'sv'
                            ? `Fri avbokning upp till ${plan.free_cancellation_deadline_hours}h före ankomst`
                            : `Free cancellation up to ${plan.free_cancellation_deadline_hours}h before check-in`}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Price & Selection Radio */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <div className="flex items-baseline sm:justify-end gap-1">
                      <span className="text-xs font-semibold text-[#5D6B78]">
                        {lang === 'sv' ? 'Snitt/natt:' : 'Avg/night:'}
                      </span>
                      <span className="text-sm font-bold text-[#02070D]">
                        {formatSEK(parseFloat(plan.nightly_average), lang)}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-[#BF8641]">
                      {lang === 'sv' ? `Totalt ${nights} nätter:` : `Total for ${nights} nights:`}{' '}
                      {formatSEK(parseFloat(plan.total_price), lang)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Select indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#BF8641] bg-[#BF8641] text-white'
                          : 'border-[#D3C8B9] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nightly Breakdown Toggle */}
              {plan.nightly_breakdown && plan.nightly_breakdown.length > 1 && (
                <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={(e) => toggleBreakdown(plan.rate_plan_id, e)}
                    className="text-[#BF8641] hover:text-[#0D1A26] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {isExpanded
                        ? (lang === 'sv' ? 'Dölj pris per natt' : 'Hide nightly breakdown')
                        : (lang === 'sv' ? 'Visa pris per natt' : 'View nightly breakdown')}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  <span className="text-stone-400">
                    {lang === 'sv' ? 'Inkluderar 12% svensk hotellmoms' : 'Includes 12% Swedish hotel VAT'}
                  </span>
                </div>
              )}

              {/* Expanded Nightly Breakdown Table */}
              {isExpanded && plan.nightly_breakdown && (
                <div className="mt-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs space-y-1 animate-fadeIn">
                  <div className="font-semibold text-stone-700 text-[11px] pb-1 border-b border-stone-200 flex justify-between">
                    <span>{lang === 'sv' ? 'Datum' : 'Stay Date'}</span>
                    <span>{lang === 'sv' ? 'Pris inkl. moms' : 'Price inc. VAT'}</span>
                  </div>
                  {plan.nightly_breakdown.map((b) => (
                    <div key={b.stay_date} className="flex justify-between text-[11px] text-stone-600">
                      <span>{b.stay_date}</span>
                      <span className="font-medium text-stone-900">{formatSEK(parseFloat(b.price), lang)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
