import React from 'react';
import type { RoomCategory } from '../../types/hotel.ts';
import { useHotel } from '../../context/HotelContext.tsx';
import { formatSEK } from '../../lib/pricing.ts';
import { Maximize2, Users, Bed, Eye, ArrowRight, Check } from 'lucide-react';

interface RoomCardProps {
  room: RoomCategory;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const { lang, navigate, comparisonRoomIds, toggleCompareRoom } = useHotel();

  const isCompared = comparisonRoomIds.includes(room.id);

  return (
    <article className="group bg-white rounded-lg border border-[#EDE7DC] overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col justify-between">
      <div>
        {/* Room Image Container */}
        <div className="relative aspect-[16/10] bg-[#0D1A26] overflow-hidden">
          <img
            src={room.image}
            alt={lang === 'sv' ? room.nameSv : room.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              // fallback gradient container if image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Compare badge button */}
          <div className="absolute top-3 right-3 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCompareRoom(room.id);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded shadow-sm backdrop-blur-md transition-colors cursor-pointer ${
                isCompared
                  ? 'bg-[#BF8641] text-white font-semibold'
                  : 'bg-white/80 hover:bg-white text-slate-800'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isCompared ? (lang === 'sv' ? 'Vald för jämförelse' : 'Comparing') : (lang === 'sv' ? 'Jämför' : 'Compare')}</span>
            </button>
          </div>

          {/* Starting Price in Image overlay */}
          <div className="absolute bottom-3 left-4 text-white">
            <p className="text-[11px] uppercase tracking-wider text-[#F2C777]">
              {lang === 'sv' ? 'Frånpris per natt' : 'From per night'}
            </p>
            <p className="font-serif text-2xl font-bold tracking-tight text-[#F8F5EF] tabular-nums">
              {formatSEK(room.startingPriceSEK, lang)}
            </p>
          </div>
        </div>

        {/* Room Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-serif text-xl lg:text-2xl text-[#02070D] tracking-wide">
                {lang === 'sv' ? room.nameSv : room.name}
              </h3>
              <p className="text-xs text-[#BF8641] font-medium tracking-wide mt-0.5">
                {lang === 'sv' ? room.taglineSv : room.tagline}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 my-3 leading-relaxed">
            {lang === 'sv' ? room.descriptionSv : room.description}
          </p>

          {/* Specifications (Unboxed metadata with typographic separators) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 py-3 border-y border-[#EDE7DC] my-4">
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#BF8641]" />
              <span>{room.dimensionsM2} m²</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#BF8641]" />
              <span>Max {room.maxGuests} {lang === 'sv' ? 'gäster' : 'guests'}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-[#BF8641]" />
              <span>{lang === 'sv' ? room.bedTypeSv : room.bedType}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#BF8641]" />
              <span>{lang === 'sv' ? room.viewSv : room.view}</span>
            </span>
          </div>

          {/* Key Amenities preview */}
          <div className="space-y-1 mb-2">
            {room.amenities.slice(0, 3).map((amenity) => (
              <div key={amenity.key} className="flex items-center gap-2 text-xs text-slate-700">
                <span className="w-1 h-1 rounded-full bg-[#BF8641]" />
                <span>{lang === 'sv' ? amenity.labelSv : amenity.labelEn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-6 pb-6 pt-2 flex items-center gap-3">
        <button
          onClick={() => navigate(`/rooms/${room.slug}`)}
          className="flex-1 py-2.5 px-3 border border-[#0D1A26] text-[#0D1A26] hover:bg-[#0D1A26] hover:text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors text-center cursor-pointer"
        >
          {lang === 'sv' ? 'Se Detaljer' : 'View Details'}
        </button>
        <button
          onClick={() => navigate('/booking', { categoryId: room.id })}
          className="flex-1 py-2.5 px-3 bg-[#BF8641] hover:bg-[#8C5F27] text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{lang === 'sv' ? 'Boka Svit' : 'Book Now'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
