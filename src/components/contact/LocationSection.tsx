import React from 'react';
import { 
  MapPin, 
  Bus, 
  Car, 
  Plane, 
  Compass, 
  ExternalLink, 
  Navigation, 
  Sparkles 
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext.tsx';
import { HOTEL_NORDIC_GATE_PROPERTY } from '../../data/propertyData.ts';

export const LocationSection: React.FC = () => {
  const { lang, navigate } = useHotel();
  const address = HOTEL_NORDIC_GATE_PROPERTY.address;

  const destinations = [
    {
      titleEn: 'Gothenburg Central Station',
      titleSv: 'Göteborgs Centralstation',
      descEn: 'Direct city bus from Balladgatan stop to station doors',
      descSv: 'Direktbuss från hållplats Balladgatan till stationen',
      time: '10 min',
      distance: '3.0 km',
    },
    {
      titleEn: 'Gothenburg City Center & Nordstan',
      titleSv: 'Göteborg Centrum & Nordstan',
      descEn: 'Boutique shopping, canals, and fine dining',
      descSv: 'Shopping, kanaler och restaurangkvarter',
      time: '12 min',
      distance: '3.2 km',
    },
    {
      titleEn: 'Liseberg Amusement Park',
      titleSv: 'Lisebergs Nöjespark',
      descEn: 'Scandinavia’s premier leisure and seasonal events venue',
      descSv: 'Nordens största nöjespark och julevenemang',
      time: '18 min',
      distance: '5.6 km',
    },
    {
      titleEn: 'Landvetter Airport (GOT)',
      titleSv: 'Göteborg Landvetter Flygplats',
      descEn: 'Via highway or airport express coach from central hub',
      descSv: 'Via E6/riksväg 40 eller flygbuss från Centralen',
      time: '25 min',
      distance: '28 km',
    },
  ];

  return (
    <section className="mt-16 sm:mt-24 pt-12 border-t border-[#EDE7DC]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#BF8641] text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4" />
              <span>{lang === 'sv' ? 'Läge & Resvägar' : 'Location & Arrival'}</span>
            </div>
            <h2 className="font-brand-logo text-3xl sm:text-4xl text-[#02070D]">
              {lang === 'sv' ? 'Hitta till Hotel Nordic Gate' : 'Finding Hotel Nordic Gate'}
            </h2>
            <p className="text-sm text-[#5D6B78] mt-2 max-w-2xl leading-relaxed">
              {lang === 'sv'
                ? 'Beläget på Gamla Tingstadsgatan 1 i Hisings Backa, strax norr om centrala Göteborg. Perfekt för både nöjesresor och affärsvistelser med omedelbar närhet till bussar och E6.'
                : 'Located at Gamla Tingstadsgatan 1 in Hisings Backa, just north of central Gothenburg. Conveniently positioned for both leisure retreats and business travel with immediate transit and motorway connections.'}
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Hotel+Nordic+Gate+Gamla+Tingstadsgatan+1+Goteborg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0D1A26] text-white hover:bg-[#BF8641] text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            <Navigation className="w-4 h-4 text-[#F2C777]" />
            <span>{lang === 'sv' ? 'Vägbeskrivning i Google Maps' : 'Get Directions in Google Maps'}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Visual Map & Transit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Styled Gothenburg Map Card (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#D3C8B9] bg-stone-100 flex flex-col justify-between relative shadow-sm min-h-[380px]">
            {/* Visual map preview canvas background */}
            <div className="absolute inset-0 bg-[#EDE7DC]/60 bg-[radial-gradient(#D3C8B9_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

            {/* Stylized Map Header */}
            <div className="relative z-10 p-6 bg-gradient-to-b from-[#0D1A26]/90 via-[#0D1A26]/60 to-transparent text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#F2C777]">
                    Göteborg · Lat: {address.coordinates?.lat ?? 57.7312} · Lng: {address.coordinates?.lng ?? 11.9845}
                  </span>
                  <h3 className="font-brand-logo text-xl text-white mt-0.5">
                    Gamla Tingstadsgatan 1
                  </h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-semibold text-white">
                  Hisings Backa
                </div>
              </div>
            </div>

            {/* Center Pin Callout */}
            <div className="relative z-10 flex flex-col items-center justify-center p-8 my-auto">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-12 h-12 rounded-full bg-[#BF8641]/30 animate-ping" />
                <div className="w-12 h-12 rounded-full bg-[#BF8641] text-white flex items-center justify-center shadow-xl border-2 border-white">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#EDE7DC] shadow-lg text-center max-w-sm">
                <p className="text-xs font-bold text-[#0D1A26]">
                  Hotel Nordic Gate
                </p>
                <p className="text-[11px] text-[#5D6B78] mt-0.5">
                  Gamla Tingstadsgatan 1, 402 76 Göteborg
                </p>
                <p className="text-[10px] text-[#BF8641] font-medium mt-1">
                  {lang === 'sv' ? 'Hållplats Balladgatan 20 m från entrén' : 'Balladgatan stop 20 meters from entrance'}
                </p>
              </div>
            </div>

            {/* Map Card Footer Bar */}
            <div className="relative z-10 p-4 bg-white/95 backdrop-blur-xs border-t border-[#EDE7DC] flex flex-wrap items-center justify-between gap-3 text-xs text-[#25303A]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <Bus className="w-4 h-4 text-[#BF8641]" />
                  {lang === 'sv' ? 'Buss 40 direkt till Centralen' : 'Bus 40 direct to Central Station'}
                </span>
                <span className="hidden sm:inline-block text-stone-300">·</span>
                <span className="hidden sm:flex items-center gap-1.5 font-medium">
                  <Car className="w-4 h-4 text-[#BF8641]" />
                  {lang === 'sv' ? 'Gästparkering & elbilsladdning' : 'Guest parking & EV charging'}
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=Hotel+Nordic+Gate+Gamla+Tingstadsgatan+1+Goteborg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#BF8641] hover:text-[#0D1A26] font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>{lang === 'sv' ? 'Öppna satellit & karta' : 'Satellite view & route'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Transport Options & Distances (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#02070D] mb-1">
                {lang === 'sv' ? 'Restider från hotellet' : 'Travel Times From Hotel'}
              </h4>

              {destinations.map((dest) => (
                <div
                  key={dest.titleEn}
                  className="p-3.5 rounded-xl bg-white border border-[#EDE7DC] hover:border-[#BF8641]/50 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-[#0D1A26] truncate">
                      {lang === 'sv' ? dest.titleSv : dest.titleEn}
                    </p>
                    <p className="text-[11px] text-[#5D6B78] mt-0.5 leading-snug truncate">
                      {lang === 'sv' ? dest.descSv : dest.descEn}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#F8F5EF] text-[#0D1A26] font-bold text-xs border border-[#EDE7DC]">
                      {dest.time}
                    </span>
                    <span className="block text-[10px] text-stone-400 mt-0.5">
                      {dest.distance}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Practical Arrival Guide Card */}
            <div className="p-4 rounded-xl bg-[#0D1A26]/5 border border-[#EDE7DC] text-xs text-[#25303A] space-y-2 mt-2">
              <div className="flex items-center gap-1.5 font-bold text-[#0D1A26]">
                <Sparkles className="w-3.5 h-3.5 text-[#BF8641]" />
                <span>{lang === 'sv' ? 'Praktiskt inför ankomst' : 'Practical Arrival Information'}</span>
              </div>
              <p className="text-[#5D6B78] leading-relaxed">
                {lang === 'sv'
                  ? 'Kör du bil? Följ E6 mot Göteborg och tag avfart 79 mot Tingstad/Hisings Backa. Fri utomhusparkering för gäster samt låsbart varmgarage (begränsat antal platser, förbokas).'
                  : 'Arriving by car? Take Exit 79 on motorway E6 towards Tingstad/Hisings Backa. Complimentary outdoor guest parking is available, along with secure heated garage bays.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
