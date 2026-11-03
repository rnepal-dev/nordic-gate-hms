import React, { useEffect, useRef, useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { SIRVOY_CONFIG, resolveSirvoyRoomId } from '../../lib/sirvoy-config.ts';
import { 
  ShieldCheck, 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  Clock, 
  Coffee, 
  Droplets, 
  ArrowRight,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { CANDIDATE_ROOM_CATALOG } from '../../data/propertyData.ts';

interface SirvoyBookingSectionProps {
  selectedRoomSlug?: string | null;
}

export const SirvoyBookingSection: React.FC<SirvoyBookingSectionProps> = ({ selectedRoomSlug }) => {
  const { lang, searchCriteria, navigate } = useHotel();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Look up room name if pre-selected
  const matchedRoom = selectedRoomSlug 
    ? CANDIDATE_ROOM_CATALOG.find(r => r.id === selectedRoomSlug)
    : null;

  // Resolve conceptual Sirvoy room ID (null until verified IDs are supplied)
  const sirvoyRoomId = resolveSirvoyRoomId(selectedRoomSlug);

  useEffect(() => {
    if (!SIRVOY_CONFIG.enabled) {
      // In pre-launch state, do not attempt to load external scripts
      return;
    }

    if (!containerRef.current) return;

    // Boundary for future official Sirvoy JavaScript integration
    setIsLoading(true);
    setHasError(false);

    try {
      // Future integration point: Mount official script cleanly
      // Clean up previous instances on unmount to prevent memory leaks or duplicate widgets
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }

    return () => {
      // Cleanup boundary
    };
  }, [searchCriteria, sirvoyRoomId]);

  return (
    <div className="space-y-8">
      {/* 1. Integration Boundary Container */}
      <div 
        ref={containerRef}
        id="sirvoy-booking-engine-container"
        className="relative bg-white rounded-2xl border border-[#EDE7DC] shadow-lg overflow-hidden transition-all"
      >
        {/* If live engine is enabled in future */}
        {SIRVOY_CONFIG.enabled ? (
          <div className="p-8 min-h-[480px] flex items-center justify-center">
            {isLoading && (
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-3 border-[#BF8641] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#25303A] font-semibold">
                  {lang === 'sv' ? 'Laddar tillgänglighet från Sirvoy...' : 'Loading live availability from Sirvoy...'}
                </p>
              </div>
            )}
            {hasError && (
              <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 max-w-md text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <h4 className="font-bold text-sm">
                  {lang === 'sv' ? 'Bokningsmotorn kunde inte laddas' : 'Booking Engine Temporarily Unavailable'}
                </h4>
                <p className="text-xs text-amber-800">
                  {lang === 'sv' 
                    ? 'Vänligen kontakta receptionen för omedelbar bokningsassistans.' 
                    : 'Please contact our front desk for direct reservation assistance.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Controlled Pre-Launch / Integration In Progress State */
          <div className="p-6 sm:p-10 lg:p-12 space-y-8">
            
            {/* Status Pill & Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE7DC] border border-[#D3C8B9] text-xs font-semibold text-[#0D1A26]">
                <Sparkles className="w-3.5 h-3.5 text-[#BF8641]" />
                <span>
                  {lang === 'sv' 
                    ? 'Officiell Bokningsintegration Pågår' 
                    : 'Official Booking Engine Integration In Progress'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#02070D]">
                {lang === 'sv'
                  ? 'Direktbokning online öppnar inom kort'
                  : 'Direct Online Reservations Opening Shortly'}
              </h2>

              <p className="text-xs sm:text-sm text-[#25303A] leading-relaxed">
                {lang === 'sv'
                  ? 'Vi slutför för närvarande anslutningen till vårt centrala hotell- och kanalsystem (Sirvoy PMS). Under tiden hjälper vår reception dig gärna att reservera ditt önskade rum med omedelbar bekräftelse och garanterat bästa dagspris.'
                  : 'We are currently finalizing the live synchronization with our central hotel management system (Sirvoy PMS). In the meantime, our front desk team is delighted to reserve your preferred accommodations with immediate confirmation and our best direct rate guarantee.'}
              </p>
            </div>

            {/* Selected Room & Search Summary (Preserving state) */}
            <div className="bg-[#F8F5EF] p-5 sm:p-6 rounded-xl border border-[#EDE7DC] max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE7DC]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#02070D]">
                  {lang === 'sv' ? 'Dina Valda Önskemål' : 'Your Selected Details'}
                </span>
                <span className="text-[11px] text-[#BF8641] font-semibold">
                  {lang === 'sv' ? 'Sparas automatiskt' : 'Saved for your stay'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#25303A]">
                {matchedRoom && (
                  <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-white rounded-lg border border-[#EDE7DC]">
                    <div className="w-12 h-10 rounded overflow-hidden shrink-0 bg-[#0D1A26]">
                      <img 
                        src={matchedRoom.images[0]} 
                        alt={matchedRoom.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#BF8641] uppercase font-bold tracking-wider">
                        {lang === 'sv' ? 'Valt Rum' : 'Selected Room'}
                      </p>
                      <p className="font-bold text-[#02070D] text-sm">
                        {lang === 'sv' ? matchedRoom.nameSv : matchedRoom.name}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-[#EDE7DC]">
                  <Calendar className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#5D6B78] uppercase block font-semibold">
                      {lang === 'sv' ? 'Datum' : 'Stay Dates'}
                    </span>
                    <span className="font-bold text-[#02070D]">
                      {searchCriteria.checkIn} → {searchCriteria.checkOut}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-[#EDE7DC]">
                  <Users className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#5D6B78] uppercase block font-semibold">
                      {lang === 'sv' ? 'Gäster' : 'Guests'}
                    </span>
                    <span className="font-bold text-[#02070D]">
                      {searchCriteria.adults} {lang === 'sv' ? (searchCriteria.adults > 1 ? 'vuxna' : 'vuxen') : (searchCriteria.adults > 1 ? 'adults' : 'adult')}
                      {searchCriteria.children > 0 && `, ${searchCriteria.children} ${lang === 'sv' ? 'barn' : 'children'}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Assisted Reservation Options */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-semibold text-[#02070D]">
                  {lang === 'sv' ? 'Boka direkt via receptionen' : 'Reserve Directly via Front Desk'}
                </h3>
                <p className="text-xs text-[#5D6B78]">
                  {lang === 'sv' 
                    ? 'Öppet dygnet runt med personlig service och omedelbar bekräftelse.' 
                    : 'Available 24/7 with personalized assistance and immediate confirmation.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="tel:+46317501900"
                  className="flex items-center justify-center gap-3 p-4 bg-[#0D1A26] hover:bg-[#02070D] text-white rounded-xl transition-all shadow-md group"
                >
                  <Phone className="w-5 h-5 text-[#F2C777] group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-wider text-[#D3C8B9] block font-semibold">
                      {lang === 'sv' ? 'Ring Receptionen' : 'Call Front Desk'}
                    </span>
                    <span className="text-sm font-bold font-mono tracking-wide">
                      +46 (0)31 750 19 00
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:reception@nordicgate.se?subject=Bokningsförfrågan%20Hotel%20Nordic%20Gate"
                  className="flex items-center justify-center gap-3 p-4 bg-[#BF8641] hover:bg-[#8C5F27] text-white rounded-xl transition-all shadow-md group"
                >
                  <Mail className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <span className="text-[10px] uppercase tracking-wider text-amber-100 block font-semibold">
                      {lang === 'sv' ? 'Skicka E-post' : 'Send Inquiries'}
                    </span>
                    <span className="text-sm font-bold tracking-wide">
                      reception@nordicgate.se
                    </span>
                  </div>
                </a>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BF8641] hover:text-[#8C5F27] transition-colors cursor-pointer"
                >
                  <span>{lang === 'sv' ? 'Eller använd vårt kontaktformulär' : 'Or send a message via our contact form'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Direct Booking Guarantees */}
            <div className="pt-6 border-t border-[#EDE7DC] grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-2.5 text-xs text-[#25303A]">
                <ShieldCheck className="w-4 h-4 text-[#BF8641] shrink-0" />
                <span>{lang === 'sv' ? 'Garanterat bästa direktpris' : 'Best direct rate guarantee'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#25303A]">
                <Coffee className="w-4 h-4 text-[#BF8641] shrink-0" />
                <span>{lang === 'sv' ? 'Ekologisk frukost ingår alltid' : 'Organic breakfast always included'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#25303A]">
                <Droplets className="w-4 h-4 text-[#BF8641] shrink-0" />
                <span>{lang === 'sv' ? 'Pool & bastu ingår fritt' : 'Pool & sauna access included'}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
