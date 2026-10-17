import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { RATE_PLANS, BOOKING_EXTRAS } from '../data/hotelData.ts';
import { calculateNights, calculateBookingPrice, formatSEK, generateBookingReference } from '../lib/pricing.ts';
import { validateBookingDates } from '../lib/hotel-logic.ts';
import type { RatePlanId, SelectedExtra, Reservation } from '../types/hotel.ts';
import { 
  Calendar, 
  Users, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CreditCard,
  Mail,
  Phone,
  User,
  MapPin,
  Coffee,
  Droplets,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { CANDIDATE_ROOM_CATALOG } from '../data/propertyData.ts';
import { HOTEL_IMAGES } from '../data/hotelData.ts';

export const BookingEngineView: React.FC = () => {
  const { 
    lang, 
    searchCriteria, 
    setSearchCriteria, 
    roomCategories, 
    addReservation, 
    setActiveBookingRef,
    navigate 
  } = useHotel();

  // Booking Engine Steps: 1: Search & Room -> 2: Rate & Extras -> 3: Guest Details -> 4: Review -> 5: Confirmation
  const [step, setStep] = useState<number>(1);

  // Unified candidate rooms catalog
  const candidateRoomsFormatted = CANDIDATE_ROOM_CATALOG.map(c => ({
    id: c.id,
    slug: c.id,
    name: c.name,
    nameSv: c.nameSv,
    tagline: c.taglineEn || '',
    taglineSv: c.taglineSv || '',
    description: c.descriptionEn,
    descriptionSv: c.descriptionSv,
    dimensionsM2: c.category === 'family' ? 32 : (c.category === 'superior' ? 24 : (c.category === 'standard' ? 20 : 16)),
    maxGuests: c.maxGuests,
    bedType: c.bedConfigurationEn,
    bedTypeSv: c.bedConfigurationSv,
    startingPriceSEK: c.startingPriceSEK || 1295,
    image: c.images[0] || HOTEL_IMAGES.deluxeCanal,
    petEligible: c.petEligible,
  }));

  // Form State
  const [checkIn, setCheckIn] = useState(searchCriteria.checkIn);
  const [checkOut, setCheckOut] = useState(searchCriteria.checkOut);
  const [adults, setAdults] = useState(searchCriteria.adults);
  const [children, setChildren] = useState(searchCriteria.children);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return (window.history.state && window.history.state.categoryId) || 'compact-double';
  });
  const [selectedRatePlanId, setSelectedRatePlanId] = useState<RatePlanId>(() => {
    return (window.history.state && window.history.state.ratePlanId) || 'flexible';
  });
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  // Guest Details
  const [guestName, setGuestName] = useState('Carl von Linné');
  const [guestEmail, setGuestEmail] = useState('carl.linne@botanik.se');
  const [guestPhone, setGuestPhone] = useState('+46 70 123 45 67');
  const [guestCountry, setGuestCountry] = useState('Sverige');
  const [policyAccepted, setPolicyAccepted] = useState(true);

  // Confirmed booking state
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const nights = calculateNights(checkIn, checkOut);
  const room = candidateRoomsFormatted.find(r => r.id === selectedCategory) || 
               roomCategories.find(r => r.id === selectedCategory) || 
               candidateRoomsFormatted[0];
  const ratePlan = RATE_PLANS.find(p => p.id === selectedRatePlanId) || RATE_PLANS[0];

  // Price calculations
  const priceCalc = calculateBookingPrice({
    nightlyRateSEK: room.startingPriceSEK,
    nights,
    ratePlanMultiplier: ratePlan.multiplier,
    extras: selectedExtras,
  });

  const toggleExtra = (extraId: string) => {
    const extra = BOOKING_EXTRAS.find(e => e.id === extraId);
    if (!extra) return;

    setSelectedExtras(prev => {
      const exists = prev.find(item => item.id === extraId);
      if (exists) {
        return prev.filter(item => item.id !== extraId);
      } else {
        return [...prev, {
          id: extra.id,
          name: lang === 'sv' ? extra.nameSv : extra.name,
          priceSEK: extra.priceSEK,
          vatRate: extra.vatRate,
          count: 1,
        }];
      }
    });
  };

  const handleDatesNext = () => {
    const val = validateBookingDates(checkIn, checkOut);
    if (!val.isValid) {
      setValidationError(val.error || 'Kontrollera datumen');
      return;
    }
    setValidationError(null);
    setSearchCriteria(prev => ({ ...prev, checkIn, checkOut, adults, children }));
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuestInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      setValidationError(lang === 'sv' ? 'Vänligen fyll i alla obligatoriska fält' : 'Please fill in all required fields');
      return;
    }
    if (!policyAccepted) {
      setValidationError(lang === 'sv' ? 'Du måste godkänna bokningsvillkoren' : 'You must accept booking terms');
      return;
    }
    setValidationError(null);
    setStep(4); // Review
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReservation = () => {
    const bookingRef = generateBookingReference('SH');
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      bookingReference: bookingRef,
      guestName,
      guestEmail,
      guestPhone,
      guestCountry,
      roomCategoryId: selectedCategory as any,
      assignedRoomNumber: selectedCategory === 'family-room' ? '207' : selectedCategory === 'superior-double' ? '114' : selectedCategory === 'standard-twin' ? '108' : selectedCategory === 'compact-twin' ? '106' : selectedCategory === 'heritage-suite' ? '304' : '102',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      adults,
      children,
      ratePlanId: selectedRatePlanId,
      extras: selectedExtras,
      specialRequests,
      status: 'confirmed',
      totalSEK: priceCalc.totalGrossSEK,
      vatRoomSEK: priceCalc.vatRoomSEK,
      vatExtrasSEK: priceCalc.vatExtrasSEK,
      paymentStatus: 'paid',
      source: 'direct_website',
      createdAt: new Date().toISOString().split('T')[0],
    };

    addReservation(newRes);
    setConfirmedReservation(newRes);
    setActiveBookingRef(bookingRef);
    setStep(5); // Confirmation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepsList = [
    { num: 1, labelSv: 'Rum & Datum', labelEn: 'Dates & Room' },
    { num: 2, labelSv: 'Pristyp & Tillval', labelEn: 'Rates & Extras' },
    { num: 3, labelSv: 'Gästuppgifter', labelEn: 'Guest Details' },
    { num: 4, labelSv: 'Granska & Boka', labelEn: 'Review & Book' },
  ];

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. LUXURY BOOKING HEADER BANNER */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] pt-12 pb-14 px-6 border-b border-[#BF8641]/20">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Direktbokning online' : 'Direct Hotel Booking'}</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>{lang === 'sv' ? 'Garanterat bästa pris' : 'Best Rate Guarantee'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#F8F5EF] mt-1">
                {lang === 'sv' ? 'Boka din vistelse på Hotel Nordic Gate' : 'Reserve Your Stay at Hotel Nordic Gate'}
              </h1>
            </div>

            {step < 5 && (
              <div className="text-xs font-semibold uppercase tracking-wider text-[#D3C8B9] bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm self-start md:self-auto">
                {lang === 'sv' ? `Steg ${step} av 4` : `Step ${step} of 4`}
              </div>
            )}
          </div>

          {/* Step Progress Pills */}
          {step < 5 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {stepsList.map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div 
                    key={s.num}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs transition-all ${
                      isActive 
                        ? 'bg-[#BF8641] text-white border-[#F2C777] shadow-md font-bold' 
                        : isCompleted
                        ? 'bg-white/15 text-[#F2C777] border-white/20 font-semibold'
                        : 'bg-white/5 text-[#D3C8B9]/60 border-white/10 font-normal'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                      isActive ? 'bg-white text-[#BF8641]' : isCompleted ? 'bg-[#F2C777] text-[#0D1A26]' : 'bg-white/20 text-white'
                    }`}>
                      {isCompleted ? '✓' : s.num}
                    </span>
                    <span className="truncate">{lang === 'sv' ? s.labelSv : s.labelEn}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        
        {validationError && (
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-300 px-4 py-3 rounded-xl shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* ================= STEP 1: DATES & ROOM SELECTION ================= */}
        {step === 1 && (
          <div className="space-y-8">
            
            {/* Date & Guest Selector Box (Warm Sand #EDE7DC) */}
            <div className="bg-[#EDE7DC] p-6 rounded-2xl border border-[#D3C8B9] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end shadow-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                  {lang === 'sv' ? 'Incheckning' : 'Check-In'}
                </label>
                <div className="relative flex items-center bg-white rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                  <Calendar className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                  {lang === 'sv' ? 'Utcheckning' : 'Check-Out'}
                </label>
                <div className="relative flex items-center bg-white rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                  <Calendar className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                  {lang === 'sv' ? 'Vuxna gäster' : 'Adults'}
                </label>
                <div className="relative flex items-center bg-white rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                  <Users className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1 {lang === 'sv' ? 'vuxen' : 'adult'}</option>
                    <option value={2}>2 {lang === 'sv' ? 'vuxna' : 'adults'}</option>
                    <option value={3}>3 {lang === 'sv' ? 'vuxna' : 'adults'}</option>
                    <option value={4}>4 {lang === 'sv' ? 'vuxna' : 'adults'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                  {lang === 'sv' ? 'Barn (0–12 år)' : 'Children'}
                </label>
                <div className="relative flex items-center bg-white rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                  <Users className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none cursor-pointer"
                  >
                    <option value={0}>0 {lang === 'sv' ? 'barn' : 'children'}</option>
                    <option value={1}>1 {lang === 'sv' ? 'barn' : 'child'}</option>
                    <option value={2}>2 {lang === 'sv' ? 'barn' : 'children'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Room Categories Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#02070D]">
                    {lang === 'sv' ? 'Välj Rumskategori' : 'Select Room Category'}
                  </h3>
                  <p className="text-xs text-[#25303A] mt-0.5">
                    {nights} {lang === 'sv' ? (nights > 1 ? 'nätter valda' : 'natt vald') : (nights > 1 ? 'nights selected' : 'night selected')} · {lang === 'sv' ? 'Frukostbuffé och poolentré ingår alltid' : 'Organic breakfast and pool entry included'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidateRoomsFormatted.map((r) => {
                  const isSelected = selectedCategory === r.id;
                  const roomNightsPrice = r.startingPriceSEK * nights;

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedCategory(r.id)}
                      className={`bg-white rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#BF8641] ring-2 ring-[#BF8641] shadow-lg bg-[#F8F5EF]/30'
                          : 'border-[#EDE7DC] hover:border-[#D3C8B9] hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="aspect-[16/10] bg-[#0D1A26] rounded-xl overflow-hidden mb-3.5 relative">
                          <img
                            src={r.image}
                            alt={r.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-[#0D1A26]/85 border border-white/10 text-[#F2C777] text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-md">
                            {r.dimensionsM2} m² · {lang === 'sv' ? r.bedTypeSv : r.bedType}
                          </div>
                        </div>

                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-serif text-xl font-bold text-[#02070D]">
                            {lang === 'sv' ? r.nameSv : r.name}
                          </h4>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#BF8641] text-white flex items-center justify-center text-xs shrink-0 font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#BF8641] font-semibold mb-2">Max {r.maxGuests} {lang === 'sv' ? 'gäster' : 'guests'}</p>
                        <p className="text-xs text-[#25303A] line-clamp-2 leading-relaxed">{lang === 'sv' ? r.descriptionSv : r.description}</p>
                      </div>

                      <div className="pt-4 border-t border-[#EDE7DC] mt-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#25303A]/70 uppercase font-bold block">
                            {nights} {lang === 'sv' ? (nights > 1 ? 'nätter totalt' : 'natt totalt') : (nights > 1 ? 'nights total' : 'night total')}
                          </span>
                          <span className="font-serif text-xl font-bold text-[#02070D] tabular-nums">
                            {formatSEK(roomNightsPrice, lang)}
                          </span>
                        </div>
                        <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-colors ${
                          isSelected ? 'bg-[#BF8641] text-white' : 'bg-[#EDE7DC] text-[#02070D] hover:bg-[#D3C8B9]'
                        }`}>
                          {isSelected ? (lang === 'sv' ? 'Vald ✓' : 'Selected ✓') : (lang === 'sv' ? 'Välj' : 'Select')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleDatesNext}
                className="px-8 py-4 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'sv' ? 'Gå vidare till pristyp & tillval' : 'Continue to Rate & Extras'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: RATE PLANS & EXTRAS ================= */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left 8 cols: Rate Plans & Extras */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Rate Plan Selector */}
                <div className="bg-white p-6 rounded-2xl border border-[#EDE7DC] space-y-4 shadow-sm">
                  <h3 className="font-serif text-2xl font-bold text-[#02070D]">
                    {lang === 'sv' ? '1. Välj Avbokningsvillkor' : '1. Select Rate & Policy'}
                  </h3>

                  <div className="space-y-3">
                    {RATE_PLANS.map((plan) => {
                      const isSelected = selectedRatePlanId === plan.id;
                      const planTotalPrice = Math.round(room.startingPriceSEK * plan.multiplier * nights);

                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedRatePlanId(plan.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#BF8641] bg-[#EDE7DC]/40 ring-2 ring-[#BF8641]'
                              : 'border-[#EDE7DC] hover:border-[#D3C8B9] bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-serif text-lg font-bold text-[#02070D]">
                                {lang === 'sv' ? plan.nameSv : plan.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-[#BF8641]">
                                <ShieldCheck className="w-4 h-4" />
                                <span>{lang === 'sv' ? plan.cancellationPolicySv : plan.cancellationPolicy}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-4">
                              <span className="font-serif text-xl font-bold text-[#02070D] tabular-nums block">
                                {formatSEK(planTotalPrice, lang)}
                              </span>
                              <span className="text-[10px] text-[#25303A]/70 font-medium">
                                {nights} {lang === 'sv' ? (nights > 1 ? 'nätter' : 'natt') : (nights > 1 ? 'nights' : 'night')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Extras Selector */}
                <div className="bg-white p-6 rounded-2xl border border-[#EDE7DC] space-y-4 shadow-sm">
                  <h3 className="font-serif text-2xl font-bold text-[#02070D]">
                    {lang === 'sv' ? '2. Skräddarsy din vistelse med tillval' : '2. Enhance Your Stay with Add-Ons'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {BOOKING_EXTRAS.map((extra) => {
                      const isSelected = selectedExtras.some(e => e.id === extra.id);

                      return (
                        <div
                          key={extra.id}
                          className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#BF8641] bg-[#EDE7DC]/40 ring-1 ring-[#BF8641]'
                              : 'border-[#EDE7DC] hover:border-[#D3C8B9] bg-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-serif text-base font-bold text-[#02070D]">
                                {lang === 'sv' ? extra.nameSv : extra.name}
                              </h4>
                              <span className="font-serif font-bold text-sm text-[#02070D] tabular-nums">
                                +{formatSEK(extra.priceSEK, lang)}
                              </span>
                            </div>
                            <p className="text-xs text-[#25303A] leading-relaxed">
                              {lang === 'sv' ? extra.unitDescriptionSv : extra.unitDescription}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#EDE7DC] mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => toggleExtra(extra.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#BF8641] text-white'
                                  : 'bg-[#EDE7DC] text-[#02070D] hover:bg-[#D3C8B9]'
                              }`}
                            >
                              {isSelected ? (lang === 'sv' ? 'Tillagd ✓' : 'Added ✓') : (lang === 'sv' ? '+ Lägg till' : '+ Add')}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Back / Next Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-[#D3C8B9] hover:border-[#BF8641] text-[#25303A] font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{lang === 'sv' ? 'Tillbaka till rum' : 'Back to Rooms'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'sv' ? 'Gå till gästuppgifter' : 'Continue to Guest Details'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right 4 cols: Sticky Order Summary */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 bg-[#EDE7DC] p-6 rounded-2xl border border-[#D3C8B9] space-y-5 shadow-lg">
                  <h4 className="font-serif text-xl font-bold text-[#02070D] pb-3 border-b border-[#D3C8B9]">
                    {lang === 'sv' ? 'Bokningsöversikt' : 'Reservation Summary'}
                  </h4>

                  <div className="space-y-3 text-xs text-[#25303A]">
                    <div className="flex justify-between">
                      <span className="font-medium text-[#25303A]/80">{lang === 'sv' ? 'Rum:' : 'Room:'}</span>
                      <span className="font-bold text-[#02070D]">{lang === 'sv' ? room.nameSv : room.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#25303A]/80">{lang === 'sv' ? 'Datum:' : 'Dates:'}</span>
                      <span className="font-bold text-[#02070D]">{checkIn} – {checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#25303A]/80">{lang === 'sv' ? 'Längd & Gäster:' : 'Stay & Guests:'}</span>
                      <span className="font-bold text-[#02070D]">{nights} {lang === 'sv' ? 'nätter' : 'nights'} · {adults} vuxna</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#25303A]/80">{lang === 'sv' ? 'Pristyp:' : 'Rate Plan:'}</span>
                      <span className="font-bold text-[#02070D]">{lang === 'sv' ? ratePlan.nameSv : ratePlan.name}</span>
                    </div>

                    {selectedExtras.length > 0 && (
                      <div className="pt-2 border-t border-[#D3C8B9] space-y-1.5">
                        <span className="font-bold text-[#02070D] block">{lang === 'sv' ? 'Tillval:' : 'Extras:'}</span>
                        {selectedExtras.map(e => (
                          <div key={e.id} className="flex justify-between text-[11px]">
                            <span>{e.name}</span>
                            <span className="font-semibold">{formatSEK(e.priceSEK, lang)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t border-[#D3C8B9] space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{lang === 'sv' ? 'Moms (ingår):' : 'VAT (included):'}</span>
                        <span className="font-mono">{formatSEK(priceCalc.vatRoomSEK + priceCalc.vatExtrasSEK, lang)}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2">
                        <span className="font-serif text-lg font-bold text-[#02070D]">{lang === 'sv' ? 'Totalt SEK:' : 'Total SEK:'}</span>
                        <span className="font-serif text-2xl font-bold text-[#02070D] tabular-nums">
                          {formatSEK(priceCalc.totalGrossSEK, lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 3: GUEST DETAILS ================= */}
        {step === 3 && (
          <form onSubmit={handleGuestInfoSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-white p-6 lg:p-8 rounded-2xl border border-[#EDE7DC] space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#02070D]">
                    {lang === 'sv' ? 'Gästuppgifter & Kontakt' : 'Guest Information'}
                  </h3>
                  <p className="text-xs text-[#25303A] mt-1">
                    {lang === 'sv' ? 'Fyll i dina uppgifter för bokningsbekräftelse och kontakt.' : 'Enter your contact details to receive your booking voucher.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                      {lang === 'sv' ? 'För- och efternamn *' : 'Full Name *'}
                    </label>
                    <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                      <User className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none"
                        placeholder="Carl von Linné"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                      {lang === 'sv' ? 'E-postadress *' : 'Email Address *'}
                    </label>
                    <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                      <Mail className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none"
                        placeholder="namn@epost.se"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                      {lang === 'sv' ? 'Mobiltelefon *' : 'Mobile Phone *'}
                    </label>
                    <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                      <Phone className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none"
                        placeholder="+46 70 123 45 67"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                      {lang === 'sv' ? 'Hemland' : 'Country'}
                    </label>
                    <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                      <MapPin className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                      <select
                        value={guestCountry}
                        onChange={(e) => setGuestCountry(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none cursor-pointer"
                      >
                        <option value="Sverige">Sverige</option>
                        <option value="Norge">Norge</option>
                        <option value="Danmark">Danmark</option>
                        <option value="Finland">Finland</option>
                        <option value="Germany">Germany</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                    {lang === 'sv' ? 'Särskilda önskemål (valfritt)' : 'Special Requests (Optional)'}
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder={lang === 'sv' ? 'T.ex. sen ankomst, allergier, tyst rum...' : 'E.g. late arrival, allergies, quiet room...'}
                    className="w-full bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] p-3 text-xs sm:text-sm text-[#02070D] focus:ring-2 focus:ring-[#BF8641] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 text-xs text-[#25303A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policyAccepted}
                      onChange={(e) => setPolicyAccepted(e.target.checked)}
                      className="rounded accent-[#BF8641] text-[#BF8641] mt-0.5 focus:ring-[#BF8641]"
                    />
                    <span>
                      {lang === 'sv'
                        ? 'Jag godkänner hotellvillkoren och bekräftar att Hotel Nordic Gate är ett kontantfritt och rökfritt hotell.'
                        : 'I accept hotel policies and confirm that Hotel Nordic Gate is a cash-free and smoke-free property.'}
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#EDE7DC]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-[#D3C8B9] hover:border-[#BF8641] text-[#25303A] font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{lang === 'sv' ? 'Tillbaka' : 'Back'}</span>
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'sv' ? 'Granska Bokning' : 'Review Reservation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Col: Summary */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 bg-[#EDE7DC] p-6 rounded-2xl border border-[#D3C8B9] space-y-4 shadow-lg">
                  <h4 className="font-serif text-xl font-bold text-[#02070D] pb-3 border-b border-[#D3C8B9]">
                    {lang === 'sv' ? 'Prissammanställning' : 'Price Summary'}
                  </h4>
                  <div className="space-y-2 text-xs text-[#25303A]">
                    <div className="flex justify-between">
                      <span>{lang === 'sv' ? 'Rum & nätter:' : 'Room & nights:'}</span>
                      <span className="font-bold text-[#02070D]">{formatSEK(priceCalc.roomGrossSEK, lang)}</span>
                    </div>
                    {selectedExtras.map(e => (
                      <div key={e.id} className="flex justify-between text-[11px]">
                        <span>{e.name}:</span>
                        <span>{formatSEK(e.priceSEK, lang)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-[#D3C8B9] flex justify-between items-baseline font-bold">
                      <span className="font-serif text-base text-[#02070D]">{lang === 'sv' ? 'Att betala:' : 'Total due:'}</span>
                      <span className="font-serif text-2xl text-[#02070D]">{formatSEK(priceCalc.totalGrossSEK, lang)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </form>
        )}

        {/* ================= STEP 4: REVIEW & CONFIRM ================= */}
        {step === 4 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#EDE7DC] space-y-6 shadow-md">
              <div className="pb-4 border-b border-[#EDE7DC]">
                <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-bold">
                  {lang === 'sv' ? 'Granska din reservation' : 'Review Your Stay'}
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#02070D] mt-1">
                  {lang === 'sv' ? 'Kontrollera uppgifterna inför bekräftelse' : 'Final Reservation Review'}
                </h3>
              </div>

              {/* Room Card Preview */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#EDE7DC] rounded-xl border border-[#D3C8B9]">
                <img
                  src={room.image}
                  alt={room.name}
                  referrerPolicy="no-referrer"
                  className="w-full sm:w-40 aspect-[16/10] object-cover rounded-lg shadow-xs"
                />
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] text-[#BF8641] uppercase tracking-wider font-bold">
                    Hotel Nordic Gate · Göteborg
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#02070D]">
                    {lang === 'sv' ? room.nameSv : room.name}
                  </h4>
                  <p className="text-[#25303A] font-medium">{checkIn} – {checkOut} ({nights} {lang === 'sv' ? 'nätter' : 'nights'})</p>
                  <p className="text-[#25303A]/80">{adults} {lang === 'sv' ? 'vuxna' : 'adults'}{children > 0 ? `, ${children} barn` : ''}</p>
                </div>
              </div>

              {/* Details table */}
              <div className="space-y-3 text-xs text-[#25303A] bg-[#F8F5EF] p-5 rounded-xl border border-[#EDE7DC]">
                <div className="flex justify-between py-1 border-b border-[#EDE7DC]">
                  <span className="font-semibold text-[#02070D]">{lang === 'sv' ? 'Gäst:' : 'Guest:'}</span>
                  <span>{guestName} ({guestEmail}, {guestPhone})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EDE7DC]">
                  <span className="font-semibold text-[#02070D]">{lang === 'sv' ? 'Pristyp:' : 'Rate Plan:'}</span>
                  <span>{lang === 'sv' ? ratePlan.nameSv : ratePlan.name} ({lang === 'sv' ? ratePlan.cancellationPolicySv : ratePlan.cancellationPolicy})</span>
                </div>
                {selectedExtras.length > 0 && (
                  <div className="flex justify-between py-1 border-b border-[#EDE7DC]">
                    <span className="font-semibold text-[#02070D]">{lang === 'sv' ? 'Tillval:' : 'Extras:'}</span>
                    <span>{selectedExtras.map(e => e.name).join(', ')}</span>
                  </div>
                )}
                {specialRequests && (
                  <div className="flex justify-between py-1 border-b border-[#EDE7DC]">
                    <span className="font-semibold text-[#02070D]">{lang === 'sv' ? 'Önskemål:' : 'Special Requests:'}</span>
                    <span>{specialRequests}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 text-sm font-bold text-[#02070D]">
                  <span>{lang === 'sv' ? 'Totalt belopp (inkl. moms):' : 'Total Amount (incl. VAT):'}</span>
                  <span className="font-serif text-2xl tabular-nums">{formatSEK(priceCalc.totalGrossSEK, lang)}</span>
                </div>
              </div>

              {/* Direct Booking Guarantee */}
              <div className="p-4 bg-[#0D1A26] text-[#F8F5EF] rounded-xl flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#F2C777] shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#F2C777] block">{lang === 'sv' ? 'Säker betalning vid ankomst / förskott' : 'Secure payment with instant voucher'}</span>
                  <span className="text-[#D3C8B9]">{lang === 'sv' ? 'Bokningsbekräftelse genereras direkt med delad synk till gästportalen.' : 'Instant sync with hotel PMS and Guest Portal.'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border border-[#D3C8B9] hover:border-[#BF8641] text-[#25303A] font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'sv' ? 'Ändra uppgifter' : 'Modify Details'}</span>
                </button>

                <button
                  onClick={handleConfirmReservation}
                  className="px-8 py-4 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#F2C777]" />
                  <span>{lang === 'sv' ? 'Bekräfta och Boka Nu' : 'Confirm and Reserve Now'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 5: CONFIRMATION VOUCHER ================= */}
        {step === 5 && confirmedReservation && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 lg:p-10 rounded-2xl border border-[#BF8641]/40 shadow-2xl space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#BF8641] text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F2C777] block">
                  {lang === 'sv' ? 'Bokningsbekräftelse' : 'Booking Confirmation'}
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl text-[#F8F5EF]">
                  {lang === 'sv' ? 'Tack för din bokning!' : 'Reservation Confirmed!'}
                </h2>
                <p className="text-xs text-[#D3C8B9]">
                  {lang === 'sv'
                    ? `En bekräftelse har skickats till ${confirmedReservation.guestEmail}.`
                    : `A confirmation has been sent to ${confirmedReservation.guestEmail}.`}
                </p>
              </div>

              {/* Reference Voucher Card */}
              <div className="bg-white/10 p-6 rounded-xl border border-white/15 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#D3C8B9] font-bold block">{lang === 'sv' ? 'Bokningsnummer' : 'Booking Reference'}</span>
                    <span className="font-mono text-2xl font-bold text-[#F2C777] tracking-wider">{confirmedReservation.bookingReference}</span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#D3C8B9] font-bold block">{lang === 'sv' ? 'Tilldelat rumnummer' : 'Allocated Room'}</span>
                    <span className="font-serif text-xl font-bold text-white">Rum {confirmedReservation.assignedRoomNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#D3C8B9]">
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block font-semibold">{lang === 'sv' ? 'Incheckning' : 'Check-in'}</span>
                    <span className="font-bold text-white">{confirmedReservation.checkInDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block font-semibold">{lang === 'sv' ? 'Utcheckning' : 'Check-out'}</span>
                    <span className="font-bold text-white">{confirmedReservation.checkOutDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block font-semibold">{lang === 'sv' ? 'Gäster' : 'Guests'}</span>
                    <span className="font-bold text-white">{confirmedReservation.adults} vuxna</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block font-semibold">{lang === 'sv' ? 'Totalt SEK' : 'Total'}</span>
                    <span className="font-bold text-[#F2C777]">{formatSEK(confirmedReservation.totalSEK, lang)}</span>
                  </div>
                </div>
              </div>

              {/* Hotel Practical Reminders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#D3C8B9] pt-2">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 text-[#F2C777] shrink-0" />
                  <span>{lang === 'sv' ? 'Frukost ingår varje morgon' : 'Breakfast buffet included'}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2.5">
                  <Droplets className="w-4 h-4 text-[#F2C777] shrink-0" />
                  <span>{lang === 'sv' ? 'Pool & bastu fritt under vistelsen' : 'Free indoor pool & sauna'}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F2C777] shrink-0" />
                  <span>{lang === 'sv' ? 'Gamla Tingstadsgatan 1, Göteborg' : 'Gamla Tingstadsgatan 1'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/guest')}
                  className="px-6 py-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  {lang === 'sv' ? 'Gå till Mina Sidor (Gästportal)' : 'Open Guest Portal'}
                </button>
                <button
                  onClick={() => navigate('/dining')}
                  className="px-6 py-3 border border-white/30 hover:border-white text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  {lang === 'sv' ? 'Boka bord i Restaurangen' : 'Reserve Dinner Table'}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-3 text-xs text-[#D3C8B9] hover:text-white underline cursor-pointer"
                >
                  {lang === 'sv' ? 'Till startsidan' : 'Return to Home'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
