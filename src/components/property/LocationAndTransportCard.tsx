import React from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import type { TransportDetail } from '../../types/property.ts';
import { MapPin, Bus, Car, Plane, Compass, Navigation, ArrowRight } from 'lucide-react';

interface LocationAndTransportCardProps {
  address: {
    street: string;
    postalCode: string;
    city: string;
    district: string;
  };
  transports: TransportDetail[];
  attractions: {
    nameEn: string;
    nameSv: string;
    distanceKm: number;
    descriptionEn: string;
    descriptionSv: string;
  }[];
}

export const LocationAndTransportCard: React.FC<LocationAndTransportCardProps> = ({
  address,
  transports,
  attractions,
}) => {
  const { lang, navigate } = useHotel();

  return (
    <div className="bg-white rounded-2xl border border-[#EDE7DC] p-6 lg:p-8 shadow-sm space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE7DC]">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
            {lang === 'sv' ? 'Läge & Kommunikationer' : 'Location & Connectivity'}
          </span>
          <h3 className="font-serif text-2xl lg:text-3xl text-[#02070D] mt-1 font-bold">
            {lang === 'sv' ? 'Hitta till Hotel Nordic Gate' : 'Getting to Hotel Nordic Gate'}
          </h3>
        </div>

        <div className="flex items-center gap-2.5 text-xs bg-[#EDE7DC] px-4 py-2.5 rounded-xl border border-[#D3C8B9] text-[#02070D] font-bold self-start sm:self-auto">
          <MapPin className="w-4 h-4 text-[#BF8641] shrink-0" />
          <span>{address.street}, {address.postalCode} {address.city}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 6 cols: Transit Connections */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="font-serif text-xl font-bold text-[#02070D]">
            {lang === 'sv' ? 'Resvägar och kollektivtrafik' : 'Transit & Directions'}
          </h4>

          <div className="space-y-3">
            {transports.map((t, idx) => (
              <div key={idx} className="p-4 bg-[#F8F5EF] rounded-xl border border-[#EDE7DC] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-[#02070D] text-sm">
                    {idx === 0 && <Bus className="w-4 h-4 text-[#BF8641]" />}
                    {idx === 1 && <Car className="w-4 h-4 text-[#BF8641]" />}
                    {idx === 2 && <Plane className="w-4 h-4 text-[#BF8641]" />}
                    <span>{lang === 'sv' ? t.modeSv : t.modeEn}</span>
                  </div>
                  {t.estimatedTime && (
                    <span className="font-mono text-[11px] font-bold text-[#BF8641] bg-white px-2.5 py-0.5 rounded-md border border-[#D3C8B9]">
                      {t.estimatedTime}
                    </span>
                  )}
                </div>
                <p className="text-[#25303A] leading-relaxed">
                  {lang === 'sv' ? t.descriptionSv : t.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 cols: Nearby Landmarks & Map preview */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="font-serif text-xl font-bold text-[#02070D]">
            {lang === 'sv' ? 'Avstånd till sevärdheter i Göteborg' : 'Nearby Attractions & Distances'}
          </h4>

          <div className="divide-y divide-[#EDE7DC] text-xs bg-[#F8F5EF] p-4 rounded-xl border border-[#EDE7DC]">
            {attractions.map((att, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#02070D] text-sm">
                    {lang === 'sv' ? att.nameSv : att.nameEn}
                  </p>
                  <p className="text-[11px] text-[#25303A]/70">
                    {lang === 'sv' ? att.descriptionSv : att.descriptionEn}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#BF8641] bg-white px-2 py-0.5 rounded border border-[#D3C8B9] tabular-nums shrink-0 ml-4">
                  {att.distanceKm} km
                </span>
              </div>
            ))}
          </div>

          {/* Location Summary Note (Deep Navy #0D1A26) */}
          <div className="p-4 bg-[#0D1A26] text-white rounded-xl flex items-center justify-between text-xs border border-[#BF8641]/30">
            <div className="space-y-0.5">
              <span className="text-[#F2C777] font-bold block">Hållplats Balladgatan</span>
              <span className="text-[#D3C8B9]">Direktbuss till Göteborgs Centralstation var 10:e minut</span>
            </div>
            <button
              onClick={() => navigate('/booking')}
              className="px-4 py-2 bg-[#BF8641] hover:bg-[#8C5F27] text-white rounded-lg font-bold text-xs whitespace-nowrap cursor-pointer transition-colors shadow-sm"
            >
              Boka rum
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
