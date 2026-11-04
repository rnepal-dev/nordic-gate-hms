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
  Sparkles,
  Copy,
  ChevronDown,
  ChevronUp,
  Code
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
  const [showAdminGuide, setShowAdminGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  // Look up room name if pre-selected
  const matchedRoom = selectedRoomSlug 
    ? CANDIDATE_ROOM_CATALOG.find(r => r.id === selectedRoomSlug)
    : null;

  // Resolve conceptual Sirvoy room ID (null until verified IDs are supplied)
  const sirvoyRoomId = resolveSirvoyRoomId(selectedRoomSlug);

  useEffect(() => {
    if (!SIRVOY_CONFIG.enabled || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    setIsLoading(true);
    setHasError(false);

    const target = container.querySelector('#sirvoy-widget-target') || container;

    // Prevent duplicate script insertion
    const existing = target.querySelector('script[data-form-id]');
    if (existing) {
      setIsLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.src = SIRVOY_CONFIG.widgetUrl || 'https://secured.sirvoy.com/widget/sirvoy.js';
    script.async = true;
    script.setAttribute('data-form-id', SIRVOY_CONFIG.formId || '8006fb2be9f17e06');

    script.onload = () => {
      // Sirvoy script loaded; wait briefly for widget markup to render
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    };

    script.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };

    target.appendChild(script);

    return () => {
      // Clean up script on unmount
      if (target.contains(script)) {
        try {
          target.removeChild(script);
        } catch {
          // ignore
        }
      }
    };
  }, [sirvoyRoomId]);

  return (
    <div className="space-y-8">
      {/* 1. Integration Boundary Container */}
      <div 
        ref={containerRef}
        id="sirvoy-booking-engine-container"
        className="relative bg-white rounded-2xl border border-[#EDE7DC] shadow-lg overflow-hidden transition-all"
      >
        {/* Live Sirvoy Engine Container */}
        {SIRVOY_CONFIG.enabled ? (
          <div className="p-4 sm:p-6 lg:p-8 min-h-[500px] relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 space-y-3">
                <div className="w-10 h-10 border-3 border-[#BF8641] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#25303A] font-semibold tracking-wide">
                  {lang === 'sv' ? 'Laddar tillgänglighet från Sirvoy...' : 'Loading live availability from Sirvoy...'}
                </p>
              </div>
            )}
            {hasError && (
              <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 max-w-md mx-auto text-center space-y-3 my-12">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <h4 className="font-bold text-sm">
                  {lang === 'sv' ? 'Bokningsmotorn kunde inte laddas' : 'Booking Engine Temporarily Unavailable'}
                </h4>
                <p className="text-xs text-amber-800">
                  {lang === 'sv' 
                    ? 'Vänligen kontakta receptionen för omedelbar bokningsassistans.' 
                    : 'Please contact our front desk for direct reservation assistance.'}
                </p>
                <div className="pt-2">
                  <a
                    href="tel:+46317501900"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D1A26] text-white rounded-lg text-xs font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F2C777]" />
                    <span>+46 (0)31 750 19 00</span>
                  </a>
                </div>
              </div>
            )}
            {/* Target anchor for Sirvoy widget script & DOM injection */}
            <div id="sirvoy-widget-target" className="sirvoy-engine-wrapper w-full"></div>

            {/* Direct Booking Guarantees (Prominently displayed beneath the widget) */}
            <div className="mt-8 pt-6 border-t border-[#EDE7DC] grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC]">
                <ShieldCheck className="w-5 h-5 text-[#BF8641] shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-[#02070D]">
                    {lang === 'sv' ? 'Bästa Prisgaranti' : 'Best Direct Rate'}
                  </h5>
                  <p className="text-[11px] text-[#5D6B78]">
                    {lang === 'sv' ? 'Alltid garanterat lägsta pris vid direktbokning' : 'Guaranteed lowest rate when booking direct'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC]">
                <Coffee className="w-5 h-5 text-[#BF8641] shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-[#02070D]">
                    {lang === 'sv' ? 'Ekologisk Frukost' : 'Organic Breakfast'}
                  </h5>
                  <p className="text-[11px] text-[#5D6B78]">
                    {lang === 'sv' ? 'Ingår alltid i alla rumspriser' : 'Always included with every reservation'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC]">
                <Droplets className="w-5 h-5 text-[#BF8641] shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-[#02070D]">
                    {lang === 'sv' ? 'Pool & Bastu' : 'Pool & Sauna Access'}
                  </h5>
                  <p className="text-[11px] text-[#5D6B78]">
                    {lang === 'sv' ? 'Uppvärmd inomhuspool & finsk bastu' : 'Complimentary indoor heated pool & sauna'}
                  </p>
                </div>
              </div>
            </div>

            {/* Front Desk Direct Support Strip */}
            <div className="mt-6 p-4 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0D1A26] flex items-center justify-center text-white shrink-0">
                  <Phone className="w-4 h-4 text-[#F2C777]" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-[#02070D]">
                    {lang === 'sv' ? 'Behöver du personlig assistans?' : 'Need Personal Assistance?'}
                  </h5>
                  <p className="text-[11px] text-[#5D6B78]">
                    {lang === 'sv' ? 'Vår reception i Göteborg är bemannad dygnet runt.' : 'Our Gothenburg reception is staffed 24/7 for you.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="tel:+46317501900"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1A26] hover:bg-[#02070D] text-white text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F2C777]" />
                  <span>+46 (0)31 750 19 00</span>
                </a>
                <a
                  href="mailto:reception@nordicgate.se"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#EDE7DC] text-[#0D1A26] border border-[#D3C8B9] text-xs font-semibold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#BF8641]" />
                  <span>reception@nordicgate.se</span>
                </a>
              </div>
            </div>
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

      {/* 2. Admin & Developer Theme Sync Guide (Collapsible) */}
      <div className="bg-[#EDE7DC]/50 border border-[#D3C8B9] rounded-xl p-4 sm:p-5 transition-all">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdminGuide(prev => !prev)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0D1A26] hover:text-[#BF8641] transition-colors cursor-pointer"
          >
            <Code className="w-4 h-4 text-[#BF8641]" />
            <span>
              {lang === 'sv' 
                ? 'Sirvoy Custom CSS Tema — Administratörsguide' 
                : 'Sirvoy Custom CSS Theme — Administrator & Developer Guide'}
            </span>
            {showAdminGuide ? (
              <ChevronUp className="w-4 h-4 text-[#BF8641]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#BF8641]" />
            )}
          </button>

          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#5D6B78] border border-[#D3C8B9]">
            Form ID: {SIRVOY_CONFIG.formId || '8006fb2be9f17e06'}
          </span>
        </div>

        {showAdminGuide && (
          <div className="mt-4 pt-4 border-t border-[#D3C8B9] space-y-4 text-xs text-[#25303A]">
            <p className="leading-relaxed">
              {lang === 'sv'
                ? 'För att Sirvoy-motorns interna element (rumskort, datumväljare, knappar och bokningssammanfattning) ska matcha Hotel Nordic Gates exakta designsystem, klistra in vårt anpassade CSS i Sirvoy-administrationen:'
                : 'To ensure all internal Sirvoy booking elements (room cards, datepicker, buttons, and summary) strictly adhere to Hotel Nordic Gate luxury brand identity, apply our verified custom CSS in your Sirvoy PMS portal:'}
            </p>

            <ol className="list-decimal list-inside space-y-1.5 pl-1 font-medium">
              <li>{lang === 'sv' ? 'Logga in i Sirvoy PMS (secured.sirvoy.com).' : 'Log in to your Sirvoy PMS account (secured.sirvoy.com).'}</li>
              <li>{lang === 'sv' ? 'Gå till: Webbverktyg → Bokningsmotorer.' : 'Navigate to: Web tools → Booking engines.'}</li>
              <li>{lang === 'sv' ? 'Klicka på "Redigera" för din bokningsmotor (ID: 8006fb2be9f17e06).' : 'Click "Edit" on your booking engine (ID: 8006fb2be9f17e06).'}</li>
              <li>{lang === 'sv' ? 'Välj fliken "Egen CSS" (Custom CSS), klistra in koden nedan och klicka på "Spara".' : 'Select "Custom CSS", paste the theme stylesheet from `src/styles/sirvoy-custom.css`, and click "Save".'}</li>
            </ol>

            <div className="bg-[#0D1A26] text-white p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#F2C777] font-mono">
                  src/styles/sirvoy-custom.css
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/src/styles/sirvoy-custom.css');
                      const text = await res.text();
                      await navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    } catch {
                      // fallback
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#BF8641] hover:bg-[#8C5F27] text-white rounded text-xs font-semibold transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'sv' ? 'Kopierat!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'sv' ? 'Kopiera CSS' : 'Copy Theme CSS'}</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#EDE7DC]/80">
                {lang === 'sv' 
                  ? 'Färdigformatterat med BEM-klasser för sökfält, kalender, rumskort, gästformulär och betalningsöversikt.' 
                  : 'Pre-configured with official BEM selectors for datepickers, card items, summary bar, and responsive breakpoints.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
