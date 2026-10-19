import React from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { 
  Users, 
  Droplets, 
  Coffee, 
  Baby, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Check, 
  HeartHandshake 
} from 'lucide-react';

export const FamilyFeaturesCard: React.FC = () => {
  const { lang, navigate } = useHotel();

  const familyPerks = [
    {
      icon: Users,
      titleEn: 'Dedicated Family Rooms (Up to 4 Guests)',
      titleSv: 'Rymliga Familjerum (Upp till 4 gäster)',
      descEn: 'Double bed plus sturdy bunk beds or pull-out sofa bed. Plenty of space for strollers and luggage.',
      descSv: 'Dubbelsäng plus fasta våningssängar eller bäddsoffa. Gott om utrymme för barnvagnar och packning.',
    },
    {
      icon: Droplets,
      titleEn: 'Heated Indoor Swimming Pool',
      titleSv: 'Uppvärmd Inomhuspool för Hela Familjen',
      descEn: 'Year-round comfortable water temperature (28–29°C) for relaxed morning and afternoon family swims.',
      descSv: 'Behaglig vattentemperatur (28–29°C) året om för morgon- och eftermiddagsbad för stora och små.',
    },
    {
      icon: Coffee,
      titleEn: 'Child-Friendly Breakfast Buffet',
      titleSv: 'Barnvänlig Frukostbuffé Ingår',
      descEn: 'Pancakes, waffles, organic yogurt, cereals, and fresh fruit. High chairs readily available.',
      descSv: 'Pannkakor, våfflor, ekologisk yoghurt, flingor, färsk frukt och barnstolar i frukostmatsalen.',
    },
    {
      icon: Baby,
      titleEn: 'Baby Cots & Infant Amenities',
      titleSv: 'Spjälsängar & Småbarnsservice',
      descEn: 'Cribs / baby cots available on advance notice for infants (0–2 years). In-room fridges for baby food.',
      descSv: 'Spjälsängar kan förbokas för spädbarn (0–2 år). Litet kylskåp i familjerummen för barnmat och välling.',
    },
    {
      icon: HeartHandshake,
      titleEn: 'Summer Play Corner & Games',
      titleSv: 'Lekhörna & Sommaraktiviteter',
      descEn: 'Activity corner with books, drawing materials, and board games during school vacation periods.',
      descSv: 'Lek- och rithörna med böcker och sällskapsspel i reception/lounge under lovperioder.',
    },
    {
      icon: MapPin,
      titleEn: 'Quick Access to Liseberg (5.6 km)',
      titleSv: 'Nära Liseberg & Universeum (5,6 km)',
      descEn: 'Only 10–12 minutes by car via E6 or convenient direct bus into central Gothenburg attractions.',
      descSv: 'Endast 10–12 minuter med bil via E6 eller smidig direktbuss till Nordens största nöjespark.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#EDE7DC] p-6 lg:p-10 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EDE7DC] pb-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
            <Users className="w-4 h-4 text-[#BF8641]" />
            <span>{lang === 'sv' ? 'Familjevänligt Hotell' : 'Family Travel & Comfort'}</span>
          </div>
          <h2 className="type-h2 text-2xl sm:text-3xl lg:text-4xl text-[#02070D]">
            {lang === 'sv' ? 'Bekvämt boende för hela familjen' : 'Comfortable stays designed for families'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {lang === 'sv'
              ? 'Vi gör familjeresan till Göteborg enkel och trivsam med funktionella familjerum, fri entré till uppvärmd inomhuspool, generös frukostbuffé och smidig parkering.'
              : 'Travelling with children should be seamless. Enjoy practical family room layouts, complimentary indoor pool access, rich breakfast buffet, and on-site parking.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/rooms')}
            className="px-5 py-2.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <span>{lang === 'sv' ? 'Se Familjerum' : 'View Family Room'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of perks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familyPerks.map((perk, idx) => {
          const Icon = perk.icon;
          return (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-[#F8F5EF] border border-[#EDE7DC] space-y-2.5 transition-all hover:bg-white hover:shadow-md"
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-[#EDE7DC] text-[#BF8641] flex items-center justify-center shadow-xs">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <h3 className="type-h3 text-base sm:text-lg font-semibold text-slate-900">
                {lang === 'sv' ? perk.titleSv : perk.titleEn}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'sv' ? perk.descSv : perk.descEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom info banner */}
      <div className="bg-[#0D1A26] text-[#F8F5EF] p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F2C777]">
            {lang === 'sv' ? 'Barnens Politik & Villkor' : 'Children Policy & Conditions'}
          </span>
          <p className="text-xs text-[#D3C8B9]">
            {lang === 'sv'
              ? 'Barn i alla åldrar är välkomna. Spjälsäng för spädbarn (0–2 år) kan ordnas kostnadsfritt efter föranmälan.'
              : 'Children of all ages are warmly welcome. Baby cots for infants (0–2 years) arranged on request.'}
          </p>
        </div>

        <button
          onClick={() => navigate('/faq')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#EDE7DC] text-xs font-semibold rounded uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
        >
          {lang === 'sv' ? 'Läs Hotellpolicy' : 'Read Policies'}
        </button>
      </div>
    </div>
  );
};
