import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { SirvoyBookingSection } from '../components/booking/SirvoyBookingSection.tsx';
import { 
  Calendar, 
  Users, 
  ShieldCheck, 
  Coffee, 
  Droplets, 
  ArrowLeft, 
  ChevronRight,
  Filter,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { validateBookingCriteria } from '../lib/sirvoy-config.ts';

export const BookView: React.FC = () => {
  const { lang, searchCriteria, setSearchCriteria, navigate } = useHotel();

  // Internal state for selected room category if passed in history state
  const [selectedRoomSlug, setSelectedRoomSlug] = useState<string | null>(() => {
    try {
      const state = window.history.state;
      return state?.categoryId || null;
    } catch {
      return null;
    }
  });

  // Local form state for search criteria toolbar
  const [checkIn, setCheckIn] = useState(searchCriteria.checkIn || '2026-11-15');
  const [checkOut, setCheckOut] = useState(searchCriteria.checkOut || '2026-11-17');
  const [adults, setAdults] = useState(searchCriteria.adults || 2);
  const [children, setChildren] = useState(searchCriteria.children || 0);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleUpdateCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingCriteria({ checkIn, checkOut, adults, children });
    if (!validation.isValid) {
      setDateError(validation.error || 'Ogiltigt datumintervall');
      return;
    }

    setDateError(null);
    setSearchCriteria(prev => ({
      ...prev,
      checkIn,
      checkOut,
      adults,
      children,
    }));
  };

  return (
    <div className="space-y-10 lg:space-y-14 pb-20">
      
      {/* 1. LUXURY HERO BANNER */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] pt-12 pb-16 px-6 relative overflow-hidden border-b border-[#BF8641]/20">
        <div className="absolute inset-0 bg-radial-at-t from-[#0D1A26] via-[#02070D] to-[#02070D] opacity-95" />
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#F2C777]" />
            <span>{lang === 'sv' ? 'Direktbokning hos hotellet' : 'Official Direct Booking'}</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span>Göteborg</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8F5EF] leading-tight">
            {lang === 'sv' ? 'Boka Din Vistelse' : 'Book Your Stay'}
          </h1>

          <p className="text-sm sm:text-base text-[#EDE7DC]/90 max-w-2xl font-light leading-relaxed">
            {lang === 'sv'
              ? 'Hitta din perfekta vistelse på Hotel Nordic Gate. Välkommen till avslappnad skandinavisk gästfrihet med uppvärmd inomhuspool, bastu och ekologisk frukostbuffé.'
              : 'Find your perfect stay at Hotel Nordic Gate. Welcoming Scandinavian hospitality featuring our heated indoor pool, Finnish sauna, and complimentary organic breakfast buffet.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#D3C8B9]">
            <div className="flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Ekologisk frukost ingår' : 'Organic breakfast included'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Pool & bastu ingår fritt' : 'Pool & sauna access included'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Bästa prisgaranti direkt' : 'Best direct rate guarantee'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMBS & DATES CRITERIA BAR */}
      <section className="max-w-7xl mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-semibold mb-6">
          <button
            onClick={() => navigate('/rooms')}
            className="inline-flex items-center gap-2 text-[#25303A] hover:text-[#BF8641] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#BF8641]" />
            <span>{lang === 'sv' ? 'Utforska rumskategorier' : 'Explore room categories'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-[#25303A]/70">
            <span>Hotel Nordic Gate</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#BF8641]" />
            <span className="text-[#02070D] font-bold">{lang === 'sv' ? 'Bokning' : 'Booking'}</span>
          </div>
        </div>

        {/* Quick Dates Toolbar */}
        <div className="bg-[#EDE7DC] p-5 lg:p-6 rounded-2xl border border-[#D3C8B9] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#02070D]">
              {lang === 'sv' ? 'Justera Vistelsedatum & Gäster' : 'Adjust Stay Dates & Guests'}
            </span>
            {selectedRoomSlug && (
              <button
                type="button"
                onClick={() => setSelectedRoomSlug(null)}
                className="text-xs text-[#BF8641] hover:underline cursor-pointer"
              >
                {lang === 'sv' ? 'Visa alla rum' : 'Show all room types'}
              </button>
            )}
          </div>

          <form onSubmit={handleUpdateCriteria} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#25303A] mb-1">
                {lang === 'sv' ? 'Incheckning' : 'Check-in'}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  setDateError(null);
                }}
                className="w-full bg-white border border-[#D3C8B9] rounded-xl px-3 py-2 text-xs font-semibold text-[#02070D] focus:ring-2 focus:ring-[#BF8641] focus:outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#25303A] mb-1">
                {lang === 'sv' ? 'Utcheckning' : 'Check-out'}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  setDateError(null);
                }}
                className="w-full bg-white border border-[#D3C8B9] rounded-xl px-3 py-2 text-xs font-semibold text-[#02070D] focus:ring-2 focus:ring-[#BF8641] focus:outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#25303A] mb-1">
                {lang === 'sv' ? 'Vuxna' : 'Adults'}
              </label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-white border border-[#D3C8B9] rounded-xl px-3 py-2 text-xs font-semibold text-[#02070D] focus:ring-2 focus:ring-[#BF8641] focus:outline-none cursor-pointer"
              >
                <option value={1}>1 {lang === 'sv' ? 'vuxen' : 'adult'}</option>
                <option value={2}>2 {lang === 'sv' ? 'vuxna' : 'adults'}</option>
                <option value={3}>3 {lang === 'sv' ? 'vuxna' : 'adults'}</option>
                <option value={4}>4 {lang === 'sv' ? 'vuxna' : 'adults'}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#25303A] mb-1">
                {lang === 'sv' ? 'Barn' : 'Children'}
              </label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full bg-white border border-[#D3C8B9] rounded-xl px-3 py-2 text-xs font-semibold text-[#02070D] focus:ring-2 focus:ring-[#BF8641] focus:outline-none cursor-pointer"
              >
                <option value={0}>0 {lang === 'sv' ? 'barn' : 'children'}</option>
                <option value={1}>1 {lang === 'sv' ? 'barn' : 'child'}</option>
                <option value={2}>2 {lang === 'sv' ? 'barn' : 'children'}</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#0D1A26] hover:bg-[#02070D] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
              >
                {lang === 'sv' ? 'Uppdatera' : 'Update Search'}
              </button>
            </div>
          </form>

          {dateError && (
            <p className="text-xs font-semibold text-rose-700 pt-1">
              {dateError}
            </p>
          )}
        </div>
      </section>

      {/* 3. SIRVOY BOOKING SECTION (Dedicated embed container) */}
      <section className="max-w-7xl mx-auto px-6">
        <SirvoyBookingSection selectedRoomSlug={selectedRoomSlug} />
      </section>

    </div>
  );
};
