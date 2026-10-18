import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { formatSEK } from '../lib/pricing.ts';
import { 
  User, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Check,
  Phone,
  Mail,
  MapPin,
  Clock,
  Coffee,
  Droplets
} from 'lucide-react';

export const GuestPortalView: React.FC = () => {
  const { 
    lang, 
    reservations, 
    roomCategories, 
    activeBookingRef, 
    cancelReservation, 
    navigate 
  } = useHotel();

  const [searchRef, setSearchRef] = useState(activeBookingRef || 'SH-88492');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState(false);
  const [preferencesSaved, setPreferencesSaved] = useState(false);

  // Preference inputs
  const [pillowType, setPillowType] = useState('down_soft');
  const [dietary, setDietary] = useState('none');
  const [quietWing, setQuietWing] = useState(true);

  // Find active booking
  const activeReservation = reservations.find(r => r.bookingReference === searchRef) || reservations[0];
  const room = roomCategories.find(r => r.id === activeReservation?.roomCategoryId) || roomCategories[0];

  const handleCancelConfirm = () => {
    if (activeReservation) {
      cancelReservation(activeReservation.id);
      setCancelModalOpen(false);
      setCancelSuccessMsg(true);
      setTimeout(() => setCancelSuccessMsg(false), 5000);
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPreferencesSaved(true);
    setTimeout(() => setPreferencesSaved(false), 4000);
  };

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
                ? 'Här kan du se dina bokningsuppgifter, anpassa din ankomst, specificera frukostönskemål och granska specificerad hotellmoms.'
                : 'Review your stay details, customize arrival requests, select breakfast preferences, and download VAT receipts.'}
            </p>
          </div>

          {/* Reference Switcher */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/15 backdrop-blur-md self-start md:self-auto flex items-center gap-3">
            <span className="text-xs text-[#D3C8B9] font-medium">{lang === 'sv' ? 'Välj bokning:' : 'Select Booking:'}</span>
            <select
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="bg-[#02070D] border border-white/20 rounded-lg px-3 py-1.5 font-mono font-bold text-xs text-[#F2C777] focus:outline-none cursor-pointer"
            >
              {reservations.map(res => (
                <option key={res.id} value={res.bookingReference}>
                  {res.bookingReference} ({res.guestName} - {res.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        
        {cancelSuccessMsg && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-2.5 shadow-sm">
            <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {lang === 'sv'
                ? 'Bokningen har avbokats. En bekräftelse har skickats till din e-postadress. Rummet har frigjorts i hotellets system.'
                : 'Reservation cancelled successfully. Room inventory has been updated.'}
            </span>
          </div>
        )}

        {/* Main Reservation Card */}
        {activeReservation ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Stay Details & Folio (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#EDE7DC] shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE7DC]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-wider bg-[#EDE7DC] text-[#02070D] px-2.5 py-1 rounded-md font-bold border border-[#D3C8B9]">
                        {activeReservation.bookingReference}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                        activeReservation.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : activeReservation.status === 'checked_in'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : activeReservation.status === 'checked_out'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {activeReservation.status === 'confirmed' && (lang === 'sv' ? 'Bekräftad ✓' : 'Confirmed ✓')}
                        {activeReservation.status === 'checked_in' && (lang === 'sv' ? 'Incheckad (In-house)' : 'Checked-in')}
                        {activeReservation.status === 'checked_out' && (lang === 'sv' ? 'Utcheckad' : 'Checked-out')}
                        {activeReservation.status === 'cancelled' && (lang === 'sv' ? 'Avbokad' : 'Cancelled')}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl lg:text-3xl text-[#02070D] mt-2 font-bold">
                      {lang === 'sv' ? room.nameSv : room.name}
                    </h2>
                    <p className="text-xs text-[#BF8641] font-semibold mt-0.5">
                      {room.dimensionsM2} m² · {lang === 'sv' ? room.bedTypeSv : room.bedType} · Tilldelat rum: {activeReservation.assignedRoomNumber || 'Ej tilldelat ännu'}
                    </p>
                  </div>

                  {activeReservation.status === 'confirmed' && (
                    <button
                      onClick={() => setCancelModalOpen(true)}
                      className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer self-start"
                    >
                      {lang === 'sv' ? 'Avboka vistelse' : 'Cancel stay'}
                    </button>
                  )}
                </div>

                {/* Dates grid (Warm Sand #EDE7DC) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#EDE7DC] p-4 rounded-xl border border-[#D3C8B9]">
                  <div>
                    <span className="text-[#25303A]/70 uppercase text-[10px] block font-bold">{lang === 'sv' ? 'Incheckning:' : 'Check-in:'}</span>
                    <span className="font-bold text-[#02070D] text-sm">{activeReservation.checkInDate}</span>
                    <span className="text-[10px] text-[#25303A] block font-medium">Från 15:00</span>
                  </div>
                  <div>
                    <span className="text-[#25303A]/70 uppercase text-[10px] block font-bold">{lang === 'sv' ? 'Utcheckning:' : 'Check-out:'}</span>
                    <span className="font-bold text-[#02070D] text-sm">{activeReservation.checkOutDate}</span>
                    <span className="text-[10px] text-[#25303A] block font-medium">Senast 11:00</span>
                  </div>
                  <div>
                    <span className="text-[#25303A]/70 uppercase text-[10px] block font-bold">{lang === 'sv' ? 'Nätter:' : 'Nights:'}</span>
                    <span className="font-bold text-[#02070D] text-sm">{activeReservation.nights} {activeReservation.nights > 1 ? 'nätter' : 'natt'}</span>
                  </div>
                  <div>
                    <span className="text-[#25303A]/70 uppercase text-[10px] block font-bold">{lang === 'sv' ? 'Gäster:' : 'Guests:'}</span>
                    <span className="font-bold text-[#02070D] text-sm">{activeReservation.adults} vuxna</span>
                  </div>
                </div>

                {/* Itemized Folio Invoice */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EDE7DC]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#BF8641]" />
                      <span>{lang === 'sv' ? 'Bokningsunderlag & Moms (SEK)' : 'Folio Breakdown & Taxes (SEK)'}</span>
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      ✓ Betald direkt
                    </span>
                  </div>

                  <div className="divide-y divide-[#EDE7DC] text-xs text-[#25303A]">
                    <div className="py-2.5 flex justify-between">
                      <span className="font-medium">{lang === 'sv' ? room.nameSv : room.name} ({activeReservation.nights} nätter)</span>
                      <span className="font-mono font-bold text-[#02070D] tabular-nums">{formatSEK(activeReservation.totalSEK - (activeReservation.vatExtrasSEK || 0), lang)}</span>
                    </div>
                    {activeReservation.extras && activeReservation.extras.map(e => (
                      <div key={e.id} className="py-2.5 flex justify-between text-[#25303A]">
                        <span>{e.name}</span>
                        <span className="font-mono font-bold text-[#02070D] tabular-nums">+{formatSEK(e.priceSEK, lang)}</span>
                      </div>
                    ))}
                    <div className="py-2.5 flex justify-between text-[#25303A]/80">
                      <span>Varav hotellmoms (12%):</span>
                      <span className="font-mono tabular-nums">{formatSEK(activeReservation.vatRoomSEK, lang)}</span>
                    </div>
                    {activeReservation.vatExtrasSEK > 0 && (
                      <div className="py-2.5 flex justify-between text-[#25303A]/80">
                        <span>Varav tjänstemoms (25%):</span>
                        <span className="font-mono tabular-nums">{formatSEK(activeReservation.vatExtrasSEK, lang)}</span>
                      </div>
                    )}
                    <div className="py-3 flex justify-between font-bold text-sm text-[#02070D] border-t border-[#D3C8B9]">
                      <span>{lang === 'sv' ? 'Totalt belopp SEK' : 'Total Amount SEK'}</span>
                      <span className="font-serif text-2xl font-bold text-[#02070D] tabular-nums">
                        {formatSEK(activeReservation.totalSEK, lang)}
                      </span>
                    </div>
                    {activeReservation.paymentTransactionId && (
                      <div className="pt-2 text-[11px] text-[#25303A]/70 flex items-center justify-between border-t border-[#EDE7DC]">
                        <span>{lang === 'sv' ? 'Betald online:' : 'Paid online:'} {activeReservation.paymentMethod || 'Kort'} ({activeReservation.paymentCardMask || 'Visa'})</span>
                        <span className="font-mono">{activeReservation.paymentTransactionId}</span>
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

            {/* Right Column: Hotel Contact & Quick Actions (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Hotel Concierge Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#EDE7DC] shadow-sm space-y-4">
                <h4 className="font-serif text-xl font-bold text-[#02070D]">
                  {lang === 'sv' ? 'Hotellservice & Reception' : 'Front Desk & Guest Support'}
                </h4>
                <p className="text-xs text-[#25303A] leading-relaxed">
                  Vår reception på Gamla Tingstadsgatan är bemannad dygnet runt. Hör gärna av dig om du önskar sen ankomst eller transporttips.
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

              {/* PMS Portal Link */}
              <div className="bg-[#0D1A26] text-white p-6 rounded-2xl space-y-4 shadow-xl border border-[#BF8641]/30">
                <span className="text-xs uppercase tracking-wider text-[#F2C777] font-bold">
                  Hotellsystem & Synkning
                </span>
                <h4 className="font-serif text-xl text-white">
                  Se din bokning i HMS
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
            <p className="text-slate-500 text-sm">Ingen aktiv bokning hittades med detta referensnummer.</p>
            <button
              onClick={() => navigate('/booking')}
              className="px-6 py-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Gör en ny bokning
            </button>
          </div>
        )}

        {/* Cancellation Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-neutral-200 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="font-serif text-xl font-bold text-slate-900">Bekräfta Avbokning</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Är du säker på att du vill avboka bokning <strong>{activeReservation?.bookingReference}</strong>? Kostnadsfri avbokning tillämpas enligt din bokade pristyp. Rummet kommer omedelbart att göras tillgängligt för andra gäster.
              </p>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Behåll bokning
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Ja, avboka nu
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
