import React from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { Calendar, ArrowRight, ShieldCheck, Home, BedDouble } from 'lucide-react';

export const LegacyBookingNoticeView: React.FC = () => {
  const { lang, navigate } = useHotel();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16 bg-[#F8F5EF]">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-[#EDE7DC] p-8 lg:p-10 shadow-xl text-center space-y-6">
        
        <div className="w-14 h-14 rounded-2xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center mx-auto shadow-md">
          <Calendar className="w-7 h-7 text-[#F2C777]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#BF8641] font-bold block">
            {lang === 'sv' ? 'Officiell Uppdatering' : 'Official Update'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#02070D]">
            {lang === 'sv' ? 'Ny Bokningssida' : 'New Booking Experience'}
          </h1>
          <p className="text-sm text-[#25303A] leading-relaxed">
            {lang === 'sv'
              ? 'Vi har övergått till vår officiella centrala hotellbokningsmotor på /book. Vänligen fortsätt dit för aktuell rumsbokning och garanterat bästa pris.'
              : 'Our guest reservation system has transitioned to our official central booking engine at /book. Please proceed there for current room availability and best direct rates.'}
          </p>
        </div>

        <div className="p-4 bg-[#EDE7DC] rounded-xl border border-[#D3C8B9] text-xs text-[#25303A] space-y-2">
          <div className="flex items-center justify-center gap-2 font-semibold text-[#02070D]">
            <ShieldCheck className="w-4 h-4 text-[#BF8641]" />
            <span>{lang === 'sv' ? 'Direktbokningsförmåner' : 'Direct Booking Benefits'}</span>
          </div>
          <p className="text-[11px] text-[#5D6B78]">
            {lang === 'sv'
              ? 'Ekologisk frukostbuffé och fri tillgång till uppvärmd inomhuspool & bastu ingår alltid.'
              : 'Organic breakfast buffet and access to our heated indoor pool & sauna are always included.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/book')}
            className="flex-1 py-3.5 px-6 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{lang === 'sv' ? 'Till Nya Bokningen' : 'Proceed to Booking'}</span>
            <ArrowRight className="w-4 h-4 text-[#F2C777]" />
          </button>

          <button
            onClick={() => navigate('/rooms')}
            className="flex-1 py-3.5 px-6 border border-[#D3C8B9] hover:border-[#BF8641] text-[#02070D] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer bg-white flex items-center justify-center gap-2"
          >
            <BedDouble className="w-4 h-4 text-[#BF8641]" />
            <span>{lang === 'sv' ? 'Se Alla Rum' : 'View All Rooms'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
