import React from 'react';
import { 
  PhoneCall, 
  HelpCircle, 
  ChevronRight, 
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin
} from 'lucide-react';
import { useHotel } from '../context/HotelContext.tsx';
import { ContactInformation } from '../components/contact/ContactInformation.tsx';
import { ContactForm } from '../components/contact/ContactForm.tsx';
import { LocationSection } from '../components/contact/LocationSection.tsx';

export const ContactView: React.FC = () => {
  const { lang, navigate } = useHotel();

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#25303A] pb-20">
      {/* ======================================================== */}
      {/* SECTION 1 — CONTACT HERO                                 */}
      {/* ======================================================== */}
      <section className="relative bg-[#0D1A26] text-white overflow-hidden py-16 sm:py-20 lg:py-24 border-b border-[#25303A]">
        {/* Subtle Nordic texture & ambient accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#BF8641_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#BF8641]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#8C5F27]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#F2C777] text-xs font-semibold tracking-widest uppercase mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'sv' ? 'Gästservice & Reception' : 'Guest Concierge & Reception'}</span>
            </div>

            {/* Welcoming Heading strictly as specified */}
            <h1 className="font-brand-logo text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              {lang === 'sv' ? 'Kontakta Oss' : 'Get in Touch'}
            </h1>

            {/* Subtitle strictly as specified */}
            <p className="text-base sm:text-lg lg:text-xl text-[#D3C8B9] mt-4 leading-relaxed font-normal">
              {lang === 'sv'
                ? 'Har du frågor om din vistelse, våra rum eller hotellets faciliteter? Vårt team hjälper dig gärna.'
                : 'Have a question about your stay, our rooms, or hotel services? Our team is happy to help.'}
            </p>

            {/* Quick highlight bar */}
            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs sm:text-sm text-[#D3C8B9]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#BF8641]" />
                <span>{lang === 'sv' ? 'Reception öppen dygnet runt (24/7)' : '24/7 Front Desk On-Site'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#BF8641]" />
                <span>Gamla Tingstadsgatan 1, Göteborg</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#BF8641]" />
                <span>{lang === 'sv' ? 'Direktbokning med prisgaranti' : 'Direct Booking Assurance'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2 — CONTACT INFORMATION & INQUIRY FORM          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hotel Contact Information (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <ContactInformation />
          </div>

          {/* Right Column: Guest Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* Quick FAQ shortcut banner */}
        <div className="mt-8 p-5 rounded-2xl bg-white border border-[#EDE7DC] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#BF8641] shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#02070D]">
                {lang === 'sv' ? 'Söker du snabba svar inför din ankomst?' : 'Looking for immediate answers before arrival?'}
              </p>
              <p className="text-xs text-[#5D6B78] mt-0.5">
                {lang === 'sv'
                  ? 'Läs vanliga frågor om incheckningstider, frukost, pool och parkering.'
                  : 'Check our frequently asked questions about check-in hours, breakfast, pool rules, and parking.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/faq')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F8F5EF] hover:bg-[#EDE7DC] text-[#0D1A26] font-semibold text-xs transition-colors shrink-0 cursor-pointer border border-[#D3C8B9]"
          >
            <span>{lang === 'sv' ? 'Utforska Vanliga Frågor' : 'Browse Hotel FAQ'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#BF8641]" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3 — LOCATION & TRANSPORTATION                    */}
        {/* ======================================================== */}
        <LocationSection />
      </section>
    </div>
  );
};
