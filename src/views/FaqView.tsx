import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { 
  HOTEL_NORDIC_GATE_PROPERTY, 
  CANDIDATE_FACILITIES, 
  HOTEL_POLICIES, 
  TRANSPORT_DETAILS, 
  NEARBY_ATTRACTIONS, 
  HOTEL_FAQS 
} from '../data/propertyData.ts';
import { FacilitiesGrid } from '../components/property/FacilitiesGrid.tsx';
import { HotelPoliciesCard } from '../components/property/HotelPoliciesCard.tsx';
import { LocationAndTransportCard } from '../components/property/LocationAndTransportCard.tsx';
import { FaqAccordion } from '../components/property/FaqAccordion.tsx';
import { ReconciliationAuditModal } from '../components/property/ReconciliationAuditModal.tsx';
import { 
  FileSearch, 
  Calendar, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';

export const FaqView: React.FC = () => {
  const { lang, navigate } = useHotel();
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const address = {
    street: HOTEL_NORDIC_GATE_PROPERTY.address.street.value,
    postalCode: HOTEL_NORDIC_GATE_PROPERTY.address.postalCode.value,
    city: HOTEL_NORDIC_GATE_PROPERTY.address.city.value,
    district: HOTEL_NORDIC_GATE_PROPERTY.address.district.value,
  };

  return (
    <div className="space-y-16 lg:space-y-20 pb-16">
      
      {/* 1. LUXURY HERO BANNER */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] pt-14 pb-16 px-6 border-b border-[#BF8641]/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
              <HelpCircle className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Hotellinformation & Guider' : 'Guest Guide & Information'}</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>Göteborg</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F8F5EF] tracking-wide">
              {lang === 'sv' ? 'Praktisk Information inför din vistelse' : 'Practical Information & Hotel Policies'}
            </h1>
            <p className="text-sm sm:text-base text-[#EDE7DC]/90 leading-relaxed font-light">
              {lang === 'sv'
                ? 'Här finner du allt om incheckning, frukosttider, pool- och bastufaciliteter, parkeringsplatser och smidig kollektivtrafik till och från centrala Göteborg.'
                : 'Essential details regarding arrival, check-in policies, breakfast hours, pool and sauna amenities, on-site parking, and transit connections.'}
            </p>
          </div>

          {/* Audit Trigger */}
          <div className="shrink-0">
            <button
              onClick={() => setAuditModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-[#F8F5EF] border border-[#F2C777]/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md backdrop-blur-md"
            >
              <FileSearch className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Granska Källdata (Audit)' : 'Property Reconciliation'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. DIRECT CONTACT & CONCIERGE BAR */}
      <section className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-[#EDE7DC] p-6 rounded-2xl border border-[#D3C8B9] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#25303A] shadow-md">
          <div className="flex items-center gap-3 bg-[#F8F5EF] p-3.5 rounded-xl border border-[#D3C8B9]">
            <Phone className="w-5 h-5 text-[#BF8641] shrink-0" />
            <div>
              <span className="text-[10px] text-[#25303A]/70 uppercase block font-bold">{lang === 'sv' ? 'Telefon Reception' : 'Front Desk Phone'}</span>
              <span className="font-mono font-bold text-[#02070D]">+46 (0)31 750 19 00</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F8F5EF] p-3.5 rounded-xl border border-[#D3C8B9]">
            <Mail className="w-5 h-5 text-[#BF8641] shrink-0" />
            <div>
              <span className="text-[10px] text-[#25303A]/70 uppercase block font-bold">{lang === 'sv' ? 'E-post' : 'Email Address'}</span>
              <span className="font-semibold text-[#02070D]">reception@nordicgate.se</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F8F5EF] p-3.5 rounded-xl border border-[#D3C8B9]">
            <MapPin className="w-5 h-5 text-[#BF8641] shrink-0" />
            <div>
              <span className="text-[10px] text-[#25303A]/70 uppercase block font-bold">{lang === 'sv' ? 'Adress' : 'Location'}</span>
              <span className="font-semibold text-[#02070D]">Gamla Tingstadsgatan 1</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#F8F5EF] p-3.5 rounded-xl border border-[#D3C8B9]">
            <Clock className="w-5 h-5 text-[#BF8641] shrink-0" />
            <div>
              <span className="text-[10px] text-[#25303A]/70 uppercase block font-bold">{lang === 'sv' ? 'In- & Utcheckning' : 'Check-in / out'}</span>
              <span className="font-semibold text-[#02070D]">In: 15:00 · Ut: 11:00</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FACILITIES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-6">
        <FacilitiesGrid 
          facilities={CANDIDATE_FACILITIES}
          title={lang === 'sv' ? 'Faciliteter & Bekvämligheter' : 'Property Facilities & Amenities'}
          subtitle={lang === 'sv' ? 'Bekräftad inventering' : 'Verified Inventory'}
        />
      </section>

      {/* 4. HOTEL POLICIES CARD (Warm Sand #EDE7DC Surface) */}
      <section className="bg-[#EDE7DC] py-16 border-y border-[#D3C8B9]">
        <div className="max-w-7xl mx-auto px-6">
          <HotelPoliciesCard policies={HOTEL_POLICIES} />
        </div>
      </section>

      {/* 5. LOCATION AND TRANSPORT CARD */}
      <section className="max-w-7xl mx-auto px-6">
        <LocationAndTransportCard
          address={address}
          transports={TRANSPORT_DETAILS}
          attractions={NEARBY_ATTRACTIONS}
        />
      </section>

      {/* 6. FAQ ACCORDION (Warm Sand #EDE7DC Surface) */}
      <section className="bg-[#EDE7DC] py-16 border-y border-[#D3C8B9]">
        <div className="max-w-7xl mx-auto px-6">
          <FaqAccordion faqs={HOTEL_FAQS} />
        </div>
      </section>

      {/* 7. BOOKING CTA (Deep Navy #0D1A26 Section) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#0D1A26] text-white p-8 lg:p-12 rounded-2xl border border-[#BF8641]/30 text-center space-y-4 shadow-xl">
          <span className="text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
            {lang === 'sv' ? 'Välkommen till Göteborg' : 'Welcome to Gothenburg'}
          </span>
          <h3 className="font-serif text-2xl lg:text-3xl text-[#F8F5EF]">
            {lang === 'sv' ? 'Redo att boka din vistelse på Hotel Nordic Gate?' : 'Ready to Reserve Your Stay in Gothenburg?'}
          </h3>
          <p className="text-xs sm:text-sm text-[#D3C8B9] max-w-xl mx-auto">
            {lang === 'sv'
              ? 'Skandinavisk frukostbuffé och fri tillgång till uppvärmd inomhuspool och bastu ingår alltid i samtliga rumsbokningar.'
              : 'Scandinavian breakfast buffet and access to the heated indoor pool and sauna are always included.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/booking')}
              className="px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Boka Vistelse Online' : 'Book Online Now'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Reconciliation Modal */}
      <ReconciliationAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />

    </div>
  );
};
