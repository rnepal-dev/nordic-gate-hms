import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { BOOKING_EXTRAS } from '../data/hotelData.ts';
import { formatSEK, generateTransactionReference } from '../lib/pricing.ts';
import { calculateCalendarNights, validateBookingDatesCalendar } from '../lib/date-logic.ts';
import type { SelectedExtra, Reservation, OnlinePaymentMethod } from '../types/hotel.ts';
import { 
  Calendar, 
  Users, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Lock, 
  Printer, 
  Info,
  Clock,
  Sparkles,
  Building2,
  Receipt
} from 'lucide-react';
import { CANDIDATE_ROOM_CATALOG } from '../data/propertyData.ts';
import { HOTEL_IMAGES } from '../data/hotelData.ts';
import { OnlinePaymentSection } from '../components/booking/OnlinePaymentSection.tsx';
import { RatePlanSelector } from '../components/booking/RatePlanSelector.tsx';
import { 
  useGetAvailabilityQuery, 
  useCreateReservationMutation 
} from '../redux/feature/bookings/bookingApi.ts';
import type { 
  AvailableRoomType, 
  AvailableRoomRatePlan, 
  ReservationCreate, 
  ReservationResponse 
} from '../redux/feature/bookings/bookingTypes.ts';

export const BookingEngineView: React.FC = () => {
  const { 
    lang, 
    searchCriteria, 
    setSearchCriteria, 
    addReservation, 
    setActiveBookingRef,
    navigate 
  } = useHotel();

  // Booking Engine Steps:
  // 1: Search & Room -> 2: Rate & Extras -> 3: Guest Details -> 4: Online Payment -> 5: Review & Confirmation
  const [step, setStep] = useState<number>(1);

  // Search Criteria Form State
  const [checkIn, setCheckIn] = useState(searchCriteria.checkIn || '2026-11-15');
  const [checkOut, setCheckOut] = useState(searchCriteria.checkOut || '2026-11-17');
  const [adults, setAdults] = useState(searchCriteria.adults || 2);
  const [children, setChildren] = useState(searchCriteria.children || 0);

  // Selected Room & Rate Plan
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(null);
  const [selectedRatePlanId, setSelectedRatePlanId] = useState<number | null>(null);

  // Ancillary Extras
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);

  // Guest Details
  const [firstName, setFirstName] = useState('Carl');
  const [lastName, setLastName] = useState('von Linné');
  const [guestEmail, setGuestEmail] = useState('carl.linne@botanik.se');
  const [guestPhone, setGuestPhone] = useState('+46 70 123 45 67');
  const [guestCountry, setGuestCountry] = useState('Sverige');
  const [specialRequests, setSpecialRequests] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Payment Details (Online Only)
  const [paymentMethod, setPaymentMethod] = useState<OnlinePaymentMethod>('card');
  const [paymentTransactionId, setPaymentTransactionId] = useState<string>('');
  const [paymentCardMask, setPaymentCardMask] = useState<string>('•••• •••• •••• 4242');

  // Backend Created Reservation (Status: pending_payment until paid)
  const [backendReservation, setBackendReservation] = useState<ReservationResponse | null>(null);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Real-time Availability Query
  const {
    data: availabilityData,
    isLoading: isAvailabilityLoading,
    isFetching: isAvailabilityFetching,
    error: availabilityError,
    refetch: refetchAvailability,
  } = useGetAvailabilityQuery({
    check_in: checkIn,
    check_out: checkOut,
    adults,
    children,
  });

  const [createReservationMutation, { isLoading: isCreatingReservation }] = useCreateReservationMutation();

  const nights = calculateCalendarNights(checkIn, checkOut);

  // Auto-select first room type and rate plan when availability data loads
  const availableRooms: AvailableRoomType[] = availabilityData?.available_room_types || [];

  useEffect(() => {
    if (availableRooms.length > 0) {
      if (!selectedRoomTypeId || !availableRooms.some(r => r.room_type_id === selectedRoomTypeId)) {
        const firstRoom = availableRooms[0];
        setSelectedRoomTypeId(firstRoom.room_type_id);
        if (firstRoom.rate_plans && firstRoom.rate_plans.length > 0) {
          setSelectedRatePlanId(firstRoom.rate_plans[0].rate_plan_id);
        }
      }
    }
  }, [availableRooms, selectedRoomTypeId]);

  const activeRoomType: AvailableRoomType | undefined = 
    availableRooms.find(r => r.room_type_id === selectedRoomTypeId) || availableRooms[0];

  const activeRatePlan: AvailableRoomRatePlan | undefined = 
    activeRoomType?.rate_plans?.find(p => p.rate_plan_id === selectedRatePlanId) || 
    activeRoomType?.rate_plans?.[0];

  // Map room image from property catalog or fallback
  const getRoomImage = (roomType: AvailableRoomType): string => {
    if (roomType.image_url && roomType.image_url.startsWith('http')) {
      return roomType.image_url;
    }
    const matched = CANDIDATE_ROOM_CATALOG.find(
      c => c.id === roomType.room_type_slug || c.name.toLowerCase() === roomType.room_type_name.toLowerCase()
    );
    if (matched && matched.images && matched.images.length > 0) {
      return matched.images[0];
    }
    if (roomType.room_type_slug.includes('suite') || roomType.room_type_name.includes('Suite')) {
      return HOTEL_IMAGES.heritageSuite;
    }
    return HOTEL_IMAGES.deluxeCanal;
  };

  // Price calculations
  const roomTotalSEK = activeRatePlan ? Math.round(parseFloat(activeRatePlan.total_price)) : 0;
  const extrasTotalSEK = selectedExtras.reduce((sum, e) => sum + e.priceSEK * e.count, 0);
  const totalGrossSEK = roomTotalSEK + extrasTotalSEK;
  const vatRoomSEK = Math.round((roomTotalSEK * 12) / 112);
  const vatExtrasSEK = selectedExtras.reduce((sum, e) => {
    const rate = e.vatRate || 0.25;
    return sum + Math.round((e.priceSEK * e.count * rate) / (1 + rate));
  }, 0);

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
    const val = validateBookingDatesCalendar(checkIn, checkOut);
    if (!val.isValid) {
      setValidationError(val.error || (lang === 'sv' ? 'Kontrollera datumen' : 'Please check your dates'));
      return;
    }
    if (!activeRoomType) {
      setValidationError(lang === 'sv' ? 'Vänligen välj ett ledigt rum' : 'Please select an available room');
      return;
    }
    setValidationError(null);
    setSearchCriteria(prev => ({ ...prev, checkIn, checkOut, adults, children }));
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuestInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setValidationError(lang === 'sv' ? 'Vänligen fyll i alla obligatoriska fält' : 'Please fill in all required fields');
      return;
    }
    if (!acceptTerms) {
      setValidationError(lang === 'sv' ? 'Du måste godkänna hotellvillkoren' : 'You must accept the hotel terms');
      return;
    }
    if (!activeRoomType || !activeRatePlan) {
      setValidationError(lang === 'sv' ? 'Välj rum och prisplan innan du fortsätter' : 'Please select a room and rate plan first');
      return;
    }

    setValidationError(null);

    try {
      const payload: ReservationCreate = {
        room_type_id: activeRoomType.room_type_id,
        rate_plan_id: activeRatePlan.rate_plan_id,
        check_in: checkIn,
        check_out: checkOut,
        adults,
        children,
        guest_first_name: firstName.trim(),
        guest_last_name: lastName.trim(),
        guest_email: guestEmail.trim(),
        guest_phone: guestPhone.trim(),
        guest_country: guestCountry,
        special_requests: specialRequests.trim(),
        accept_booking_terms: true,
        booking_terms_version: '2026.1',
      };

      const res = await createReservationMutation(payload).unwrap();
      setBackendReservation(res);
      setActiveBookingRef(res.booking_reference);

      // Advance to payment step
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const message = err?.data?.error || err?.message || (lang === 'sv' ? 'Kunde inte skapa reservation. Försök igen.' : 'Could not create reservation. Please try again.');
      setValidationError(message);
    }
  };

  const handlePaymentSuccess = (details: {
    method: OnlinePaymentMethod;
    transactionId: string;
    cardMask: string;
  }) => {
    setPaymentMethod(details.method);
    setPaymentTransactionId(details.transactionId);
    setPaymentCardMask(details.cardMask);

    const bookingRef = backendReservation?.booking_reference || `SH-${Math.floor(10000 + Math.random() * 90000)}`;
    const txnId = details.transactionId || generateTransactionReference();

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      bookingReference: bookingRef,
      guestName: `${firstName} ${lastName}`,
      guestEmail,
      guestPhone,
      guestCountry,
      roomCategoryId: (activeRoomType?.room_type_slug || 'compact-double') as any,
      assignedRoomNumber: activeRoomType?.room_type_id === 5 ? '207' : activeRoomType?.room_type_id === 4 ? '114' : activeRoomType?.room_type_id === 3 ? '108' : '102',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      adults,
      children,
      ratePlanId: (activeRatePlan?.rate_plan_code?.toLowerCase() || 'flexible') as any,
      extras: selectedExtras,
      specialRequests,
      status: 'confirmed',
      totalSEK: totalGrossSEK,
      vatRoomSEK,
      vatExtrasSEK,
      paymentStatus: 'paid',
      paymentMethod: details.method,
      paymentTransactionId: txnId,
      paymentCardMask: details.cardMask,
      paymentPaidAt: new Date().toISOString(),
      source: 'direct_website',
      createdAt: new Date().toISOString().split('T')[0],
    };

    addReservation(newRes);
    setConfirmedReservation(newRes);
    setActiveBookingRef(bookingRef);
    setStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepsList = [
    { num: 1, labelSv: 'Rum & Tillgänglighet', labelEn: 'Rooms & Availability' },
    { num: 2, labelSv: 'Pristyp & Tillval', labelEn: 'Rates & Extras' },
    { num: 3, labelSv: 'Gästuppgifter', labelEn: 'Guest Details' },
    { num: 4, labelSv: 'Säker Betalning', labelEn: 'Online Payment' },
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
                <span>{lang === 'sv' ? '100% Kontantfritt & Realtidstillgänglighet' : '100% Cash-Free & Real-Time Availability'}</span>
              </div>
              <h1 className="type-h1 text-2xl sm:text-3xl lg:text-4xl text-[#F8F5EF] mt-1 font-bold">
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

        {/* ================= STEP 1: DATES & ROOM SELECTION WITH REAL-TIME AVAILABILITY ================= */}
        {step === 1 && (
          <div className="space-y-8">
            
            {/* Search Criteria Box */}
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

            {/* Availability Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h3 className="type-h2 text-2xl sm:text-3xl font-semibold text-[#02070D]">
                  {lang === 'sv' ? 'Lediga rum & Priser i realtid' : 'Available Rooms & Real-time Rates'}
                </h3>
                <p className="text-xs text-[#5D6B78] mt-0.5">
                  {nights} {lang === 'sv' ? (nights > 1 ? 'nätter' : 'natt') : (nights > 1 ? 'nights' : 'night')} · {adults} {lang === 'sv' ? 'vuxna' : 'adults'}{children > 0 ? `, ${children} ${lang === 'sv' ? 'barn' : 'children'}` : ''} · {lang === 'sv' ? 'Skandinavisk frukostbuffé och poolentré ingår alltid' : 'Buffet breakfast & heated pool entrance always included'}
                </p>
              </div>

              {isAvailabilityFetching && (
                <div className="text-xs text-[#BF8641] font-semibold flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === 'sv' ? 'Söker realtidspriser...' : 'Updating availability...'}</span>
                </div>
              )}
            </div>

            {/* Loading Skeleton */}
            {isAvailabilityLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#EDE7DC] p-6 space-y-4 animate-pulse">
                    <div className="aspect-[16/10] bg-stone-200 rounded-xl" />
                    <div className="h-6 bg-stone-200 rounded-md w-3/4" />
                    <div className="h-4 bg-stone-100 rounded-md w-1/2" />
                    <div className="h-20 bg-stone-50 rounded-xl border border-stone-200" />
                  </div>
                ))}
              </div>
            ) : availabilityError ? (
              <div className="p-8 text-center bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <h4 className="text-base font-bold text-rose-900">
                  {lang === 'sv' ? 'Kunde inte hämta tillgänglighet' : 'Could not fetch availability'}
                </h4>
                <p className="text-xs text-rose-700 max-w-md mx-auto">
                  {lang === 'sv'
                    ? 'Ett nätverksfel uppstod vid kontroll av rumsstatus. Klicka nedan för att försöka igen.'
                    : 'A network error occurred while checking room inventory. Click below to retry.'}
                </p>
                <button
                  onClick={() => refetchAvailability()}
                  className="px-5 py-2 bg-[#BF8641] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  {lang === 'sv' ? 'Försök igen' : 'Retry'}
                </button>
              </div>
            ) : availableRooms.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#EDE7DC] space-y-4">
                <Building2 className="w-12 h-12 text-[#BF8641] mx-auto opacity-70" />
                <h4 className="font-serif text-2xl font-bold text-[#0D1A26]">
                  {lang === 'sv' ? 'Inga lediga rum matchar sökkriterierna' : 'No available rooms found'}
                </h4>
                <p className="text-xs text-[#5D6B78] max-w-md mx-auto leading-relaxed">
                  {lang === 'sv'
                    ? 'För valt antal gäster eller datum finns inga tillgängliga rum. Vänligen justera datumen eller antalet gäster och sök på nytt.'
                    : 'No rooms match your chosen occupancy or dates. Please select different stay dates or adjust the party size.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {availableRooms.map((room) => {
                  const isSelected = selectedRoomTypeId === room.room_type_id;
                  const roomImage = getRoomImage(room);

                  return (
                    <div
                      key={room.room_type_id}
                      onClick={() => {
                        setSelectedRoomTypeId(room.room_type_id);
                        if (room.rate_plans && room.rate_plans.length > 0) {
                          setSelectedRatePlanId(room.rate_plans[0].rate_plan_id);
                        }
                      }}
                      className={`rounded-2xl border transition-all overflow-hidden bg-white shadow-sm hover:shadow-md cursor-pointer ${
                        isSelected 
                          ? 'border-[#BF8641] ring-2 ring-[#BF8641]/20' 
                          : 'border-[#EDE7DC] hover:border-[#D3C8B9]'
                      }`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                        
                        {/* Image & Quick badges */}
                        <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-auto sm:h-full min-h-[220px] rounded-xl overflow-hidden">
                          <img
                            src={roomImage}
                            alt={room.room_type_name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 bg-[#0D1A26]/85 backdrop-blur-xs text-[#F2C777] text-[11px] font-semibold px-2.5 py-1 rounded-md">
                            {room.size_sqm ? `${room.size_sqm} m²` : '20 m²'} · {lang === 'sv' ? 'Max' : 'Max'} {room.max_occupancy} {lang === 'sv' ? 'gäster' : 'guests'}
                          </div>
                          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>
                              {room.available_rooms_count} {lang === 'sv' ? 'rum lediga' : 'rooms left'}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-3 right-3 bg-[#BF8641] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>{lang === 'sv' ? 'Valt rum' : 'Selected'}</span>
                            </div>
                          )}
                        </div>

                        {/* Room Info & Rate Plan Comparison */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#EDE7DC]">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-[#BF8641] font-bold block">
                                  Hotel Nordic Gate · Göteborg
                                </span>
                                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#02070D]">
                                  {room.room_type_name}
                                </h4>
                              </div>
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] uppercase tracking-wider text-[#5D6B78] block font-semibold">
                                  {lang === 'sv' ? 'Från per natt' : 'From / night'}
                                </span>
                                <span className="type-price text-2xl font-bold text-[#02070D]">
                                  {formatSEK(parseFloat(room.starting_price || '1295'), lang)}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-[#25303A] mt-2 leading-relaxed">
                              {room.description}
                            </p>

                            {room.amenities && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {room.amenities.split(',').slice(0, 4).map((a, idx) => (
                                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-[#EDE7DC] text-[#02070D] font-medium">
                                    {a.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Embedded Rate Plan Selector */}
                          <RatePlanSelector
                            roomType={room}
                            selectedRatePlanId={isSelected ? (selectedRatePlanId || (room.rate_plans[0]?.rate_plan_id ?? 0)) : (room.rate_plans[0]?.rate_plan_id ?? 0)}
                            onSelectRatePlan={(plan) => {
                              setSelectedRoomTypeId(room.room_type_id);
                              setSelectedRatePlanId(plan.rate_plan_id);
                            }}
                            nights={nights}
                            lang={lang}
                          />

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Next Button Step 1 */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleDatesNext}
                disabled={!activeRoomType || isAvailabilityLoading}
                className="px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] disabled:opacity-50 text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{lang === 'sv' ? 'Fortsätt till Pristyp & Tillval' : 'Continue to Rate & Extras'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ================= STEP 2: RATE PLAN & EXTRAS ================= */}
        {step === 2 && activeRoomType && activeRatePlan && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Col: Rate plans & Extras */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 2A. Chosen Rate Plan Review & Switcher */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#D3C8B9]">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-bold">
                      {lang === 'sv' ? 'Vald pristyp & avbokningsvillkor' : 'Selected Rate Plan & Flexibility'}
                    </span>
                    <h3 className="type-h3 text-xl sm:text-2xl font-semibold text-[#02070D]">
                      {lang === 'sv' ? 'Justera eller bekräfta ditt val' : 'Confirm Your Chosen Plan'}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {activeRoomType.rate_plans.map((plan) => {
                      const isSelected = selectedRatePlanId === plan.rate_plan_id;
                      const planTotal = Math.round(parseFloat(plan.total_price));
                      const planNightly = Math.round(parseFloat(plan.nightly_average));

                      return (
                        <div
                          key={plan.rate_plan_id}
                          onClick={() => setSelectedRatePlanId(plan.rate_plan_id)}
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
                              <h4 className="type-h4 text-base sm:text-lg font-semibold text-[#02070D]">
                                {plan.rate_plan_name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-[#25303A]/80 font-medium">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#BF8641]" />
                                <span>
                                  {plan.cancellation_policy === 'flexible'
                                    ? (lang === 'sv' ? `Fri avbokning fram till ${plan.free_cancellation_deadline_hours || 24} timmar före ankomst` : `Free cancellation up to ${plan.free_cancellation_deadline_hours || 24}h before check-in`)
                                    : (lang === 'sv' ? 'Ej ombokningsbar · Bästa dagspris' : 'Non-refundable · Best guaranteed rate')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-left sm:text-right shrink-0 pl-8 sm:pl-0">
                            <span className="type-price text-xl font-bold text-[#02070D]">
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

                {/* 2B. Ancillary Extras */}
                <div className="space-y-4">
                  <div className="pb-2 border-b border-[#D3C8B9]">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-bold">
                      {lang === 'sv' ? 'Hotelltillval & Upplevelser' : 'Enhance Your Stay'}
                    </span>
                    <h3 className="type-h3 text-xl sm:text-2xl font-semibold text-[#02070D]">
                      {lang === 'sv' ? 'Lägg till guldkant på din vistelse' : 'Optional Add-ons & Experiences'}
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
                              <h5 className="type-h4 font-semibold text-base text-[#02070D]">
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
                    <span>{lang === 'sv' ? 'Tillbaka till rum' : 'Back to Rooms'}</span>
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
                  <h4 className="type-h4 text-lg sm:text-xl font-semibold text-[#02070D] pb-3 border-b border-[#D3C8B9]">
                    {lang === 'sv' ? 'Prissammanställning' : 'Price Summary'}
                  </h4>

                  <div className="space-y-2 text-xs text-[#25303A]">
                    <div className="flex justify-between">
                      <span>{lang === 'sv' ? 'Valt rum:' : 'Selected room:'}</span>
                      <span className="font-bold text-[#02070D]">{activeRoomType.room_type_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'sv' ? 'Datum:' : 'Dates:'}</span>
                      <span>{checkIn} → {checkOut} ({nights} {lang === 'sv' ? 'nätter' : 'nights'})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'sv' ? 'Pristyp:' : 'Rate plan:'}</span>
                      <span className="font-semibold text-[#02070D]">{activeRatePlan.rate_plan_name}</span>
                    </div>
                    
                    <div className="pt-2 border-t border-[#D3C8B9] flex justify-between">
                      <span>{lang === 'sv' ? 'Rumssumma:' : 'Room subtotal:'}</span>
                      <span className="font-bold text-[#02070D]">{formatSEK(roomTotalSEK, lang)}</span>
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
                        <span className="type-price text-xl text-[#BF8641] font-bold">{formatSEK(totalGrossSEK, lang)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#25303A]/70">
                        <span>{lang === 'sv' ? 'Varav hotellmoms (12%):' : 'Incl. room VAT (12%):'}</span>
                        <span>{formatSEK(vatRoomSEK, lang)}</span>
                      </div>
                      {vatExtrasSEK > 0 && (
                        <div className="flex justify-between text-[11px] text-[#25303A]/70">
                          <span>{lang === 'sv' ? 'Varav tillvalsmoms (25%):' : 'Incl. extras VAT (25%):'}</span>
                          <span>{formatSEK(vatExtrasSEK, lang)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 3: GUEST DETAILS & BACKEND RESERVATION ================= */}
        {step === 3 && activeRoomType && activeRatePlan && (
          <div className="space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#D3C8B9] space-y-6 shadow-sm">
                
                <div className="pb-4 border-b border-[#EDE7DC]">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-bold">
                    {lang === 'sv' ? 'Gästinformation' : 'Guest Information'}
                  </span>
                  <h3 className="type-h3 text-xl sm:text-2xl font-semibold text-[#02070D]">
                    {lang === 'sv' ? 'Vem checkar in på hotellet?' : 'Primary Guest Details'}
                  </h3>
                </div>

                <form onSubmit={handleGuestInfoSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                        {lang === 'sv' ? 'Förnamn *' : 'First Name *'}
                      </label>
                      <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                        <User className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none"
                          placeholder="Carl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1.5">
                        {lang === 'sv' ? 'Efternamn *' : 'Last Name *'}
                      </label>
                      <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3 py-2.5">
                        <User className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#02070D] focus:outline-none"
                          placeholder="von Linné"
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

                    <div className="sm:col-span-2">
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
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="rounded accent-[#BF8641] text-[#BF8641] mt-0.5 focus:ring-[#BF8641]"
                      />
                      <span>
                        {lang === 'sv'
                          ? 'Jag godkänner hotellvillkoren (version 2026.1) och bekräftar att Hotel Nordic Gate är ett kontantfritt och rökfritt hotell med säker onlinebetalning.'
                          : 'I accept hotel policies (version 2026.1) and confirm that Hotel Nordic Gate is a cash-free and smoke-free property accepting secure online payments.'}
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
                      disabled={isCreatingReservation}
                      className="px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] disabled:opacity-50 text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-[#F2C777]" />
                      <span>
                        {isCreatingReservation 
                          ? (lang === 'sv' ? 'Reserverar rum...' : 'Reserving room...')
                          : (lang === 'sv' ? 'Fortsätt till Betalning' : 'Proceed to Payment')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </form>

              </div>

              {/* Right Col: Summary */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 bg-[#EDE7DC] p-6 rounded-2xl border border-[#D3C8B9] space-y-4 shadow-lg">
                  <h4 className="type-h4 text-lg sm:text-xl font-semibold text-[#02070D] pb-3 border-b border-[#D3C8B9]">
                    {lang === 'sv' ? 'Prissammanställning' : 'Price Summary'}
                  </h4>
                  <div className="space-y-2 text-xs text-[#25303A]">
                    <div className="flex justify-between">
                      <span>{lang === 'sv' ? 'Rum & nätter:' : 'Room & nights:'}</span>
                      <span className="font-bold text-[#02070D]">{formatSEK(roomTotalSEK, lang)}</span>
                    </div>
                    {selectedExtras.map(e => (
                      <div key={e.id} className="flex justify-between text-[11px]">
                        <span>{e.name}:</span>
                        <span>{formatSEK(e.priceSEK, lang)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-[#D3C8B9] flex justify-between text-base font-bold text-[#02070D]">
                      <span>{lang === 'sv' ? 'Att betala online:' : 'Due online:'}</span>
                      <span className="type-price text-xl text-[#BF8641] font-bold">{formatSEK(totalGrossSEK, lang)}</span>
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
              <h3 className="type-h2 text-2xl sm:text-3xl font-semibold text-[#02070D] mt-0.5">
                {lang === 'sv' ? 'Genomför betalning för din hotellvistelse' : 'Authorize Payment for Your Reservation'}
              </h3>
              <p className="text-xs text-[#25303A] mt-1">
                {lang === 'sv'
                  ? 'Hotel Nordic Gate är kontantfritt. Välj betalkort med 3D Secure, Swish, eller Klarna direktbank med BankID.'
                  : 'Hotel Nordic Gate is cash-free. Choose card payment with 3D Secure, Swish, or Klarna direct bank.'}
              </p>
            </div>

            {/* Backend Integration Architecture Callout */}
            {backendReservation && (
              <div className="p-4 rounded-xl bg-[#0D1A26] border border-[#BF8641]/40 text-[#F8F5EF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-[#F2C777] font-bold border border-amber-500/30">
                      STATUS: PENDING_PAYMENT
                    </span>
                    <span className="text-xs text-[#D3C8B9] font-medium">
                      Bokningsreferens: <strong className="font-mono text-[#F8F5EF]">{backendReservation.booking_reference}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D3C8B9]/80 leading-relaxed max-w-2xl">
                    Rummet är reserverat i hotellets bokningsdatabas. Slutför betalningen nedan för att erhålla ditt bekräftade kvitto.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase text-[#D3C8B9] block font-semibold">{lang === 'sv' ? 'Belopp SEK' : 'Total SEK'}</span>
                  <span className="text-xl font-mono font-bold text-[#F2C777]">{formatSEK(totalGrossSEK, lang)}</span>
                </div>
              </div>
            )}

            <OnlinePaymentSection
              totalGrossSEK={totalGrossSEK}
              vatRoomSEK={vatRoomSEK}
              vatExtrasSEK={vatExtrasSEK}
              guestName={`${firstName} ${lastName}`}
              guestEmail={guestEmail}
              guestPhone={guestPhone}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={() => setStep(3)}
            />
          </div>
        )}

        {/* ================= STEP 6: CONFIRMATION VOUCHER & RECEIPT ================= */}
        {step === 6 && (confirmedReservation || backendReservation) && (
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
                    ? `En officiell bekräftelse och kvitto har skickats till ${guestEmail}.`
                    : `An official confirmation and receipt have been sent to ${guestEmail}.`}
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
                      {backendReservation?.booking_reference || confirmedReservation?.bookingReference}
                    </span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#D3C8B9] font-bold block">
                      {lang === 'sv' ? 'Tilldelad rumskategori' : 'Allocated Room'}
                    </span>
                    <span className="font-serif text-xl font-bold text-white">
                      {backendReservation?.room_type_name || activeRoomType?.room_type_name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#D3C8B9]">
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block font-semibold">{lang === 'sv' ? 'Incheckning' : 'Check-in'}</span>
                    <span className="font-bold text-white">{checkIn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block font-semibold">{lang === 'sv' ? 'Utcheckning' : 'Check-out'}</span>
                    <span className="font-bold text-white">{checkOut}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block font-semibold">{lang === 'sv' ? 'Gäster' : 'Guests'}</span>
                    <span className="font-bold text-white">{adults} {lang === 'sv' ? 'vuxna' : 'adults'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/60 uppercase block font-semibold">{lang === 'sv' ? 'Totalt SEK' : 'Total'}</span>
                    <span className="font-bold text-[#F2C777]">{formatSEK(totalGrossSEK, lang)}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#D3C8B9]">
                  <span>Pristyp: <strong className="text-white">{backendReservation?.rate_plan_name || activeRatePlan?.rate_plan_name}</strong></span>
                  <span>Betalning: <strong className="text-emerald-400">Genomförd ({paymentMethod.toUpperCase()} · {paymentCardMask})</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4 text-[#F2C777]" />
                  <span>{lang === 'sv' ? 'Skriv ut bokningskvitto' : 'Print Receipt'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/guest')}
                  className="w-full sm:w-auto px-6 py-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{lang === 'sv' ? 'Hantera vistelse i Gästportalen' : 'Manage Stay in Guest Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
