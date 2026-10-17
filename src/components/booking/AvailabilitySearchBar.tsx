import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { Calendar, Users, Tag, Search, AlertCircle } from 'lucide-react';
import { validateBookingDates } from '../../lib/hotel-logic.ts';

interface AvailabilitySearchBarProps {
  embedded?: boolean;
}

export const AvailabilitySearchBar: React.FC<AvailabilitySearchBarProps> = ({ embedded = false }) => {
  const { lang, searchCriteria, setSearchCriteria, navigate } = useHotel();
  const [checkIn, setCheckIn] = useState(searchCriteria.checkIn);
  const [checkOut, setCheckOut] = useState(searchCriteria.checkOut);
  const [adults, setAdults] = useState(searchCriteria.adults);
  const [children, setChildren] = useState(searchCriteria.children);
  const [roomsCount, setRoomsCount] = useState(searchCriteria.roomsCount);
  const [promoCode, setPromoCode] = useState(searchCriteria.promoCode);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingDates(checkIn, checkOut);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Ogiltigt datumintervall');
      return;
    }

    setValidationError(null);
    setSearchCriteria({
      checkIn,
      checkOut,
      adults,
      children,
      roomsCount,
      promoCode,
    });

    navigate('/booking');
  };

  return (
    <div 
      className={`w-full transition-all duration-300 ${
        embedded 
          ? 'bg-[#EDE7DC] p-6 rounded-2xl border border-[#D3C8B9] shadow-sm' 
          : 'bg-[#0D1A26]/95 border border-[#BF8641]/40 backdrop-blur-md p-4 lg:p-6 rounded-2xl shadow-2xl text-white'
      }`}
    >
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 items-end">
          
          {/* Check-In */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-bold tracking-wider uppercase ${embedded ? 'text-[#02070D]' : 'text-[#D3C8B9]'}`}>
              {lang === 'sv' ? 'Incheckning' : 'Check-in'}
            </label>
            <div className={`relative flex items-center border rounded-xl px-3 py-2.5 ${embedded ? 'border-[#D3C8B9] bg-white text-[#02070D]' : 'border-white/20 bg-black/40 text-white'}`}>
              <Calendar className="w-4 h-4 text-[#F2C777] mr-2 shrink-0" />
              <input
                type="date"
                required
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  setValidationError(null);
                }}
                className="w-full bg-transparent text-xs lg:text-sm font-semibold focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Check-Out */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-bold tracking-wider uppercase ${embedded ? 'text-[#02070D]' : 'text-[#D3C8B9]'}`}>
              {lang === 'sv' ? 'Utcheckning' : 'Check-out'}
            </label>
            <div className={`relative flex items-center border rounded-xl px-3 py-2.5 ${embedded ? 'border-[#D3C8B9] bg-white text-[#02070D]' : 'border-white/20 bg-black/40 text-white'}`}>
              <Calendar className="w-4 h-4 text-[#F2C777] mr-2 shrink-0" />
              <input
                type="date"
                required
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  setValidationError(null);
                }}
                className="w-full bg-transparent text-xs lg:text-sm font-semibold focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Guests Popover */}
          <div className="space-y-1.5 relative">
            <label className={`block text-xs font-bold tracking-wider uppercase ${embedded ? 'text-[#02070D]' : 'text-[#D3C8B9]'}`}>
              {lang === 'sv' ? 'Gäster & Rum' : 'Guests & Rooms'}
            </label>
            <button
              type="button"
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              className={`w-full flex items-center justify-between border rounded-xl px-3 py-2.5 text-xs lg:text-sm font-semibold cursor-pointer ${
                embedded 
                  ? 'border-[#D3C8B9] bg-white text-[#02070D]' 
                  : 'border-white/20 bg-black/40 text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Users className="w-4 h-4 text-[#F2C777] shrink-0" />
                <span>
                  {adults} {lang === 'sv' ? (adults > 1 ? 'vuxna' : 'vuxen') : (adults > 1 ? 'adults' : 'adult')}
                  {children > 0 && `, ${children} ${lang === 'sv' ? 'barn' : 'children'}`}
                </span>
              </div>
              <span className="text-[10px] text-[#F2C777] ml-1">▼</span>
            </button>

            {/* Dropdown panel */}
            {showGuestDropdown && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white text-[#02070D] border border-[#D3C8B9] rounded-2xl p-4 shadow-2xl z-50 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold">{lang === 'sv' ? 'Vuxna' : 'Adults'}</p>
                    <p className="text-[#25303A]/70 text-[11px]">{lang === 'sv' ? 'Från 13 år' : 'Age 13+'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-lg border border-[#D3C8B9] flex items-center justify-center hover:bg-neutral-100 disabled:opacity-40 cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold">{adults}</span>
                    <button
                      type="button"
                      disabled={adults >= 4}
                      onClick={() => setAdults(Math.min(4, adults + 1))}
                      className="w-7 h-7 rounded-lg border border-[#D3C8B9] flex items-center justify-center hover:bg-neutral-100 disabled:opacity-40 cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-[#EDE7DC] pt-3">
                  <div>
                    <p className="font-bold">{lang === 'sv' ? 'Barn' : 'Children'}</p>
                    <p className="text-[#25303A]/70 text-[11px]">{lang === 'sv' ? '0–12 år' : 'Age 0–12'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-lg border border-[#D3C8B9] flex items-center justify-center hover:bg-neutral-100 disabled:opacity-40 cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold">{children}</span>
                    <button
                      type="button"
                      disabled={children >= 3}
                      onClick={() => setChildren(Math.min(3, children + 1))}
                      className="w-7 h-7 rounded-lg border border-[#D3C8B9] flex items-center justify-center hover:bg-neutral-100 disabled:opacity-40 cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-[#EDE7DC] pt-3">
                  <div>
                    <p className="font-bold">{lang === 'sv' ? 'Antal rum' : 'Rooms'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={roomsCount <= 1}
                      onClick={() => setRoomsCount(Math.max(1, roomsCount - 1))}
                      className="w-7 h-7 rounded-lg border border-[#D3C8B9] flex items-center justify-center hover:bg-neutral-100 disabled:opacity-40 cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold">{roomsCount}</span>
                    <button
                      type="button"
                      disabled={roomsCount >= 3}
                      onClick={() => setRoomsCount(Math.min(3, roomsCount + 1))}
                      className="w-7 h-7 rounded-lg border border-[#D3C8B9] flex items-center justify-center hover:bg-neutral-100 disabled:opacity-40 cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuestDropdown(false)}
                  className="w-full bg-[#0D1A26] text-[#F8F5EF] text-xs font-bold py-2 rounded-xl hover:bg-[#02070D] transition-colors cursor-pointer"
                >
                  {lang === 'sv' ? 'Klar' : 'Done'}
                </button>
              </div>
            )}
          </div>

          {/* Promo code */}
          <div className="space-y-1.5">
            <label className={`block text-xs font-bold tracking-wider uppercase ${embedded ? 'text-[#02070D]' : 'text-[#D3C8B9]'}`}>
              {lang === 'sv' ? 'Kampanjkod' : 'Promo Code'}
            </label>
            <div className={`relative flex items-center border rounded-xl px-3 py-2.5 ${embedded ? 'border-[#D3C8B9] bg-white text-[#02070D]' : 'border-white/20 bg-black/40 text-white'}`}>
              <Tag className="w-4 h-4 text-[#F2C777] mr-2 shrink-0" />
              <input
                type="text"
                placeholder={lang === 'sv' ? 'T.ex. HÖST26' : 'e.g. AUTUMN26'}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="w-full bg-transparent text-xs lg:text-sm font-semibold focus:outline-none placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Search CTA */}
          <div>
            <button
              type="submit"
              className="w-full h-[42px] lg:h-[44px] flex items-center justify-center gap-2 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Sök Lediga Rum' : 'Check Availability'}</span>
            </button>
          </div>

        </div>

        {validationError && (
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 bg-rose-950/70 border border-rose-800/60 px-3.5 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </form>
    </div>
  );
};
