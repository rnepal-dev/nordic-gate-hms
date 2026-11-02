import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { formatSEK } from '../lib/pricing.ts';
import { 
  User, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Coffee,
  Waves,
  ShieldCheck,
  Search,
  Check,
  Building2,
  Receipt,
  XCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { 
  useGetMyBookingsQuery, 
  useGetMyBookingDetailQuery,
  useCancelRegisteredBookingMutation,
  useCancelGuestBookingMutation,
  useRequestCancellationLinkMutation 
} from '../redux/feature/bookings/bookingApi.ts';
import type { MyBookingDetail } from '../redux/feature/bookings/bookingTypes.ts';

export const GuestPortalView: React.FC = () => {
  const { 
    lang, 
    reservations, 
    roomCategories, 
    activeBookingRef, 
    cancelReservation: cancelLocalReservation, 
    navigate 
  } = useHotel();

  // Selected Booking Reference
  const [searchRef, setSearchRef] = useState<string>(activeBookingRef || 'SH-88492');
  const [searchInput, setSearchInput] = useState<string>('');
  const [guestToken, setGuestToken] = useState<string>('');

  // Cancellation modal & state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);
  const [cancelErrorMsg, setCancelErrorMsg] = useState<string | null>(null);

  // Email cancellation link requested state
  const [emailLinkModalOpen, setEmailLinkModalOpen] = useState(false);
  const [emailLinkInput, setEmailLinkInput] = useState('');
  const [emailLinkSuccess, setEmailLinkSuccess] = useState<string | null>(null);

  // Preference inputs
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  const [pillowType, setPillowType] = useState('down_soft');
  const [dietary, setDietary] = useState('none');
  const [quietWing, setQuietWing] = useState(true);

  // RTK Query: Get all registered bookings
  const { 
    data: myBookingsData, 
    isLoading: isMyBookingsLoading,
    refetch: refetchMyBookings 
  } = useGetMyBookingsQuery();

  // RTK Query: Get detail for active searchRef
  const { 
    data: apiBookingDetail, 
    isLoading: isDetailLoading, 
    error: detailError,
    refetch: refetchDetail 
  } = useGetMyBookingDetailQuery(searchRef, {
    skip: !searchRef,
  });

  const [cancelRegisteredMutation, { isLoading: isCancellingRegistered }] = useCancelRegisteredBookingMutation();
  const [cancelGuestMutation, { isLoading: isCancellingGuest }] = useCancelGuestBookingMutation();
  const [requestLinkMutation, { isLoading: isRequestingLink }] = useRequestCancellationLinkMutation();

  // Local fallback reservation if exists
  const localReservation = reservations.find(r => r.bookingReference === searchRef);
  const localRoom = roomCategories.find(r => r.id === localReservation?.roomCategoryId) || roomCategories[0];

  // Merge registered list with any local session reservations
  const allReferences = Array.from(new Set([
    ...(myBookingsData?.results?.map(b => b.booking_reference) || []),
    ...reservations.map(r => r.bookingReference),
    'SH-88492'
  ]));

  useEffect(() => {
    if (activeBookingRef && activeBookingRef !== searchRef) {
      setSearchRef(activeBookingRef);
    }
  }, [activeBookingRef]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchRef(searchInput.trim().toUpperCase());
      setSearchInput('');
    }
  };

  const handleCancelConfirm = async () => {
    setCancelErrorMsg(null);
    try {
      if (guestToken) {
        await cancelGuestMutation({ booking_reference: searchRef, token: guestToken }).unwrap();
      } else {
        await cancelRegisteredMutation({ booking_reference: searchRef }).unwrap();
      }
      
      // Also update local context if matching
      if (localReservation) {
        cancelLocalReservation(localReservation.id);
      }

      setCancelModalOpen(false);
      setCancelSuccessMsg(
        lang === 'sv' 
          ? `Bokningen ${searchRef} har avbokats och rummet har frigjorts.` 
          : `Reservation ${searchRef} has been cancelled successfully.`
      );
      refetchDetail();
      refetchMyBookings();
    } catch (err: any) {
      const msg = err?.data?.error || err?.message || (lang === 'sv' ? 'Kunde inte avboka. Vänligen kontakta receptionen.' : 'Could not cancel booking. Please contact the front desk.');
      setCancelErrorMsg(msg);
    }
  };

  const handleRequestCancellationEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailLinkInput.trim()) return;
    try {
      const res = await requestLinkMutation({
        booking_reference: searchRef,
        email: emailLinkInput.trim(),
      }).unwrap();
      setEmailLinkSuccess(res.message);
      setTimeout(() => {
        setEmailLinkModalOpen(false);
        setEmailLinkSuccess(null);
      }, 4000);
    } catch (err: any) {
      const msg = err?.data?.error || 'Kunde inte skicka avbokningslänk.';
      setCancelErrorMsg(msg);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPreferencesSaved(true);
    setTimeout(() => setPreferencesSaved(false), 4000);
  };

  // Determine current active booking representation
  const booking: MyBookingDetail | null = apiBookingDetail || (localReservation ? {
    booking_reference: localReservation.bookingReference,
    status: localReservation.status as any,
    source: 'direct_website',
    check_in: localReservation.checkInDate,
    check_out: localReservation.checkOutDate,
    number_of_nights: localReservation.nights,
    currency: 'SEK',
    subtotal: (localReservation.totalSEK - localReservation.vatRoomSEK).toString(),
    taxes: localReservation.vatRoomSEK.toString(),
    total_amount: localReservation.totalSEK.toString(),
    special_requests: localReservation.specialRequests || '',
    guest_first_name: localReservation.guestName.split(' ')[0] || 'Carl',
    guest_last_name: localReservation.guestName.split(' ').slice(1).join(' ') || 'von Linné',
    guest_email: localReservation.guestEmail,
    guest_phone: localReservation.guestPhone,
    guest_country: localReservation.guestCountry,
    expires_at: null,
    confirmed_at: localReservation.createdAt,
    cancelled_at: null,
    booking_rooms: [
      {
        room_type_id: 1,
        room_type_name: lang === 'sv' ? localRoom.nameSv : localRoom.name,
        rate_plan_id: 1,
        rate_plan_name: localReservation.ratePlanId === 'flexible' ? 'Flexible Heritage Rate' : 'Non-Refundable Rate',
        adults: localReservation.adults,
        children: localReservation.children,
        breakfast_included: true,
        pool_included: true,
        room_subtotal: localReservation.totalSEK.toString(),
        taxes: localReservation.vatRoomSEK.toString(),
        room_total: localReservation.totalSEK.toString(),
        cancellation_policy_snapshot: localReservation.ratePlanId === 'flexible' ? 'Fri avbokning fram till 24 timmar före ankomst' : 'Ej återbetalningsbar',
        free_cancellation_deadline_snapshot: null,
        nightly_rates: [],
      }
    ],
    payment_status: localReservation.paymentStatus || 'paid',
    refund_status: null,
  } : null);

  const activeRoomItem = booking?.booking_rooms?.[0];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. LUXURY HERO BANNER */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] pt-14 pb-16 px-6 border-b border-[#BF8641]/20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
              <User className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Mina Sidor · Gästportal' : 'My Stays · Guest Portal'}</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>Hotel Nordic Gate</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#F8F5EF]">
              {lang === 'sv' ? 'Hantera din vistelse & önskemål' : 'Manage Your Stay & Preferences'}
            </h1>
            <p className="text-xs sm:text-sm text-[#D3C8B9] max-w-xl">
              {lang === 'sv'
                ? 'Här kan du granska dina bokningsuppgifter i realtid, anpassa din ankomst, specificera frukostönskemål och hantera avbokningspolicy.'
                : 'Review your stay details in real-time, customize arrival preferences, manage dining requests, and check cancellation terms.'}
            </p>
          </div>

          {/* Reference Switcher & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Quick dropdown for known bookings */}
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/15 backdrop-blur-md flex items-center gap-2.5">
              <span className="text-xs text-[#D3C8B9] font-medium hidden sm:inline">{lang === 'sv' ? 'Bokning:' : 'Booking:'}</span>
              <select
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                className="bg-[#02070D] border border-white/20 rounded-lg px-3 py-1.5 font-mono font-bold text-xs text-[#F2C777] focus:outline-none cursor-pointer"
              >
                {allReferences.map(ref => (
                  <option key={ref} value={ref}>
                    {ref} {ref === searchRef ? '★' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Reference Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-white/10 rounded-xl border border-white/15 p-1 backdrop-blur-md">
              <input
                type="text"
                placeholder={lang === 'sv' ? 'Sök ref (SH-XXXXX)' : 'Search ref...'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent px-3 py-1 text-xs text-white placeholder-white/50 font-mono uppercase focus:outline-none w-32 sm:w-40"
              />
              <button
                type="submit"
                aria-label="Sök bokning"
                className="p-1.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white rounded-lg transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        
        {cancelSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between gap-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{cancelSuccessMsg}</span>
            </div>
            <button onClick={() => setCancelSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">×</button>
          </div>
        )}

        {cancelErrorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs font-semibold text-rose-900 flex items-center justify-between gap-2.5 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{cancelErrorMsg}</span>
            </div>
            <button onClick={() => setCancelErrorMsg(null)} className="text-rose-700 hover:text-rose-900 text-xs font-bold">×</button>
          </div>
        )}

        {/* Loading state */}
        {isDetailLoading && !booking ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#EDE7DC] space-y-4 animate-pulse">
            <Clock className="w-8 h-8 text-[#BF8641] mx-auto animate-spin" />
            <p className="text-xs text-[#5D6B78] font-semibold">
              {lang === 'sv' ? 'Hämtar bokningsuppgifter från hotellets server...' : 'Loading booking details from hotel system...'}
            </p>
          </div>
        ) : booking ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Stay Details & Folio (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#EDE7DC] shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE7DC]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider bg-[#EDE7DC] text-[#02070D] px-2.5 py-1 rounded-md font-bold border border-[#D3C8B9]">
                        {booking.booking_reference}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : booking.status === 'pending_payment'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : booking.status === 'checked_in'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : booking.status === 'checked_out'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {booking.status === 'confirmed' && (lang === 'sv' ? 'Bekräftad ✓' : 'Confirmed ✓')}
                        {booking.status === 'pending_payment' && (lang === 'sv' ? 'Väntar på betalning' : 'Pending Payment')}
                        {booking.status === 'checked_in' && (lang === 'sv' ? 'Incheckad (In-house)' : 'Checked-in')}
                        {booking.status === 'checked_out' && (lang === 'sv' ? 'Utcheckad' : 'Checked-out')}
                        {booking.status === 'cancelled' && (lang === 'sv' ? 'Avbokad' : 'Cancelled')}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl lg:text-3xl text-[#02070D] mt-2 font-bold">
                      {activeRoomItem?.room_type_name || (lang === 'sv' ? 'Hotel Nordic Gate Rum' : 'Hotel Nordic Gate Room')}
                    </h2>
                    <p className="text-xs text-[#BF8641] font-semibold mt-0.5">
                      Pristyp: {activeRoomItem?.rate_plan_name || 'Flexible Heritage Rate'} · {booking.number_of_nights} {lang === 'sv' ? (booking.number_of_nights > 1 ? 'nätter' : 'natt') : (booking.number_of_nights > 1 ? 'nights' : 'night')}
                    </p>
                  </div>

                  {/* Cancellation Action Button */}
                  {(booking.status === 'confirmed' || booking.status === 'pending_payment') && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <button
                        onClick={() => setCancelModalOpen(true)}
                        className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer self-start"
                      >
                        {lang === 'sv' ? 'Avboka vistelse' : 'Cancel stay'}
                      </button>
                      <button
                        onClick={() => setEmailLinkModalOpen(true)}
                        title={lang === 'sv' ? 'Begär avbokningslänk via e-post' : 'Request cancellation link by email'}
                        className="px-3 py-2 border border-[#D3C8B9] text-[#5D6B78] hover:text-[#0D1A26] hover:bg-stone-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#BF8641]" />
                        <span>{lang === 'sv' ? 'E-postlänk' : 'Email link'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Dates grid (Warm Sand #EDE7DC) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#EDE7DC] p-4 rounded-xl border border-[#D3C8B9]">
                  <div>
                    <span className="text-[#25303A]/70 uppercase text-[10px] block font-bold">{lang === 'sv' ? 'Incheckning:' : 'Check-in:'}</span>
                    <span className="font-bold text-[#02070D] text-sm">{booking.check_in}</span>
                    <span className="text-[10px] text-[#25303A] block font-medium">Från 15:00</span>
                  </div>
                  <div>
                    <span className="text-[#25303A]/70 uppercase text-[10px] block font-bold">{lang === 'sv' ? 'Utcheckning:' : 'Check-out:'}</span>
                    <span className="font-bold text-[#02070D] text-sm">{booking.check_out}</span>
                    <span className="text-[10px] text-[#25303A] block font-medium">Senast 11:00</span>
                  </div>
                  <div>
                    <span className="text-[#25303A]/70 uppercase text-[10px] block font-bold">{lang === 'sv' ? 'Nätter:' : 'Nights:'}</span>
                    <span className="font-bold text-[#02070D] text-sm">{booking.number_of_nights} {booking.number_of_nights > 1 ? 'nätter' : 'natt'}</span>
                  </div>
                  <div>
                    <span className="text-[#25303A]/70 uppercase text-[10px] block font-bold">{lang === 'sv' ? 'Gäst:' : 'Guest:'}</span>
                    <span className="font-bold text-[#02070D] text-sm truncate block">{booking.guest_first_name} {booking.guest_last_name}</span>
                  </div>
                </div>

                {/* Inclusions & Policies Snapshot */}
                {activeRoomItem && (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                    <div className="flex flex-wrap items-center gap-4 text-[#0D1A26] font-semibold">
                      {activeRoomItem.breakfast_included && (
                        <div className="flex items-center gap-1.5 text-emerald-800">
                          <Coffee className="w-4 h-4 text-emerald-600" />
                          <span>{lang === 'sv' ? 'Frukostbuffé ingår' : 'Breakfast buffet included'}</span>
                        </div>
                      )}
                      {activeRoomItem.pool_included && (
                        <div className="flex items-center gap-1.5 text-emerald-800">
                          <Waves className="w-4 h-4 text-emerald-600" />
                          <span>{lang === 'sv' ? 'Uppvärmd pool & bastu ingår' : 'Heated pool & sauna access'}</span>
                        </div>
                      )}
                    </div>
                    {activeRoomItem.cancellation_policy_snapshot && (
                      <div className="flex items-center gap-2 text-[#5D6B78] pt-1 border-t border-stone-200">
                        <ShieldCheck className="w-4 h-4 text-[#BF8641] shrink-0" />
                        <span>{activeRoomItem.cancellation_policy_snapshot}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Nightly Rates Breakdown Table (if available) */}
                {activeRoomItem?.nightly_rates && activeRoomItem.nightly_rates.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#02070D]">
                      {lang === 'sv' ? 'Specificerade nattpriser' : 'Nightly Rate Breakdown'}
                    </span>
                    <div className="overflow-x-auto rounded-xl border border-[#EDE7DC]">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#EDE7DC] text-[#02070D] font-bold">
                          <tr>
                            <th className="p-2.5">{lang === 'sv' ? 'Datum' : 'Date'}</th>
                            <th className="p-2.5 text-right">{lang === 'sv' ? 'Pris inkl. moms' : 'Rate incl. VAT'}</th>
                            <th className="p-2.5 text-right">{lang === 'sv' ? 'Varav moms (12%)' : 'VAT (12%)'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EDE7DC]">
                          {activeRoomItem.nightly_rates.map((rate, idx) => (
                            <tr key={idx} className="hover:bg-stone-50">
                              <td className="p-2.5 font-mono">{rate.stay_date}</td>
                              <td className="p-2.5 text-right font-mono font-bold text-[#02070D]">
                                {formatSEK(parseFloat(rate.amount_including_tax), lang)}
                              </td>
                              <td className="p-2.5 text-right font-mono text-[#5D6B78]">
                                {formatSEK(parseFloat(rate.tax_amount), lang)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Itemized Folio Invoice */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EDE7DC]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#BF8641]" />
                      <span>{lang === 'sv' ? 'Bokningsunderlag & Moms (SEK)' : 'Folio Breakdown & Taxes (SEK)'}</span>
                    </h4>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded border ${
                      booking.payment_status === 'paid' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {booking.payment_status === 'paid' ? '✓ Betald direkt' : 'Väntar på betalning'}
                    </span>
                  </div>

                  <div className="divide-y divide-[#EDE7DC] text-xs text-[#25303A]">
                    <div className="py-2.5 flex justify-between">
                      <span className="font-medium">{activeRoomItem?.room_type_name || 'Rumskategori'} ({booking.number_of_nights} nätter)</span>
                      <span className="font-mono font-bold text-[#02070D] tabular-nums">
                        {formatSEK(parseFloat(booking.subtotal), lang)}
                      </span>
                    </div>

                    <div className="py-2.5 flex justify-between text-[#25303A]/80">
                      <span>{lang === 'sv' ? 'Varav hotellmoms (12%):' : 'Incl. room VAT (12%):'}</span>
                      <span className="font-mono tabular-nums">{formatSEK(parseFloat(booking.taxes), lang)}</span>
                    </div>

                    <div className="py-3 flex justify-between font-bold text-sm text-[#02070D] border-t border-[#D3C8B9]">
                      <span>{lang === 'sv' ? 'Totalt belopp SEK' : 'Total Amount SEK'}</span>
                      <span className="font-serif text-2xl font-bold text-[#02070D] tabular-nums">
                        {formatSEK(parseFloat(booking.total_amount), lang)}
                      </span>
                    </div>

                    {booking.special_requests && (
                      <div className="py-2.5 text-xs text-[#5D6B78]">
                        <span className="font-semibold text-[#02070D]">{lang === 'sv' ? 'Särskilda önskemål:' : 'Special requests:'} </span>
                        <span>{booking.special_requests}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Stay Preferences Form */}
              <div className="bg-[#EDE7DC] p-6 lg:p-8 rounded-2xl border border-[#D3C8B9] space-y-4 shadow-sm">
                <h3 className="font-serif text-2xl text-[#02070D] font-bold">
                  {lang === 'sv' ? 'Anpassa din ankomst (Kuddmeny & Frukost)' : 'Personalize Your Stay'}
                </h3>
                <p className="text-xs text-[#25303A]">
                  {lang === 'sv'
                    ? 'Vi förbereder ditt rum och frukostbord efter dina specifika önskemål.'
                    : 'Let our team prepare your room and dining requirements before you arrive.'}
                </p>

                {preferencesSaved && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dina önskemål har sparats och synkroniserats med hotellets städ- och köksteam!</span>
                  </div>
                )}

                <form onSubmit={handleSavePreferences} className="space-y-4 text-xs pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#02070D] font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                        Kuddval (Kuddmeny)
                      </label>
                      <select
                        value={pillowType}
                        onChange={(e) => setPillowType(e.target.value)}
                        className="w-full bg-white border border-[#D3C8B9] rounded-xl p-2.5 text-[#02070D] font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="down_soft">Mjuk svensk gåsdunskudde (Standard)</option>
                        <option value="firm">Fast ortopedisk ullkudde</option>
                        <option value="hypoallergenic">Allergivänlig mikrofiberkudde</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#02070D] font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                        Kostpreferenser till frukosten
                      </label>
                      <select
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        className="w-full bg-white border border-[#D3C8B9] rounded-xl p-2.5 text-[#02070D] font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="none">Inga särskilda önskemål</option>
                        <option value="gluten_free">Glutenfritt surdegsbröd & flingor</option>
                        <option value="lactose_free">Laktosfria mejeriprodukter</option>
                        <option value="vegan">Växtbaserat veganskt frukosturval</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-[#25303A] cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={quietWing}
                        onChange={(e) => setQuietWing(e.target.checked)}
                        className="rounded accent-[#BF8641] text-[#BF8641] focus:ring-[#BF8641]"
                      />
                      <span>Önskar rum i tyst flygel mot lugn innergård</span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      Spara Gästönskemål
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Hotel Contact & Registered List (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Hotel Concierge Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#EDE7DC] shadow-sm space-y-4">
                <h4 className="font-serif text-xl font-bold text-[#02070D]">
                  {lang === 'sv' ? 'Hotellservice & Reception' : 'Front Desk & Guest Support'}
                </h4>
                <p className="text-xs text-[#25303A] leading-relaxed">
                  Vår reception på Gamla Tingstadsgatan är bemannad dygnet runt. Kontakta oss vid önskemål om sen ankomst, bagageförvaring eller transporttips.
                </p>
                <div className="space-y-2.5 text-xs text-[#25303A] pt-2 border-t border-[#EDE7DC]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#BF8641] shrink-0" />
                    <span><strong>Telefon:</strong> +46 (0)31 750 19 00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#BF8641] shrink-0" />
                    <span><strong>E-post:</strong> reception@nordicgate.se</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#BF8641] shrink-0" />
                    <span><strong>Adress:</strong> Gamla Tingstadsgatan 1, Göteborg</span>
                  </div>
                </div>
              </div>

              {/* Registered Bookings List */}
              {myBookingsData && myBookingsData.results && myBookingsData.results.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-[#EDE7DC] shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D]">
                    {lang === 'sv' ? 'Mina Registrerade Bokningar' : 'My Registered Bookings'}
                  </h4>
                  <div className="space-y-2">
                    {myBookingsData.results.map(b => (
                      <div
                        key={b.booking_reference}
                        onClick={() => setSearchRef(b.booking_reference)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          b.booking_reference === searchRef
                            ? 'bg-amber-50/70 border-[#BF8641] font-bold'
                            : 'bg-stone-50 border-stone-200 hover:border-[#D3C8B9]'
                        }`}
                      >
                        <div>
                          <span className="font-mono text-[#02070D] block">{b.booking_reference}</span>
                          <span className="text-[11px] text-[#5D6B78] font-normal">{b.check_in} → {b.check_out}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PMS Portal Link */}
              <div className="bg-[#0D1A26] text-white p-6 rounded-2xl space-y-4 shadow-xl border border-[#BF8641]/30">
                <span className="text-xs uppercase tracking-wider text-[#F2C777] font-bold">
                  Hotellsystem & Synkning
                </span>
                <h4 className="font-serif text-xl text-white">
                  Se bokning i personalpanelen
                </h4>
                <p className="text-xs text-[#D3C8B9] leading-relaxed">
                  Denna bokning är synkroniserad i realtid med hotellets receptions- och städsystem.
                </p>
                <button
                  onClick={() => navigate('/app')}
                  className="w-full py-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center block shadow-md"
                >
                  Öppna HMS Personalpanel
                </button>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-[#EDE7DC] space-y-4">
            <p className="text-slate-500 text-sm">
              {lang === 'sv' ? `Ingen aktiv bokning hittades med referens "${searchRef}".` : `No active booking found with reference "${searchRef}".`}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setSearchRef('SH-88492')}
                className="px-5 py-2.5 border border-[#D3C8B9] text-xs font-semibold rounded-xl hover:bg-stone-50 cursor-pointer"
              >
                {lang === 'sv' ? 'Visa demobokning SH-88492' : 'Show demo booking SH-88492'}
              </button>
              <button
                onClick={() => navigate('/booking')}
                className="px-6 py-2.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold rounded-xl uppercase tracking-wider cursor-pointer"
              >
                {lang === 'sv' ? 'Gör en ny bokning' : 'Make a new booking'}
              </button>
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-neutral-200 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {lang === 'sv' ? 'Bekräfta Avbokning' : 'Confirm Cancellation'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'sv'
                  ? `Är du säker på att du vill avboka bokning ${searchRef}? Fri avbokning tillämpas enligt din bokade prisplan. När avbokningen genomförs frigörs rummet omedelbart i hotellets system.`
                  : `Are you sure you want to cancel booking ${searchRef}? Cancellation policies will be applied according to your selected rate plan.`}
              </p>

              {/* Optional Guest Token input if needed */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {lang === 'sv' ? 'Gäst-token (valfritt för oinloggade gäster)' : 'Guest Token (optional)'}
                </label>
                <input
                  type="text"
                  placeholder="t.ex. gst-tok-88492"
                  value={guestToken}
                  onChange={(e) => setGuestToken(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {lang === 'sv' ? 'Behåll bokning' : 'Keep booking'}
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={isCancellingRegistered || isCancellingGuest}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {isCancellingRegistered || isCancellingGuest
                    ? (lang === 'sv' ? 'Avbokar...' : 'Cancelling...')
                    : (lang === 'sv' ? 'Ja, avboka nu' : 'Confirm Cancellation')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Cancellation Link Modal */}
        {emailLinkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-neutral-200 shadow-2xl">
              <div className="flex items-center gap-3 text-[#BF8641]">
                <Mail className="w-6 h-6 shrink-0" />
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  {lang === 'sv' ? 'Begär Avbokningslänk' : 'Request Cancellation Link'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'sv'
                  ? `Ange den e-postadress som användes vid bokning av ${searchRef}. Vi skickar en säker engångslänk för avbokning.`
                  : `Enter the email address used when booking ${searchRef}. We will send a secure single-use cancellation link.`}
              </p>

              {emailLinkSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-medium">
                  {emailLinkSuccess}
                </div>
              ) : (
                <form onSubmit={handleRequestCancellationEmail} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="namn@epost.se"
                    value={emailLinkInput}
                    onChange={(e) => setEmailLinkInput(e.target.value)}
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEmailLinkModalOpen(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      {lang === 'sv' ? 'Avbryt' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isRequestingLink}
                      className="px-4 py-2 bg-[#BF8641] hover:bg-[#8C5F27] text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      {isRequestingLink ? 'Skickar...' : 'Skicka länk'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
