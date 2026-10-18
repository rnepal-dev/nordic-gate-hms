import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { RATE_PLANS, BOOKING_EXTRAS } from '../data/hotelData.ts';
import { calculateNights, calculateBookingPrice, formatSEK, generateBookingReference, generateTransactionReference } from '../lib/pricing.ts';
import { validateBookingDates } from '../lib/hotel-logic.ts';
import type { RatePlanId, SelectedExtra, Reservation, OnlinePaymentMethod } from '../types/hotel.ts';
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
  CheckCircle2,
  Lock,
  Printer,
  Smartphone,
  Building2,
  Receipt
} from 'lucide-react';
import { CANDIDATE_ROOM_CATALOG } from '../data/propertyData.ts';
import { HOTEL_IMAGES } from '../data/hotelData.ts';
import { OnlinePaymentSection } from '../components/booking/OnlinePaymentSection.tsx';

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

  // Booking Engine Steps:
  // 1: Search & Room -> 2: Rate & Extras -> 3: Guest Details -> 4: Online Payment -> 5: Review & Book -> 6: Confirmation
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

  // Payment Details (Online Only)
  const [paymentMethod, setPaymentMethod] = useState<OnlinePaymentMethod>('card');
  const [paymentTransactionId, setPaymentTransactionId] = useState<string>('');
  const [paymentCardMask, setPaymentCardMask] = useState<string>('•••• •••• •••• 4242');
  const [isPaymentAuthorized, setIsPaymentAuthorized] = useState<boolean>(false);

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
      setValidationError(lang === 'sv' ? 'Du måste godkänna hotellvillkoren' : 'You must accept hotel policies');
      return;
    }
    setValidationError(null);
    // Move to Online Payment Layer (Step 4)
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = (details: {
    method: OnlinePaymentMethod;
    transactionId: string;
    cardMask: string;
  }) => {
    setPaymentMethod(details.method);
    setPaymentTransactionId(details.transactionId);
    setPaymentCardMask(details.cardMask);
    setIsPaymentAuthorized(true);
    // Proceed to Step 5 (Review & Book)
    setStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReservation = () => {
    const bookingRef = generateBookingReference('SH');
    const txnId = paymentTransactionId || generateTransactionReference();

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
      paymentMethod,
      paymentTransactionId: txnId,
      paymentCardMask,
      paymentPaidAt: new Date().toISOString(),
      source: 'direct_website',
      createdAt: new Date().toISOString().split('T')[0],
    };

    addReservation(newRes);
    setConfirmedReservation(newRes);
    setActiveBookingRef(bookingRef);
    setStep(6); // Step 6: Confirmation Voucher & Receipt
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepsList = [
    { num: 1, labelSv: 'Rum & Datum', labelEn: 'Dates & Room' },
    { num: 2, labelSv: 'Pristyp & Tillval', labelEn: 'Rates & Extras' },
    { num: 3, labelSv: 'Gästuppgifter', labelEn: 'Guest Details' },
    { num: 4, labelSv: 'Onlinebetalning', labelEn: 'Online Payment' },
    { num: 5, labelSv: 'Granska & Boka', labelEn: 'Review & Book' },
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
                <span>{lang === 'sv' ? '100% Kontantfritt & Säkert' : '100% Cash-Free & Secure'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#F8F5EF] mt-1">
                {lang === 'sv' ? 'Boka din vistelse på Hotel Nordic Gate' : 'Reserve Your Stay at Hotel Nordic Gate'}
              </h1>
            </div>

            {step < 6 && (
              <div className="text-xs font-semibold uppercase tracking-wider text-[#D3C8B9] bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm self-start md:self-auto flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#F2C777]" />
                <span>{lang === 'sv' ? `Steg ${step} av 5` : `Step ${step} of 5`}</span>
              </div>
            )}
          </div>

          {/* Step Progress Pills */}
          {step < 6 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
              {stepsList.map((s) => {
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div 
                    key={s.num}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all ${
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

            {/* Room Category Cards Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#02070D]">
                  {lang === 'sv' ? 'Välj Rumskategori' : 'Select Room Category'}
                </h3>
                <span className="text-xs text-[#25303A] font-medium">
                  {nights} {lang === 'sv' ? (nights > 1 ? 'nätter valda' : 'natt vald') : (nights > 1 ? 'nights selected' : 'night selected')} · {lang === 'sv' ? 'Frukostbuffé och poolentré ingår alltid' : 'Buffet breakfast & pool access always included'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidateRoomsFormatted.map((r) => {
                  const isSelected = selectedCategory === r.id;
                  const nightlyWithMult = Math.round(r.startingPriceSEK * ratePlan.multiplier);
                  const totalEst = nightlyWithMult * nights;

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedCategory(r.id)}
                      className={`group rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#BF8641] bg-white ring-2 ring-[#BF8641]/20 shadow-xl' 
                          : 'border-[#D3C8B9] bg-white hover:border-[#BF8641]/60 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={r.image}
                          alt={r.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-[#0D1A26]/85 backdrop-blur-xs text-[#F2C777] text-[11px] font-semibold px-2.5 py-1 rounded-md">
                          {r.dimensionsM2} m² · {r.bedTypeSv}
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-[#BF8641] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>{lang === 'sv' ? 'Valt rum' : 'Selected'}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="font-serif text-xl font-bold text-[#02070D] group-hover:text-[#BF8641] transition-colors">
                            {lang === 'sv' ? r.nameSv : r.name}
                          </h4>
                          <p className="text-xs text-[#25303A] mt-1 line-clamp-2 leading-relaxed">
                            {lang === 'sv' ? r.descriptionSv : r.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#EDE7DC] flex items-end justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[#25303A]/70 block font-semibold">
                              {lang === 'sv' ? 'Från per natt' : 'From / night'}
                            </span>
                            <span className="font-serif text-2xl font-bold text-[#02070D]">
                              {formatSEK(nightlyWithMult, lang)}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase tracking-wider text-[#25303A]/70 block font-semibold">
                              {lang === 'sv' ? `Totalt (${nights} nät.)` : `Total (${nights} nts)`}
                            </span>
                            <span className="text-xs font-bold text-[#BF8641]">
                              {formatSEK(totalEst, lang)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Button Step 1 */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleDatesNext}
                className="px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'sv' ? 'Fortsätt till Pristyp & Tillval' : 'Continue to Rate & Extras'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ================= STEP 2: RATE PLAN & EXTRAS ================= */}
        {step === 2 && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Col: Rate plans & Extras */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 2A. Rate Plan Selection */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#D3C8B9]">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-bold">
                      {lang === 'sv' ? 'Pristyper & Flexibilitet' : 'Rate Plans & Flexibility'}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#02070D]">
                      {lang === 'sv' ? 'Välj din avbokningspolicy' : 'Select Cancellation Policy'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {RATE_PLANS.map((plan) => {
                      const isSelected = selectedRatePlanId === plan.id;
                      const planNightly = Math.round(room.startingPriceSEK * plan.multiplier);
                      const planTotal = planNightly * nights;

                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedRatePlanId(plan.id)}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                            isSelected 
                              ? 'bg-white border-[#BF8641] ring-2 ring-[#BF8641]/20 shadow-md' 
                              : 'bg-white/80 border-[#D3C8B9] hover:border-[#BF8641]/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#BF8641] bg-[#BF8641]' : 'border-[#D3C8B9]'
                            }`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-serif text-lg font-bold text-[#02070D]">
                                {lang === 'sv' ? plan.nameSv : plan.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-[#25303A]/80 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#BF8641]" />
                                <span>{lang === 'sv' ? plan.cancellationPolicySv : plan.cancellationPolicy}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-left sm:text-right shrink-0 pl-8 sm:pl-0">
                            <span className="font-serif text-xl font-bold text-[#02070D]">
                              {formatSEK(planTotal, lang)}
                            </span>
                            <span className="block text-[10px] text-[#25303A]/70">
                              {formatSEK(planNightly, lang)} / {lang === 'sv' ? 'natt' : 'night'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2B. Extras & Add-ons */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#D3C8B9]">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-bold">
                      {lang === 'sv' ? 'Hotelltillval & Bekvämligheter' : 'Enhance Your Stay'}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#02070D]">
                      {lang === 'sv' ? 'Lägg till extra upplevelser' : 'Optional Add-ons'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {BOOKING_EXTRAS.map((extra) => {
                      const isAdded = selectedExtras.some(e => e.id === extra.id);
                      return (
                        <div
                          key={extra.id}
                          onClick={() => toggleExtra(extra.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isAdded 
                              ? 'bg-white border-[#BF8641] ring-2 ring-[#BF8641]/20 shadow-md' 
                              : 'bg-white/80 border-[#D3C8B9] hover:border-[#BF8641]/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-serif font-bold text-base text-[#02070D]">
                                {lang === 'sv' ? extra.nameSv : extra.name}
                              </h5>
                              <span className="text-xs font-bold text-[#BF8641]">
                                +{formatSEK(extra.priceSEK, lang)}
                              </span>
                            </div>
                            <p className="text-xs text-[#25303A] leading-relaxed">
                              {lang === 'sv' ? extra.unitDescriptionSv : extra.unitDescription}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-[#EDE7DC] flex justify-end">
                            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md transition-colors ${
                              isAdded 
                                ? 'bg-[#BF8641] text-white' 
                                : 'bg-[#EDE7DC] text-[#02070D] group-hover:bg-[#D3C8B9]'
                            }`}>
                              {isAdded ? (lang === 'sv' ? '✓ Tillagd' : '✓ Added') : (lang === 'sv' ? '+ Lägg till' : '+ Add')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Back / Next Nav */}
                <div className="flex items-center justify-between pt-4 border-t border-[#D3C8B9]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-[#D3C8B9] hover:border-[#BF8641] text-[#25303A] font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{lang === 'sv' ? 'Tillbaka' : 'Back'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'sv' ? 'Fortsätt till Gästuppgifter' : 'Continue to Guest Details'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Col: Sticky Price Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 bg-[#EDE7DC] p-6 rounded-2xl border border-[#D3C8B9] space-y-4 shadow-lg">
                  <h4 className="font-serif text-xl font-bold text-[#02070D] pb-3 border-b border-[#D3C8B9]">
                    {lang === 'sv' ? 'Prissammanställning' : 'Price Summary'}
                  </h4>

                  <div className="space-y-2 text-xs text-[#25303A]">
                    <div className="flex justify-between">
                      <span>{lang === 'sv' ? 'Valt rum:' : 'Selected room:'}</span>
                      <span className="font-bold text-[#02070D]">{lang === 'sv' ? room.nameSv : room.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'sv' ? 'Datum:' : 'Dates:'}</span>
                      <span>{checkIn} → {checkOut} ({nights} {lang === 'sv' ? 'nätter' : 'nights'})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'sv' ? 'Pristyp:' : 'Rate plan:'}</span>
                      <span>{lang === 'sv' ? ratePlan.nameSv : ratePlan.name}</span>
                    </div>
                    
                    <div className="pt-2 border-t border-[#D3C8B9] flex justify-between">
                      <span>{lang === 'sv' ? 'Rumssumma:' : 'Room subtotal:'}</span>
                      <span className="font-bold text-[#02070D]">{formatSEK(priceCalc.roomGrossSEK, lang)}</span>
                    </div>

                    {selectedExtras.map(e => (
                      <div key={e.id} className="flex justify-between text-[11px] text-[#25303A]">
                        <span>+ {e.name}:</span>
                        <span>{formatSEK(e.priceSEK, lang)}</span>
                      </div>
                    ))}

                    <div className="pt-3 border-t border-[#D3C8B9] space-y-1">
                      <div className="flex justify-between text-base font-bold text-[#02070D]">
                        <span>{lang === 'sv' ? 'Totalt belopp:' : 'Total amount:'}</span>
                        <span className="font-serif text-xl text-[#BF8641]">{formatSEK(priceCalc.totalGrossSEK, lang)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#25303A]/70">
                        <span>{lang === 'sv' ? 'Varav hotellmoms (12%):' : 'Incl. room VAT (12%):'}</span>
                        <span>{formatSEK(priceCalc.vatRoomSEK, lang)}</span>
                      </div>
                      {priceCalc.vatExtrasSEK > 0 && (
                        <div className="flex justify-between text-[11px] text-[#25303A]/70">
                          <span>{lang === 'sv' ? 'Varav tillvalsmoms (25%):' : 'Incl. extras VAT (25%):'}</span>
                          <span>{formatSEK(priceCalc.vatExtrasSEK, lang)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 3: GUEST DETAILS ================= */}
        {step === 3 && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#D3C8B9] space-y-6 shadow-sm">
                
                <div className="pb-4 border-b border-[#EDE7DC]">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-bold">
                    {lang === 'sv' ? 'Gästinformation' : 'Guest Information'}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#02070D]">
                    {lang === 'sv' ? 'Vem checkar in på hotellet?' : 'Primary Guest Details'}
                  </h3>
                </div>

                <form onSubmit={handleGuestInfoSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                        {lang === 'sv' ? 'För- & Efternamn *' : 'Full Name *'}
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
                          ? 'Jag godkänner hotellvillkoren och bekräftar att Hotel Nordic Gate är ett kontantfritt och rökfritt hotell med säker onlinebetalning.'
                          : 'I accept hotel policies and confirm that Hotel Nordic Gate is a cash-free and smoke-free property accepting secure online payments.'}
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
                      <Lock className="w-4 h-4 text-[#F2C777]" />
                      <span>{lang === 'sv' ? 'Fortsätt till Betalning' : 'Proceed to Payment'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </form>

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
                    <div className="pt-2 border-t border-[#D3C8B9] flex justify-between text-base font-bold text-[#02070D]">
                      <span>{lang === 'sv' ? 'Att betala online:' : 'Due online:'}</span>
                      <span className="font-serif text-xl text-[#BF8641]">{formatSEK(priceCalc.totalGrossSEK, lang)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 4: ONLINE PAYMENT LAYER ================= */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#D3C8B9]">
              <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-bold">
                {lang === 'sv' ? 'Säker Onlinebetalning' : 'Secure Online Payment'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#02070D] mt-0.5">
                {lang === 'sv' ? 'Genomför betalning för din hotellvistelse' : 'Authorize Payment for Your Reservation'}
              </h3>
              <p className="text-xs text-[#25303A] mt-1">
                {lang === 'sv'
                  ? 'Hotel Nordic Gate är kontantfritt. Välj betalkort med 3D Secure, Swish, eller Klarna direktbank med BankID.'
                  : 'Hotel Nordic Gate is cash-free. Choose card payment with 3D Secure, Swish, or Klarna direct bank.'}
              </p>
            </div>

            <OnlinePaymentSection
              totalGrossSEK={priceCalc.totalGrossSEK}
              vatRoomSEK={priceCalc.vatRoomSEK}
              vatExtrasSEK={priceCalc.vatExtrasSEK}
              guestName={guestName}
              guestEmail={guestEmail}
              guestPhone={guestPhone}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={() => setStep(3)}
            />
          </div>
        )}

        {/* ================= STEP 5: REVIEW & CONFIRM ================= */}
        {step === 5 && (
          <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D3C8B9] space-y-6 shadow-sm">
              
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

              {/* Verified Online Payment Badge */}
              <div className="p-4 bg-[#0D1A26] text-[#F8F5EF] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#BF8641]/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BF8641]/20 flex items-center justify-center text-[#F2C777] shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F2C777] uppercase tracking-wider block">
                      {lang === 'sv' ? '✓ Betalning auktoriserad online' : '✓ Online Payment Authorized'}
                    </span>
                    <span className="text-xs text-[#D3C8B9]">
                      {paymentMethod === 'card' 
                        ? `Kortbetalning (${paymentCardMask})` 
                        : paymentMethod === 'swish'
                        ? `Swish (${paymentCardMask})`
                        : paymentMethod === 'klarna'
                        ? `Klarna (${paymentCardMask})`
                        : 'Apple Pay'}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-[#D3C8B9] uppercase tracking-wider block">
                    {lang === 'sv' ? 'Transaktions-ID' : 'Transaction ID'}
                  </span>
                  <span className="font-mono text-xs font-bold text-white">
                    {paymentTransactionId || 'TXN-NG-PENDING'}
                  </span>
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
                  <span>{lang === 'sv' ? 'Totalt belopp att dra (inkl. moms):' : 'Total Amount Charged (incl. VAT):'}</span>
                  <span className="font-serif text-2xl tabular-nums text-[#02070D]">{formatSEK(priceCalc.totalGrossSEK, lang)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 border border-[#D3C8B9] hover:border-[#BF8641] text-[#25303A] font-semibold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'sv' ? 'Ändra betalsätt' : 'Modify Payment Method'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmReservation}
                  className="px-8 py-4 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#F2C777]" />
                  <span>{lang === 'sv' ? 'Slutför Bokning & Erhåll Kvitto' : 'Confirm & Complete Reservation'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 6: CONFIRMATION VOUCHER & RECEIPT ================= */}
        {step === 6 && confirmedReservation && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 lg:p-10 rounded-2xl border border-[#BF8641]/40 shadow-2xl space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#BF8641] text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F2C777] block">
                  {lang === 'sv' ? 'Bokningsbekräftelse & Betalkvitto' : 'Booking Confirmation & Receipt'}
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl text-[#F8F5EF]">
                  {lang === 'sv' ? 'Tack för din bokning & betalning!' : 'Reservation & Payment Confirmed!'}
                </h2>
                <p className="text-xs text-[#D3C8B9]">
                  {lang === 'sv'
                    ? `En officiell bekräftelse och kvitto har skickats till ${confirmedReservation.guestEmail}.`
                    : `An official confirmation and receipt have been sent to ${confirmedReservation.guestEmail}.`}
                </p>
              </div>

              {/* Reference Voucher Card */}
              <div className="bg-white/10 p-6 rounded-xl border border-white/15 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#D3C8B9] font-bold block">
                      {lang === 'sv' ? 'Bokningsnummer' : 'Booking Reference'}
                    </span>
                    <span className="font-mono text-2xl font-bold text-[#F2C777] tracking-wider">
                      {confirmedReservation.bookingReference}
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#D3C8B9] font-bold block">
                      {lang === 'sv' ? 'Tilldelat rumnummer' : 'Allocated Room'}
                    </span>
                    <span className="font-serif text-xl font-bold text-white">
                      Rum {confirmedReservation.assignedRoomNumber}
                    </span>
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
                    <span className="font-bold text-white">{confirmedReservation.adults} {lang === 'sv' ? 'vuxna' : 'adults'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block font-semibold">{lang === 'sv' ? 'Totalt SEK' : 'Total'}</span>
                    <span className="font-bold text-[#F2C777]">{formatSEK(confirmedReservation.totalSEK, lang)}</span>
                  </div>
                </div>
              </div>

              {/* Official Payment Receipt Section */}
              <div className="bg-[#EDE7DC] text-[#02070D] p-5 rounded-xl border border-[#D3C8B9] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#D3C8B9]">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#BF8641]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#02070D]">
                      {lang === 'sv' ? 'Officiellt Kvitto underlag (Moms specifikation)' : 'Official Payment Receipt & Taxes'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    ✓ {lang === 'sv' ? 'Betald online' : 'Paid online'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-[#25303A]/70 uppercase block font-semibold">
                      {lang === 'sv' ? 'Betalningsmetod' : 'Payment Method'}
                    </span>
                    <span className="font-medium text-[#02070D]">
                      {confirmedReservation.paymentMethod === 'card'
                        ? `Kort (${confirmedReservation.paymentCardMask || 'Visa'})`
                        : confirmedReservation.paymentMethod === 'swish'
                        ? `Swish (${confirmedReservation.paymentCardMask})`
                        : confirmedReservation.paymentMethod === 'klarna'
                        ? `Klarna (${confirmedReservation.paymentCardMask})`
                        : 'Apple Pay'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#25303A]/70 uppercase block font-semibold">
                      {lang === 'sv' ? 'Transaktionsreferens' : 'Transaction Ref'}
                    </span>
                    <span className="font-mono text-[11px] text-[#02070D]">
                      {confirmedReservation.paymentTransactionId || 'TXN-NG-ONLINE'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#25303A]/70 uppercase block font-semibold">
                      {lang === 'sv' ? 'Moms-specifikation' : 'VAT Specification'}
                    </span>
                    <span className="text-[11px] text-[#02070D]">
                      12%: {formatSEK(confirmedReservation.vatRoomSEK, lang)}
                      {confirmedReservation.vatExtrasSEK > 0 && ` · 25%: ${formatSEK(confirmedReservation.vatExtrasSEK, lang)}`}
                    </span>
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
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#F2C777]" />
                  <span>{lang === 'sv' ? 'Skriv ut Kvitto & Bokning' : 'Print Voucher & Receipt'}</span>
                </button>
                <button
                  onClick={() => navigate('/guest')}
                  className="px-6 py-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  {lang === 'sv' ? 'Gå till Mina Sidor (Gästportal)' : 'Open Guest Portal'}
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
