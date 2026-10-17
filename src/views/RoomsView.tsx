import React, { useState, useMemo } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { CANDIDATE_ROOM_CATALOG } from '../data/propertyData.ts';
import { RoomComparisonModal } from '../components/rooms/RoomComparisonModal.tsx';
import { formatSEK } from '../lib/pricing.ts';
import { 
  Users, 
  Bed, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake,
  Coffee,
  Droplets,
  Wifi,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const RoomsView: React.FC = () => {
  const { lang, navigate } = useHotel();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCapacity, setFilterCapacity] = useState<number>(0);
  const [petFilter, setPetFilter] = useState<boolean>(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const candidateRooms = useMemo(() => {
    return CANDIDATE_ROOM_CATALOG
      .filter((room) => {
        if (filterCategory !== 'all' && room.category !== filterCategory) return false;
        if (filterCapacity > 0 && room.maxGuests < filterCapacity) return false;
        if (petFilter && !room.petEligible) return false;
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [filterCategory, filterCapacity, petFilter]);

  return (
    <div className="space-y-12 lg:space-y-16 pb-16">
      
      {/* 1. LUXURY HERO BANNER */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] pt-14 pb-16 px-6 relative overflow-hidden border-b border-[#BF8641]/20">
        <div className="absolute inset-0 bg-radial-at-t from-[#0D1A26] via-[#02070D] to-[#02070D] opacity-90" />
        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#F2C777]" />
            <span>{lang === 'sv' ? 'Kvalitetssäkrade rum & sviter' : 'Certified Accommodations'}</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span>{lang === 'sv' ? '5 Rumskategorier' : '5 Room Categories'}</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span>Göteborg</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F8F5EF] tracking-wide max-w-3xl leading-tight">
            {lang === 'sv' ? 'Rum & Sviter på Hotel Nordic Gate' : 'Rooms & Suites at Hotel Nordic Gate'}
          </h1>

          <p className="text-sm sm:text-base text-[#EDE7DC]/90 max-w-2xl leading-relaxed font-light">
            {lang === 'sv'
              ? 'Utforska våra 121 omsorgsfullt inredda hotellrum. Välj mellan yteffektiva kompakt- och standardrum, rymliga superiorrum samt bekväma familjerum för upp till 4 personer. Ekologisk frukostbuffé och tillgång till inomhuspool & bastu ingår alltid i rumspriset.'
              : 'Discover our 121 thoughtfully appointed guest rooms. Choose from compact and standard rooms to spacious superior options and flexible family accommodations for up to 4 guests. Scandinavian organic breakfast buffet and pool access are always included.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#D3C8B9]">
            <div className="flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Frukostbuffé ingår' : 'Breakfast buffet included'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Inomhuspool & bastu ingår' : 'Indoor pool & sauna included'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Höghastighets Wi-Fi' : 'High-speed Wi-Fi'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & CONTROLS CONTAINER */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#EDE7DC] p-4 lg:p-6 rounded-2xl border border-[#D3C8B9] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F8F5EF] rounded-xl border border-[#D3C8B9]">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterCategory === 'all' 
                  ? 'bg-[#0D1A26] text-white shadow-sm' 
                  : 'text-[#25303A] hover:text-[#02070D] hover:bg-black/5'
              }`}
            >
              {lang === 'sv' ? 'Alla rumstyper' : 'All rooms'}
            </button>
            <button
              onClick={() => setFilterCategory('compact')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterCategory === 'compact' 
                  ? 'bg-[#0D1A26] text-white shadow-sm' 
                  : 'text-[#25303A] hover:text-[#02070D] hover:bg-black/5'
              }`}
            >
              {lang === 'sv' ? 'Kompakt' : 'Compact'}
            </button>
            <button
              onClick={() => setFilterCategory('standard')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterCategory === 'standard' 
                  ? 'bg-[#0D1A26] text-white shadow-sm' 
                  : 'text-[#25303A] hover:text-[#02070D] hover:bg-black/5'
              }`}
            >
              {lang === 'sv' ? 'Standard' : 'Standard'}
            </button>
            <button
              onClick={() => setFilterCategory('superior')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterCategory === 'superior' 
                  ? 'bg-[#0D1A26] text-white shadow-sm' 
                  : 'text-[#25303A] hover:text-[#02070D] hover:bg-black/5'
              }`}
            >
              {lang === 'sv' ? 'Superior' : 'Superior'}
            </button>
            <button
              onClick={() => setFilterCategory('family')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterCategory === 'family' 
                  ? 'bg-[#0D1A26] text-white shadow-sm' 
                  : 'text-[#25303A] hover:text-[#02070D] hover:bg-black/5'
              }`}
            >
              {lang === 'sv' ? 'Familjerum' : 'Family Room'}
            </button>
          </div>

          {/* Capacity & Pet filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-[#25303A]">
              <span>{lang === 'sv' ? 'Kapacitet:' : 'Capacity:'}</span>
              <select
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(Number(e.target.value))}
                className="bg-[#F8F5EF] border border-[#D3C8B9] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#02070D] focus:ring-2 focus:ring-[#BF8641] focus:outline-none cursor-pointer"
              >
                <option value={0}>{lang === 'sv' ? 'Alla gästantal' : 'Any capacity'}</option>
                <option value={1}>1+ {lang === 'sv' ? 'gäst' : 'guest'}</option>
                <option value={2}>2+ {lang === 'sv' ? 'gäster' : 'guests'}</option>
                <option value={3}>3+ {lang === 'sv' ? 'gäster' : 'guests'}</option>
                <option value={4}>4 {lang === 'sv' ? 'gäster (Familj)' : 'guests (Family)'}</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-[#25303A] cursor-pointer bg-[#F8F5EF] px-3 py-1.5 rounded-lg border border-[#D3C8B9] hover:border-[#BF8641] transition-colors">
              <input
                type="checkbox"
                checked={petFilter}
                onChange={(e) => setPetFilter(e.target.checked)}
                className="rounded accent-[#BF8641] text-[#BF8641] focus:ring-[#BF8641]"
              />
              <HeartHandshake className="w-3.5 h-3.5 text-[#BF8641]" />
              <span>{lang === 'sv' ? 'Djurvänligt rum' : 'Pet-friendly'}</span>
            </label>
          </div>

        </div>
      </section>

      {/* 3. ROOM CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidateRooms.map((room) => {
            return (
              <article 
                key={room.id}
                className="bg-white rounded-2xl border border-[#EDE7DC] hover:border-[#BF8641]/60 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Room Image */}
                  <div className="aspect-[16/10] bg-[#0D1A26] overflow-hidden relative">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#0D1A26]/90 border border-white/10 text-[#F2C777] text-[11px] font-medium px-3 py-1 rounded-md backdrop-blur-md">
                      {lang === 'sv' ? room.bedConfigurationSv : room.bedConfigurationEn}
                    </div>

                    {room.petEligible && (
                      <div className="absolute top-3 right-3 bg-white/90 text-[#02070D] text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 backdrop-blur-sm">
                        <HeartHandshake className="w-3.5 h-3.5 text-[#BF8641]" />
                        <span>{lang === 'sv' ? 'Husdjur tillåtet' : 'Pet friendly'}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl font-bold text-[#02070D] group-hover:text-[#BF8641] transition-colors">
                        {lang === 'sv' ? room.nameSv : room.name}
                      </h3>
                      <p className="text-xs text-[#BF8641] font-semibold tracking-wide">
                        {lang === 'sv' ? room.taglineSv : room.taglineEn}
                      </p>
                    </div>

                    <p className="text-xs text-[#25303A] line-clamp-2 leading-relaxed">
                      {lang === 'sv' ? room.descriptionSv : room.descriptionEn}
                    </p>

                    {/* Specifications */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#25303A] py-3 border-y border-[#EDE7DC] bg-[#F8F5EF]/60 px-3 rounded-lg my-3">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#BF8641]" />
                        <span>Max {room.maxGuests} {lang === 'sv' ? 'gäster' : 'guests'}</span>
                      </span>
                      <span aria-hidden="true" className="text-[#D3C8B9]">·</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Bed className="w-3.5 h-3.5 text-[#BF8641]" />
                        <span>{room.bedConfigurationSv}</span>
                      </span>
                    </div>

                    {/* Amenities list */}
                    <div className="space-y-1.5 pt-1">
                      {room.amenities.slice(0, 3).map((a) => (
                        <div key={a.key} className="flex items-center gap-2 text-xs text-[#25303A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#BF8641] shrink-0" />
                          <span>{lang === 'sv' ? a.labelSv : a.labelEn}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions & Price */}
                <div className="px-6 pb-6 pt-4 border-t border-[#EDE7DC] bg-[#F8F5EF]/40 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-[#25303A]/70 font-medium block">
                      {lang === 'sv' ? 'Frånpris per natt' : 'From per night'}
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#02070D] tabular-nums">
                      {formatSEK(room.startingPriceSEK || 1295, lang)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/rooms/${room.id}`)}
                      className="px-3 py-2 border border-[#D3C8B9] hover:border-[#BF8641] hover:text-[#BF8641] text-[#25303A] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {lang === 'sv' ? 'Detaljer' : 'Details'}
                    </button>
                    <button
                      onClick={() => navigate('/booking', { categoryId: room.id })}
                      className="px-4 py-2 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center gap-1"
                    >
                      <span>{lang === 'sv' ? 'Boka' : 'Book'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. INCLUDED IN ALL STAYS (Warm Sand Surface to balance color) */}
      <section className="bg-[#EDE7DC] py-16 border-y border-[#D3C8B9]">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
              {lang === 'sv' ? 'Nordic Gate Gäststandard' : 'The Nordic Gate Standard'}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#02070D]">
              {lang === 'sv' ? 'Alltid inkluderat i ditt rumspris' : 'Always Included with Every Stay'}
            </h2>
            <p className="text-sm text-[#25303A]">
              {lang === 'sv'
                ? 'Inga dolda tillägg — vi vill att din hotellvistelse ska vara enkel, avkopplande och generös.'
                : 'No hidden fees — we believe in thoughtful, generous Scandinavian hospitality.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F8F5EF] p-6 rounded-xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#02070D]">
                {lang === 'sv' ? 'Ekologisk Frukostbuffé' : 'Organic Breakfast'}
              </h3>
              <p className="text-xs text-[#25303A] leading-relaxed">
                {lang === 'sv'
                  ? 'Nybakat surdegsbröd, äggröra, ostar, charkuterier, frukt och särskilt allergiutbud varje morgon.'
                  : 'Freshly baked breads, scrambled eggs, local cheeses, cold cuts, and dedicated dietary options.'}
              </p>
            </div>

            <div className="bg-[#F8F5EF] p-6 rounded-xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#02070D]">
                {lang === 'sv' ? 'Pool, Bastu & Jacuzzi' : 'Pool, Sauna & Jacuzzi'}
              </h3>
              <p className="text-xs text-[#25303A] leading-relaxed">
                {lang === 'sv'
                  ? 'Fri tillgång till 28°C uppvärmd inomhusbassäng, finsk torrbastu och varm bubbelpool dagligen.'
                  : 'Complimentary daily access to our 28°C heated indoor pool, Finnish sauna, and soothing hot tub.'}
              </p>
            </div>

            <div className="bg-[#F8F5EF] p-6 rounded-xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#02070D]">
                {lang === 'sv' ? 'Höghastighets Wi-Fi' : 'High-Speed Wi-Fi'}
              </h3>
              <p className="text-xs text-[#25303A] leading-relaxed">
                {lang === 'sv'
                  ? 'Snabbt och stabilt trådlöst nätverk i samtliga rum, konferensytor och allmänna utrymmen.'
                  : 'Fast, secure fiber connectivity across all rooms, public areas, and co-working spots.'}
              </p>
            </div>

            <div className="bg-[#F8F5EF] p-6 rounded-xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#02070D]">
                {lang === 'sv' ? '24h Bemannad Reception' : '24h Front Desk'}
              </h3>
              <p className="text-xs text-[#25303A] leading-relaxed">
                {lang === 'sv'
                  ? 'Trygghet dygnet runt med personal på plats, bagageförvaring och lokal rådgivning.'
                  : 'Around-the-clock front desk presence, secure luggage storage, and personalized city recommendations.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEEP NAVY CTA (Alternating depth) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 lg:p-12 rounded-2xl border border-[#BF8641]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
              {lang === 'sv' ? 'Personlig Service' : 'Personal Assistance'}
            </span>
            <h3 className="font-serif text-2xl lg:text-3xl text-[#F8F5EF]">
              {lang === 'sv' ? 'Planerar du grupp-, familje- eller företagsbokning?' : 'Planning a Family, Group, or Corporate Stay?'}
            </h3>
            <p className="text-xs sm:text-sm text-[#D3C8B9] max-w-xl">
              {lang === 'sv'
                ? 'Kontakta oss direkt för skräddarsydda rumsförslag och företagsavtal i Göteborg.'
                : 'Reach out to our Gothenburg reservation team for tailored group options and corporate stays.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/booking')}
              className="px-6 py-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>{lang === 'sv' ? 'Boka Online Nu' : 'Book Online Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/faq')}
              className="px-6 py-3 border border-white/30 hover:border-white text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              {lang === 'sv' ? 'Hotellinformation' : 'Hotel Information'}
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Modal */}
      <RoomComparisonModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />

    </div>
  );
};
