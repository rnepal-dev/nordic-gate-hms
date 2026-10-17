import React from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { formatSEK } from '../../lib/pricing.ts';
import { X, Check, ArrowRight } from 'lucide-react';

interface RoomComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomComparisonModal: React.FC<RoomComparisonModalProps> = ({ isOpen, onClose }) => {
  const { lang, comparisonRoomIds, roomCategories, clearComparison, navigate } = useHotel();

  if (!isOpen || comparisonRoomIds.length === 0) return null;

  const comparedRooms = roomCategories.filter(r => comparisonRoomIds.includes(r.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F8F5EF] text-[#25303A] w-full max-w-5xl rounded-xl border border-[#EDE7DC] shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0D1A26] text-[#F8F5EF] border-b border-white/10">
          <div>
            <h3 className="font-serif text-xl tracking-wide text-[#F8F5EF]">
              {lang === 'sv' ? 'Jämför Rum & Sviter' : 'Compare Rooms & Suites'}
            </h3>
            <p className="text-xs text-[#D3C8B9]">
              {lang === 'sv' 
                ? `Visar ${comparedRooms.length} utvalda rumskategorier sida vid sida` 
                : `Comparing ${comparedRooms.length} selected room categories side-by-side`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearComparison}
              className="text-xs text-[#D3C8B9] hover:text-[#F2C777] underline cursor-pointer"
            >
              {lang === 'sv' ? 'Rensa urval' : 'Clear all'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded hover:bg-white/10 cursor-pointer"
              aria-label="Stäng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Table Header: Room cards */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `180px repeat(${comparedRooms.length}, minmax(180px, 1fr))` }}>
              <div className="flex flex-col justify-end pb-4 font-semibold text-xs uppercase tracking-wider text-slate-500">
                {lang === 'sv' ? 'Egenskaper' : 'Features'}
              </div>

              {comparedRooms.map((room) => (
                <div key={room.id} className="bg-white p-4 rounded-lg border border-[#EDE7DC] flex flex-col justify-between">
                  <div className="aspect-[16/10] bg-slate-100 rounded overflow-hidden mb-3">
                    <img
                      src={room.image}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-serif text-lg text-slate-900 font-semibold mb-1">
                    {lang === 'sv' ? room.nameSv : room.name}
                  </h4>
                  <p className="text-xs text-[#BF8641] font-medium mb-3">
                    {lang === 'sv' ? 'Från ' : 'From '}
                    <span className="font-bold text-sm tabular-nums text-slate-900">
                      {formatSEK(room.startingPriceSEK, lang)}
                    </span>
                    <span className="text-[10px] text-slate-500"> / {lang === 'sv' ? 'natt' : 'night'}</span>
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/booking', { categoryId: room.id });
                    }}
                    className="w-full py-2 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>{lang === 'sv' ? 'Välj Svit' : 'Select'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Spec rows */}
            <div className="divide-y divide-neutral-200 mt-6 text-sm">
              {/* Dimensions */}
              <div className="grid gap-4 py-3" style={{ gridTemplateColumns: `180px repeat(${comparedRooms.length}, minmax(180px, 1fr))` }}>
                <span className="font-medium text-xs text-slate-500 uppercase tracking-wider">
                  {lang === 'sv' ? 'Rumsyta' : 'Dimensions'}
                </span>
                {comparedRooms.map((r) => (
                  <span key={r.id} className="font-medium text-slate-800 tabular-nums">
                    {r.dimensionsM2} m²
                  </span>
                ))}
              </div>

              {/* Max Capacity */}
              <div className="grid gap-4 py-3" style={{ gridTemplateColumns: `180px repeat(${comparedRooms.length}, minmax(180px, 1fr))` }}>
                <span className="font-medium text-xs text-slate-500 uppercase tracking-wider">
                  {lang === 'sv' ? 'Max gäster' : 'Max Guests'}
                </span>
                {comparedRooms.map((r) => (
                  <span key={r.id} className="text-slate-800">
                    {r.maxGuests} {lang === 'sv' ? (r.maxGuests > 1 ? 'personer' : 'person') : 'guests'}
                  </span>
                ))}
              </div>

              {/* Bed Type */}
              <div className="grid gap-4 py-3" style={{ gridTemplateColumns: `180px repeat(${comparedRooms.length}, minmax(180px, 1fr))` }}>
                <span className="font-medium text-xs text-slate-500 uppercase tracking-wider">
                  {lang === 'sv' ? 'Sängtyp' : 'Bedding'}
                </span>
                {comparedRooms.map((r) => (
                  <span key={r.id} className="text-slate-800 text-xs">
                    {lang === 'sv' ? r.bedTypeSv : r.bedType}
                  </span>
                ))}
              </div>

              {/* View */}
              <div className="grid gap-4 py-3" style={{ gridTemplateColumns: `180px repeat(${comparedRooms.length}, minmax(180px, 1fr))` }}>
                <span className="font-medium text-xs text-slate-500 uppercase tracking-wider">
                  {lang === 'sv' ? 'Utsikt' : 'View'}
                </span>
                {comparedRooms.map((r) => (
                  <span key={r.id} className="text-slate-800 text-xs">
                    {lang === 'sv' ? r.viewSv : r.view}
                  </span>
                ))}
              </div>

              {/* Floor */}
              <div className="grid gap-4 py-3" style={{ gridTemplateColumns: `180px repeat(${comparedRooms.length}, minmax(180px, 1fr))` }}>
                <span className="font-medium text-xs text-slate-500 uppercase tracking-wider">
                  {lang === 'sv' ? 'Våning' : 'Floor'}
                </span>
                {comparedRooms.map((r) => (
                  <span key={r.id} className="text-slate-800 text-xs">
                    {r.floor}
                  </span>
                ))}
              </div>

              {/* Amenities */}
              <div className="grid gap-4 py-3" style={{ gridTemplateColumns: `180px repeat(${comparedRooms.length}, minmax(180px, 1fr))` }}>
                <span className="font-medium text-xs text-slate-500 uppercase tracking-wider">
                  {lang === 'sv' ? 'Utvalda detaljer' : 'Key Inclusions'}
                </span>
                {comparedRooms.map((r) => (
                  <div key={r.id} className="space-y-1.5">
                    {r.amenities.map((a) => (
                      <div key={a.key} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-[#BF8641] shrink-0 mt-0.5" />
                        <span>{lang === 'sv' ? a.labelSv : a.labelEn}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#EDE7DC] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {lang === 'sv' ? 'Stäng jämförelse' : 'Close Comparison'}
          </button>
        </div>

      </div>
    </div>
  );
};
