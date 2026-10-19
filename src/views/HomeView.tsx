import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { HOTEL_IMAGES } from '../data/hotelData.ts';
import { 
  HOTEL_NORDIC_GATE_PROPERTY, 
  CANDIDATE_ROOM_CATALOG, 
  CANDIDATE_FACILITIES,
  HOTEL_POLICIES,
  TRANSPORT_DETAILS,
  NEARBY_ATTRACTIONS,
  HOTEL_FAQS
} from '../data/propertyData.ts';
import { AvailabilitySearchBar } from '../components/booking/AvailabilitySearchBar.tsx';
import { FacilitiesGrid } from '../components/property/FacilitiesGrid.tsx';
import { HotelPoliciesCard } from '../components/property/HotelPoliciesCard.tsx';
import { LocationAndTransportCard } from '../components/property/LocationAndTransportCard.tsx';
import { FaqAccordion } from '../components/property/FaqAccordion.tsx';
import { FamilyFeaturesCard } from '../components/property/FamilyFeaturesCard.tsx';
import { ReconciliationAuditModal } from '../components/property/ReconciliationAuditModal.tsx';
import { formatSEK } from '../lib/pricing.ts';
import { 
  ArrowRight, 
  Sparkles, 
  UtensilsCrossed, 
  Droplets, 
  ShieldCheck, 
  Star,
  MapPin, 
  Compass,
  CheckCircle2,
  Calendar,
  Waves,
  Coffee,
  Car,
  Wifi,
  Users,
  FileSearch,
  Check
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { lang, navigate } = useHotel();
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const address = {
    street: HOTEL_NORDIC_GATE_PROPERTY.address.street.value,
    postalCode: HOTEL_NORDIC_GATE_PROPERTY.address.postalCode.value,
    city: HOTEL_NORDIC_GATE_PROPERTY.address.city.value,
    district: HOTEL_NORDIC_GATE_PROPERTY.address.district.value,
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#02070D] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={HOTEL_IMAGES.facadeHero}
            alt="Hotel Nordic Gate Göteborg"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-80 scale-102 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02070D] via-[#02070D]/50 to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 lg:pt-36 pb-12 w-full flex-1 flex flex-col justify-center">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#F2C777] font-medium">
              <span>Göteborg</span>
              <span aria-hidden="true">·</span>
              <span>Hisings Backa</span>
              <span aria-hidden="true">·</span>
              <span>10 min till Centralen</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F8F5EF] leading-[1.12] text-balance">
              {lang === 'sv'
                ? 'Välkomnande skandinavisk gästfrihet i Göteborg'
                : 'Welcoming Scandinavian hospitality in Gothenburg'}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-[#EDE7DC]/90 max-w-2xl font-light leading-relaxed">
              {lang === 'sv'
                ? 'Upplev avkoppling med uppvärmd inomhuspool, finsk bastu, ekologisk frukostbuffé och smidiga bussförbindelser direkt till Göteborgs hjärta.'
                : 'Experience relaxation with a heated indoor pool, Finnish sauna, complimentary organic breakfast buffet, and direct 10-minute bus transit to Gothenburg Central.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/booking')}
                className="px-7 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs lg:text-sm font-semibold uppercase tracking-wider rounded transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Boka Vistelse' : 'Reserve Your Stay'}</span>
              </button>

              <button
                onClick={() => navigate('/rooms')}
                className="px-7 py-3.5 border border-white/40 hover:border-white text-white hover:bg-white/10 text-xs lg:text-sm font-medium uppercase tracking-wider rounded transition-all cursor-pointer"
              >
                {lang === 'sv' ? 'Utforska Rumskategorier' : 'Explore Room Categories'}
              </button>

              <button
                onClick={() => setAuditModalOpen(true)}
                className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-[#D3C8B9] hover:text-white text-xs font-medium uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-sm"
                title="Granska källdata och avstämning mot Quality Hotel Winn"
              >
                <FileSearch className="w-3.5 h-3.5 text-[#F2C777]" />
                <span>Källdata (Audit)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Availability Search Bar */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full -mb-10 lg:-mb-14">
          <AvailabilitySearchBar />
        </div>
      </section>

      {/* 2. HOTEL HIGHLIGHTS STRIP */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-5 bg-white rounded-xl border border-[#EDE7DC] flex items-start gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5EF] text-[#BF8641] flex items-center justify-center shrink-0 border border-[#EDE7DC]">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-slate-900">Inomhuspool & Bastu</h4>
              <p className="text-xs text-slate-500 mt-0.5">Uppvärmd pool, bubbelpool och finsk bastu ingår</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#EDE7DC] flex items-start gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5EF] text-[#BF8641] flex items-center justify-center shrink-0 border border-[#EDE7DC]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-slate-900">Ekologisk Frukost</h4>
              <p className="text-xs text-slate-500 mt-0.5">Generös skandinavisk buffé med specialkost</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#EDE7DC] flex items-start gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5EF] text-[#BF8641] flex items-center justify-center shrink-0 border border-[#EDE7DC]">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-slate-900">Parkering & Elbil</h4>
              <p className="text-xs text-slate-500 mt-0.5">Privat parkering vid hotellet med typ 2-laddstolpar</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[#EDE7DC] flex items-start gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-[#F8F5EF] text-[#BF8641] flex items-center justify-center shrink-0 border border-[#EDE7DC]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-slate-900">10 min till Centrum</h4>
              <p className="text-xs text-slate-500 mt-0.5">Hållplats Balladgatan precis utanför entrén</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CANDIDATE ROOM CATALOG HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#BF8641]" />
              <span>{lang === 'sv' ? 'Kandidatkatalog (Reference Source)' : 'Candidate Room Catalog'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#02070D] mt-1">
              {lang === 'sv' ? 'Rumstyper & Boende' : 'Room Categories & Accommodations'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {lang === 'sv'
                ? 'Utvalda rumskategorier refererade från hotellkatalogen med skandinavisk komfort och frukostbuffé.'
                : 'Provisional candidate room types based on verified reference inventory with included breakfast.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/rooms')}
            className="text-xs font-semibold uppercase tracking-wider text-[#0D1A26] hover:text-[#BF8641] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{lang === 'sv' ? 'Se alla 5 rumskategorier' : 'View all 5 room types'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CANDIDATE_ROOM_CATALOG.slice(0, 3).map((room) => (
            <div 
              key={room.id}
              className="bg-white rounded-xl border border-[#EDE7DC] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#0D1A26]/80 text-white text-[11px] px-2.5 py-1 rounded backdrop-blur-sm font-medium">
                    {room.bedConfigurationSv}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                    {lang === 'sv' ? room.nameSv : room.name}
                  </h3>
                  <p className="text-xs text-[#BF8641] font-medium">
                    {lang === 'sv' ? room.taglineSv : room.taglineEn}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {lang === 'sv' ? room.descriptionSv : room.descriptionEn}
                  </p>

                  <div className="pt-3 border-t border-neutral-100 flex items-center gap-4 text-xs text-slate-500">
                    <span>Max {room.maxGuests} gäster</span>
                    <span>·</span>
                    <span>{room.petEligible ? 'Husdjur tillåtet' : 'Ej husdjur'}</span>
                    <span>·</span>
                    <span>Frukost ingår</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-neutral-100">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">{lang === 'sv' ? 'Frånpris' : 'From'}</span>
                  <span className="text-xl font-bold text-slate-900 tabular-nums">
                    {formatSEK(room.startingPriceSEK || 1295, lang)}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/booking', { categoryId: room.id })}
                  className="px-4 py-2 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {lang === 'sv' ? 'Välj Rum' : 'Select'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CANDIDATE FACILITIES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-6">
        <FacilitiesGrid
          facilities={CANDIDATE_FACILITIES}
          title={lang === 'sv' ? 'Hotellfaciliteter & Service' : 'Hotel Facilities & Services'}
          subtitle={lang === 'sv' ? 'Allt för en bekväm vistelse' : 'Everything For A Seamless Stay'}
          showCategoryFilter={true}
        />
      </section>

      {/* 5. RECREATION, INDOOR POOL & SAUNA */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F2C777]">
                <Droplets className="w-3.5 h-3.5" />
                <span>{lang === 'sv' ? 'Relax & Hälsa' : 'Indoor Relaxation'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F8F5EF] leading-tight">
                {lang === 'sv'
                  ? 'Uppvärmd inomhuspool, finsk bastu och bubbelpool'
                  : 'Heated indoor pool, Finnish sauna & hydrotherapy'}
              </h2>

              <p className="text-sm text-[#D3C8B9] leading-relaxed">
                {lang === 'sv'
                  ? 'Koppla av i vår trivsamma relaxavdelning efter arbetsdagen eller stadsbesöket i Göteborg. Ta ett dopp i den uppvärmda inomhuspoolen, varva ner i bastun eller sjunk ner i bubbelpoolen. För träningssugna finns även samarbete med ett närliggande gym samt fina motionsspår.'
                  : 'Unwind in our wellness area after exploring Gothenburg or attending meetings. Enjoy year-round swimming in the heated indoor pool, decompress in the Finnish sauna, or soak in the hot tub. Guests also enjoy partner gym access just 4 minutes walk away.'}
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#EDE7DC]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span>{lang === 'sv' ? 'Uppvärmd inomhuspool med behaglig vattentemperatur' : 'Heated indoor swimming pool open year-round'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span>{lang === 'sv' ? 'Klassisk finsk torrbastu och varm bubbelpool' : 'Finnish dry sauna and hydrotherapy hot tub'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span>{lang === 'sv' ? 'Fri entré för alla boende hotellgäster' : 'Complimentary access for all hotel guests'}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/spa')}
                  className="px-6 py-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  {lang === 'sv' ? 'Läs mer om relaxavdelningen' : 'Discover Wellness'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={HOTEL_IMAGES.spaWellness}
                  alt="Inomhuspool och bastu"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. BREAKFAST & DINING */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-lg border border-[#EDE7DC]">
              <img
                src={HOTEL_IMAGES.diningRestaurant}
                alt="Frukostbuffé och restaurang"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#BF8641]">
              <Coffee className="w-3.5 h-3.5" />
              <span>{lang === 'sv' ? 'Frukost & Gastronomi' : 'Breakfast & Dining'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#02070D] leading-tight">
              {lang === 'sv'
                ? 'Skandinavisk ekologisk frukostbuffé och kvällsbistro'
                : 'Scandinavian organic breakfast & evening bistro'}
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === 'sv'
                ? 'Varje morgon dukar vi upp vår generösa frukostbuffé med nybakat bröd, varma rätter, ekologiska alternativ och specialkost för gluten-, laktos- och vegandiet. På kvällen välkomnar vår restaurang och loungebar med vällagade svenska och europeiska favoriter.'
                : 'Every morning begins with our rich breakfast buffet featuring fresh bakery items, hot breakfast favourites, and dedicated dietary options for gluten-free, lactose-free, and vegan diets. In the evening, the restaurant and lounge bar offer European and Swedish classics.'}
            </p>

            <div className="space-y-2.5 pt-1 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#BF8641] shrink-0" />
                <span>{lang === 'sv' ? 'Alltid inkluderat i ditt rumspris' : 'Always included in your room rate'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#BF8641] shrink-0" />
                <span>{lang === 'sv' ? 'Middagsservering & bar med lokala drycker' : 'Dinner service & bar with local craft selections'}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/dining')}
                className="px-6 py-3 border border-[#0D1A26] text-[#0D1A26] hover:bg-[#0D1A26] hover:text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                {lang === 'sv' ? 'Se frukosttider & menyer' : 'Explore Dining & Hours'}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FAMILY-FRIENDLY ACCOMMODATIONS & AMENITIES */}
      <section className="max-w-7xl mx-auto px-6">
        <FamilyFeaturesCard />
      </section>

      {/* 8. HOTEL POLICIES & ESSENTIAL INFORMATION */}
      <section className="max-w-7xl mx-auto px-6">
        <HotelPoliciesCard policies={HOTEL_POLICIES} />
      </section>

      {/* 7. LOCATION & TRANSIT BREAKDOWN */}
      <section className="max-w-7xl mx-auto px-6">
        <LocationAndTransportCard
          address={address}
          transports={TRANSPORT_DETAILS}
          attractions={NEARBY_ATTRACTIONS}
        />
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="max-w-7xl mx-auto px-6">
        <FaqAccordion faqs={HOTEL_FAQS} />
      </section>

      {/* Reconciliation Audit Modal */}
      <ReconciliationAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />

    </div>
  );
};
