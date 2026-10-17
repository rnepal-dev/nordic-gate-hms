import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { HOTEL_IMAGES } from '../data/hotelData.ts';
import { HOTEL_NORDIC_GATE_PROPERTY } from '../data/propertyData.ts';
import { ReconciliationAuditModal } from '../components/property/ReconciliationAuditModal.tsx';
import { 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Droplets, 
  Coffee, 
  Car, 
  Users, 
  FileSearch,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const OurStoryView: React.FC = () => {
  const { lang, navigate } = useHotel();
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <div className="space-y-16 lg:space-y-20 pb-16">
      
      {/* 1. LUXURY HERO BANNER */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] pt-14 pb-16 px-6 border-b border-[#BF8641]/20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
            <Compass className="w-4 h-4 text-[#F2C777]" />
            <span>{lang === 'sv' ? 'Om Hotellet' : 'About The Property'}</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span>Göteborg</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#F8F5EF] tracking-wide">
            {lang === 'sv' ? 'Välkommen till Hotel Nordic Gate' : 'Welcome to Hotel Nordic Gate'}
          </h1>
          <p className="text-base sm:text-lg text-[#EDE7DC]/90 font-light leading-relaxed max-w-2xl mx-auto">
            {lang === 'sv'
              ? 'Skandinavisk gästfrihet präglad av enkelhet, värme och omtanke. Ett modernt och bekvämt hotell i Göteborg med uppvärmd inomhuspool, bastu, ekologisk frukostbuffé och smidiga kommunikationer.'
              : 'Scandinavian hospitality defined by warmth, ease, and mindful comfort. A welcoming Gothenburg property featuring an indoor heated pool, Finnish sauna, organic breakfast, and direct transit.'}
          </p>
        </div>
      </section>

      {/* 2. MAIN STORY & PROPERTY REALITY */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5 text-[#25303A] text-sm leading-relaxed">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
              <MapPin className="w-4 h-4 text-[#BF8641]" />
              <span>Hisings Backa · Göteborg</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#02070D] leading-tight font-bold">
              {lang === 'sv' 
                ? 'Ett bekvämt hem i Göteborg för arbete och fritid' 
                : 'A comfortable home in Gothenburg for leisure and business'}
            </h2>
            <p>
              {lang === 'sv'
                ? 'Hotel Nordic Gate är beläget på Gamla Tingstadsgatan 1 i Hisings Backa, ett strategiskt och lugnt läge strax norr om centrala Göteborg. Med buss från hållplatsen Balladgatan precis utanför når du Göteborgs Centralstation på cirka 10 minuter.'
                : 'Hotel Nordic Gate is located at Gamla Tingstadsgatan 1 in Hisings Backa, positioned just north of central Gothenburg. Direct city bus service from Balladgatan right outside takes you to Gothenburg Central Station in approximately 10 minutes.'}
            </p>
            <p>
              {lang === 'sv'
                ? 'Hotellet omfattar 121 omsorgsfullt planerade rum fördelade över fem våningsplan — från kompakta och yteffektiva dubbelrum till rymliga familjerum. Här möts affärsresenärer, par och barnfamiljer i en avslappnad och trygg atmosfär.'
                : 'The hotel encompasses 121 thoughtfully planned rooms across five floors — ranging from compact, efficient doubles and twin rooms to generous family accommodations. Business travellers, weekend couples, and visiting families find an easy, relaxed home base.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setAuditOpen(true)}
                className="px-5 py-3 bg-[#0D1A26] hover:bg-[#02070D] text-[#F8F5EF] text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <FileSearch className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Granska källdata & avstämning' : 'View Property Reconciliation'}</span>
              </button>
              <button
                onClick={() => navigate('/faq')}
                className="px-5 py-3 border border-[#D3C8B9] hover:border-[#BF8641] text-[#02070D] text-xs font-bold rounded-xl uppercase tracking-wider transition-colors cursor-pointer bg-white"
              >
                {lang === 'sv' ? 'Praktisk hotellinformation' : 'Hotel Guide & Policies'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-[#EDE7DC]">
              <img
                src={HOTEL_IMAGES.facadeHero}
                alt="Hotel Nordic Gate fasad"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES (Warm Sand #EDE7DC Surface) */}
      <section className="bg-[#EDE7DC] py-16 border-y border-[#D3C8B9]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
              {lang === 'sv' ? 'Gästupplevelsen' : 'The Guest Experience'}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#02070D]">
              {lang === 'sv' ? 'Vad som utmärker din vistelse hos oss' : 'What Defines Your Stay With Us'}
            </h2>
            <p className="text-xs text-[#25303A]">
              {lang === 'sv' ? 'Skandinavisk omtanke och konkreta faciliteter' : 'Scandinavian mindfulness and tangible comfort'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#25303A]">
            <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#02070D]">
                {lang === 'sv' ? 'Uppvärmd Inomhuspool & Bastu' : 'Indoor Pool & Finnish Sauna'}
              </h3>
              <p className="leading-relaxed text-[#25303A]">
                {lang === 'sv'
                  ? 'Koppla av i vår uppvärmda inomhusbassäng och torrbastu efter en lång arbetsdag eller en dag på Liseberg. Fri entré för samtliga hotellgäster.'
                  : 'Unwind in our heated indoor pool and sauna after a long day of meetings or family exploration at Liseberg. Always included for resident guests.'}
              </p>
            </div>

            <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#02070D]">
                {lang === 'sv' ? 'Skandinavisk Frukostbuffé' : 'Organic Breakfast Buffet'}
              </h3>
              <p className="leading-relaxed text-[#25303A]">
                {lang === 'sv'
                  ? 'Börja dagen med vår rika frukostbuffé med nybakat bröd, varma rätter, ekologiskt kaffe samt särskilt allergiutbud för gluten-, laktos- och vegandiet.'
                  : 'Start your morning with freshly baked breads, warm dishes, organic coffee, and dedicated dietary options for gluten-free and vegan preferences.'}
              </p>
            </div>

            <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#02070D]">
                {lang === 'sv' ? 'Parkering & Trygg Miljö' : 'On-Site Parking & Smoke-Free'}
              </h3>
              <p className="leading-relaxed text-[#25303A]">
                {lang === 'sv'
                  ? 'Privat parkering med elbilsladdning direkt vid hotellet, 100% rökfritt, kontantfritt för ökad trygghet, samt djurvänliga rum på förfrågan.'
                  : 'Convenient outdoor and garage parking with EV charging, 100% non-smoking indoors, cash-free for peace of mind, and pet-friendly rooms on request.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOSPITALITY PLEDGE (Deep Navy #0D1A26 Card) */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 lg:p-12 rounded-2xl border border-[#BF8641]/30 shadow-xl space-y-4 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
            {lang === 'sv' ? 'Vårt Löfte' : 'Our Commitment'}
          </span>
          <blockquote className="font-serif text-2xl lg:text-3xl text-[#F8F5EF] leading-relaxed max-w-2xl mx-auto italic">
            {lang === 'sv'
              ? '”Vi vill att varje gäst ska känna sig sedd, trygg och väl omhändertagen — oavsett om du stannar en natt i tjänsten eller en hel vecka med familjen.”'
              : '"Our goal is simple: to make every guest feel welcomed, at ease, and thoughtfully cared for — whether visiting for a single business night or a week of family exploration."'}
          </blockquote>
          <p className="text-xs text-[#D3C8B9] tracking-wider uppercase font-semibold">
            {lang === 'sv' ? 'Teamet på Hotel Nordic Gate · Göteborg' : 'The Team at Hotel Nordic Gate · Gothenburg'}
          </p>
        </div>
      </section>

      {/* 5. BOOK CTA */}
      <section className="max-w-2xl mx-auto px-6 text-center space-y-4">
        <h3 className="font-serif text-3xl text-[#02070D]">
          {lang === 'sv' ? 'Välkommen till Hotel Nordic Gate' : 'Plan Your Stay at Nordic Gate'}
        </h3>
        <p className="text-sm text-[#25303A]">
          {lang === 'sv' 
            ? 'Boka ditt rum direkt online till förmånliga priser med frukostbuffé och poolentré inkluderat.' 
            : 'Book your room directly online with organic breakfast and indoor pool access included.'}
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/booking')}
            className="px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <span>{lang === 'sv' ? 'Boka Vistelse' : 'Reserve Your Stay'}</span>
            <ArrowRight className="w-4 h-4 text-[#F2C777]" />
          </button>
        </div>
      </section>

      {/* Reconciliation Modal */}
      <ReconciliationAuditModal
        isOpen={auditOpen}
        onClose={() => setAuditOpen(false)}
      />

    </div>
  );
};
