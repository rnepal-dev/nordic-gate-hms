import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { RATE_PLANS } from '../data/hotelData.ts';
import { formatSEK } from '../lib/pricing.ts';
import { 
  Maximize2, 
  Users, 
  Bed, 
  Eye, 
  Check, 
  ArrowLeft, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Coffee,
  Droplets,
  Wifi,
  HeartHandshake
} from 'lucide-react';
import { CANDIDATE_ROOM_CATALOG } from '../data/propertyData.ts';

interface RoomDetailViewProps {
  slug: string;
}

export const RoomDetailView: React.FC<RoomDetailViewProps> = ({ slug }) => {
  const { lang, roomCategories, navigate } = useHotel();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedRatePlanId, setSelectedRatePlanId] = useState<string>('flexible');

  // Check candidate catalog first, then legacy categories
  const candidate = CANDIDATE_ROOM_CATALOG.find(r => r.id === slug || r.name.toLowerCase().replace(/\s+/g, '-') === slug);
  const legacy = roomCategories.find(r => r.slug === slug);

  const room = candidate ? {
    id: candidate.id,
    slug: candidate.id,
    name: candidate.name,
    nameSv: candidate.nameSv,
    tagline: candidate.taglineEn || '',
    taglineSv: candidate.taglineSv || '',
    description: candidate.descriptionEn,
    descriptionSv: candidate.descriptionSv,
    dimensionsM2: candidate.sizeM2 || 22,
    maxGuests: candidate.maxGuests,
    bedType: candidate.bedConfigurationEn,
    bedTypeSv: candidate.bedConfigurationSv,
    view: 'Gothenburg Surroundings',
    viewSv: 'Göteborg med omnejd',
    floor: 'Plan 1–5',
    startingPriceSEK: candidate.startingPriceSEK || 1295,
    image: candidate.images[0],
    additionalImages: candidate.images.slice(1),
    amenities: candidate.amenities,
    featured: true,
    petEligible: candidate.petEligible,
  } : (legacy || roomCategories[0]);

  const allImages = [room.image, ...room.additionalImages];

  const selectedPlan = RATE_PLANS.find(p => p.id === selectedRatePlanId) || RATE_PLANS[0];
  const calculatedPrice = Math.round(room.startingPriceSEK * selectedPlan.multiplier);

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. TOP BREADCRUMB BAR (Warm Sand #EDE7DC) */}
      <div className="bg-[#EDE7DC] border-b border-[#D3C8B9] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => navigate('/rooms')}
            className="inline-flex items-center gap-2 text-[#25303A] hover:text-[#BF8641] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#BF8641]" />
            <span>{lang === 'sv' ? 'Tillbaka till alla rum' : 'Back to all rooms'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-[#25303A]/70">
            <span>Hotel Nordic Gate</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#BF8641]" />
            <span>{lang === 'sv' ? 'Rum & Sviter' : 'Rooms & Suites'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#BF8641]" />
            <span className="text-[#02070D] font-bold">{lang === 'sv' ? room.nameSv : room.name}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN ROOM CONTENT */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Gallery & Story (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Hero Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] bg-[#0D1A26] rounded-2xl overflow-hidden shadow-lg border border-[#EDE7DC]">
                <img
                  src={allImages[selectedImageIndex]}
                  alt={lang === 'sv' ? room.nameSv : room.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#0D1A26]/85 border border-white/15 px-3 py-1.5 rounded-lg text-[#F2C777] text-xs font-semibold backdrop-blur-md">
                  {lang === 'sv' ? room.floor : room.floor}
                </div>

                {('petEligible' in room && Boolean((room as any).petEligible)) && (
                  <div className="absolute top-4 right-4 bg-white/90 text-[#02070D] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 backdrop-blur-sm">
                    <HeartHandshake className="w-4 h-4 text-[#BF8641]" />
                    <span>{lang === 'sv' ? 'Djurvänligt rum på förfrågan' : 'Pet-friendly on request'}</span>
                  </div>
                )}
              </div>

              {/* Thumbnail row */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-[16/10] w-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx 
                        ? 'border-[#BF8641] ring-2 ring-[#BF8641]/40 scale-102' 
                        : 'border-[#EDE7DC] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Tagline Box */}
            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#EDE7DC] shadow-sm space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold block">
                  {lang === 'sv' ? 'Hotellrum i Hisings Backa, Göteborg' : 'Guest Room in Gothenburg'}
                </span>
                <h1 className="font-serif text-3xl lg:text-4xl text-[#02070D] tracking-wide">
                  {lang === 'sv' ? room.nameSv : room.name}
                </h1>
                <p className="text-sm lg:text-base text-[#BF8641] font-semibold tracking-wide">
                  {lang === 'sv' ? room.taglineSv : room.tagline}
                </p>
              </div>

              {/* Unboxed specs in warm container */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#EDE7DC]">
                <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#EDE7DC] flex items-center gap-2.5">
                  <Maximize2 className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#25303A]/70 uppercase block font-semibold">{lang === 'sv' ? 'Yta' : 'Size'}</span>
                    <span className="text-xs font-bold text-[#02070D]">{room.dimensionsM2} m²</span>
                  </div>
                </div>

                <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#EDE7DC] flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#25303A]/70 uppercase block font-semibold">{lang === 'sv' ? 'Gäster' : 'Guests'}</span>
                    <span className="text-xs font-bold text-[#02070D]">Max {room.maxGuests}</span>
                  </div>
                </div>

                <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#EDE7DC] flex items-center gap-2.5">
                  <Bed className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#25303A]/70 uppercase block font-semibold">{lang === 'sv' ? 'Bäddar' : 'Beds'}</span>
                    <span className="text-xs font-bold text-[#02070D] truncate">{lang === 'sv' ? room.bedTypeSv : room.bedType}</span>
                  </div>
                </div>

                <div className="bg-[#F8F5EF] p-3 rounded-xl border border-[#EDE7DC] flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#25303A]/70 uppercase block font-semibold">{lang === 'sv' ? 'Utsikt' : 'View'}</span>
                    <span className="text-xs font-bold text-[#02070D]">{lang === 'sv' ? room.viewSv : room.view}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Story */}
            <div className="bg-[#EDE7DC] p-6 lg:p-8 rounded-2xl border border-[#D3C8B9] space-y-4 text-[#25303A] leading-relaxed text-sm lg:text-base">
              <h3 className="font-serif text-2xl text-[#02070D] font-bold">
                {lang === 'sv' ? 'Om Rummet & Komforten' : 'About This Room & Comfort'}
              </h3>
              <p className="font-medium text-[#02070D]">
                {lang === 'sv' ? room.descriptionSv : room.description}
              </p>
              <p className="text-xs lg:text-sm">
                {lang === 'sv'
                  ? 'Rummet är omsorgsfullt planerat för god nattsömn och hög komfort. Här finns sköna sängar, skrivbordsyta, mörkläggningsgardiner och helkaklat badrum med dusch. Varje morgon serveras vår generösa frukostbuffé i restaurangen, och entré till inomhuspool och bastu ingår under hela vistelsen.'
                  : 'Designed with restful Scandinavian aesthetics, this room offers premium bedding, a practical workstation, blackout drapery, and a modern tiled en-suite shower. Enjoy complimentary organic buffet breakfast every morning and unlimited access to the heated indoor pool and sauna.'}
              </p>
            </div>

            {/* Full Amenities Grid */}
            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#EDE7DC] space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE7DC]">
                <h3 className="font-serif text-2xl text-[#02070D] font-bold">
                  {lang === 'sv' ? 'Bekvämligheter & Rumsdetaljer' : 'Amenities & Inclusions'}
                </h3>
                <span className="text-xs text-[#BF8641] font-semibold uppercase tracking-wider">
                  {lang === 'sv' ? 'Allt ingår' : 'Complimentary'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {room.amenities.map((amenity) => (
                  <div key={amenity.key} className="flex items-center gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] text-xs font-medium text-[#25303A]">
                    <Check className="w-4 h-4 text-[#BF8641] shrink-0" />
                    <span>{lang === 'sv' ? amenity.labelSv : amenity.labelEn}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] text-xs font-medium text-[#25303A]">
                  <Coffee className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span>{lang === 'sv' ? 'Ekologisk frukostbuffé i restaurangen' : 'Organic Scandinavian breakfast buffet'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] text-xs font-medium text-[#25303A]">
                  <Droplets className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span>{lang === 'sv' ? 'Entré till uppvärmd inomhuspool & bastu' : 'Heated indoor pool & Finnish sauna access'}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] text-xs font-medium text-[#25303A]">
                  <Wifi className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span>{lang === 'sv' ? 'Höghastighets Wi-Fi & Chromecast' : 'High-speed Wi-Fi & streaming'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Rate Selection & Reservation Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-[#EDE7DC] shadow-xl space-y-6">
              
              <div className="pb-4 border-b border-[#EDE7DC] bg-[#F8F5EF] -m-6 mb-2 p-6 rounded-t-2xl">
                <span className="text-[11px] uppercase tracking-wider text-[#BF8641] font-bold block">
                  {lang === 'sv' ? 'Bästa pris direkt hos hotellet' : 'Direct Booking Best Price'}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-serif text-3xl font-bold text-[#02070D] tabular-nums">
                    {formatSEK(calculatedPrice, lang)}
                  </span>
                  <span className="text-xs text-[#25303A]/70 font-medium">
                    {lang === 'sv' ? '/ natt inkl. moms' : '/ night incl. VAT'}
                  </span>
                </div>
              </div>

              {/* Rate Plan Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#02070D]">
                  {lang === 'sv' ? 'Välj Pristyp & Villkor' : 'Select Rate Plan'}
                </label>

                <div className="space-y-2.5">
                  {RATE_PLANS.map((plan) => {
                    const isSelected = selectedRatePlanId === plan.id;
                    const planPrice = Math.round(room.startingPriceSEK * plan.multiplier);

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedRatePlanId(plan.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-[#BF8641] bg-[#EDE7DC]/50 ring-2 ring-[#BF8641]' 
                            : 'border-[#EDE7DC] hover:border-[#D3C8B9] bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#02070D]">
                            {lang === 'sv' ? plan.nameSv : plan.name}
                          </span>
                          <span className="font-mono font-bold text-[#02070D] tabular-nums">
                            {formatSEK(planPrice, lang)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#25303A] mt-1 leading-snug">
                          {lang === 'sv' ? plan.cancellationPolicySv : plan.cancellationPolicy}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inclusions summary */}
              <div className="p-4 bg-[#EDE7DC] rounded-xl text-xs space-y-2 text-[#25303A] border border-[#D3C8B9]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span className="font-semibold text-[#02070D]">{lang === 'sv' ? 'Garanterat bästa pris via nordicgate.se' : 'Best price guarantee when booking direct'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span>{lang === 'sv' ? 'Ekologisk frukostbuffé ingår alltid' : 'Organic breakfast always included'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#BF8641] shrink-0" />
                  <span>{lang === 'sv' ? 'Fri entré till pool och bastu' : 'Free access to pool & sauna'}</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => navigate('/booking', { categoryId: room.id, ratePlanId: selectedRatePlanId })}
                className="w-full py-4 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Boka Detta Rum' : 'Reserve This Room'}</span>
              </button>

              <p className="text-[11px] text-center text-[#25303A]/70 font-medium">
                {lang === 'sv' ? 'Omedelbar bokningsbekräftelse · Kontantfritt hotell' : 'Instant booking confirmation · Cash-free property'}
              </p>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
