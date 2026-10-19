import React from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { HOTEL_IMAGES } from '../data/hotelData.ts';
import { 
  Droplets, 
  Sparkles, 
  Clock, 
  Check, 
  ArrowRight, 
  Waves, 
  Activity, 
  Compass, 
  ShieldCheck,
  MapPin,
  Coffee
} from 'lucide-react';

export const SpaView: React.FC = () => {
  const { lang, navigate } = useHotel();

  return (
    <div className="space-y-16 lg:space-y-20 pb-16">
      
      {/* 1. LUXURY HERO BANNER */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] pt-14 pb-16 px-6 border-b border-[#BF8641]/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
              <Droplets className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Inomhuspool & Relax' : 'Indoor Pool & Relaxation'}</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>Göteborg</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8F5EF] leading-tight">
              {lang === 'sv' ? 'Uppvärmd Inomhuspool, Bastu & Bubbelpool' : 'Heated Indoor Pool, Sauna & Hot Tub'}
            </h1>
            <p className="text-sm sm:text-base text-[#EDE7DC]/90 leading-relaxed font-light">
              {lang === 'sv'
                ? 'Koppla av i vår trivsamma relaxavdelning efter arbetsdagen eller stadsbesöket i Göteborg. Ta ett dopp i den uppvärmda inomhuspoolen, varva ner i den finska bastun eller sjunk ner i bubbelpoolen. Fri entré ingår alltid för alla boende gäster.'
                : 'Unwind in our peaceful wellness area after a full day in Gothenburg. Swim in the heated indoor pool, relax in the Finnish sauna, or soak in the hot tub. Complimentary access is included for all resident hotel guests.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#D3C8B9]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Öppet dagligen: 06:30 – 22:00' : 'Open daily: 06:30 – 22:00'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Alltid inkluderat i rumspriset' : 'Always included in your stay'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src={HOTEL_IMAGES.spaWellness}
                alt="Inomhuspool och relaxavdelning"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. THERMAL FACILITIES BREAKDOWN (Warm Sand #EDE7DC Surface) */}
      <section className="bg-[#EDE7DC] py-16 border-y border-[#D3C8B9]">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
              {lang === 'sv' ? 'Faciliteter i Relaxen' : 'Relaxation Amenities'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#02070D]">
              {lang === 'sv' ? 'Återhämtning för kropp och sinne' : 'Restorative Wellness Amenities'}
            </h2>
            <p className="text-sm text-[#25303A]">
              {lang === 'sv'
                ? 'Utformat för behaglig avkoppling, morgonsimning och familjestunder.'
                : 'Designed for daily relaxation, energizing morning laps, and family comfort.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-[#BF8641] block tabular-nums">28°C</span>
              <h3 className="text-lg sm:text-xl font-semibold text-[#02070D]">
                {lang === 'sv' ? 'Uppvärmd Inomhuspool' : 'Heated Indoor Pool'}
              </h3>
              <p className="text-xs text-[#25303A] leading-relaxed">
                {lang === 'sv'
                  ? 'Trivsam bassäng med behaglig badtemperatur året runt. Perfekt för såväl lugna simtag på morgonen som lek med barnen under eftermiddagen.'
                  : 'Comfortable indoor swimming pool maintained at pleasant year-round temperatures for morning laps and family swims.'}
              </p>
            </div>

            <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-[#BF8641] block tabular-nums">80°C</span>
              <h3 className="text-lg sm:text-xl font-semibold text-[#02070D]">
                {lang === 'sv' ? 'Finsk Torrbastu' : 'Finnish Dry Sauna'}
              </h3>
              <p className="text-xs text-[#25303A] leading-relaxed">
                {lang === 'sv'
                  ? 'Klassisk nordisk träbastu för skön muskelavslappning och värme. Fräscha duschar och omklädningsrum i direkt anslutning.'
                  : 'Traditional Nordic wooden sauna for muscle recovery, circulation, and quiet calm. Showers and lockers immediately adjacent.'}
              </p>
            </div>

            <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center">
                <Waves className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-[#BF8641] block tabular-nums">37°C</span>
              <h3 className="text-lg sm:text-xl font-semibold text-[#02070D]">
                {lang === 'sv' ? 'Bubbelpool / Jacuzzi' : 'Hydrotherapy Hot Tub'}
              </h3>
              <p className="text-xs text-[#25303A] leading-relaxed">
                {lang === 'sv'
                  ? 'Uppvärmd bubbelpool med rogivande massagestrålar. Slå dig ner och låt stressen rinna av i skön värme.'
                  : 'Heated hydrotherapy jacuzzi providing soothing gentle massage jets. Settle in and let fatigue dissolve.'}
              </p>
            </div>
          </div>

          {/* Fitness & Jogging within the container */}
          <div className="pt-8 border-t border-[#D3C8B9]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#BF8641]" />
                  <h4 className="text-lg sm:text-xl font-semibold text-[#02070D]">
                    {lang === 'sv' ? 'Partner-Gym (4 minuters promenad)' : 'Partner Fitness Gym (4 min walk)'}
                  </h4>
                </div>
                <p className="text-xs text-[#25303A] leading-relaxed">
                  {lang === 'sv'
                    ? 'För gäster som vill genomföra styrke- eller konditionspass samarbetar vi med ett modernt, fullutrustat gym endast 4 minuters promenad från hotellet. Fritt inträdeskort hämtas i receptionen.'
                    : 'For comprehensive strength training and cardio workouts, we collaborate with an external fitness centre located just a 4-minute walk away. Complimentary passes available at the front desk.'}
                </p>
              </div>

              <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#BF8641]" />
                  <h4 className="text-lg sm:text-xl font-semibold text-[#02070D]">
                    {lang === 'sv' ? 'Motionsspår & Löprundor i Närheten' : 'Local Jogging & Walking Trails'}
                  </h4>
                </div>
                <p className="text-xs text-[#25303A] leading-relaxed">
                  {lang === 'sv'
                    ? 'Utforska natursköna motionsspår och grönområden i Hisings Backa. Kartor med markerade 3 km och 5 km-slingor finns att hämta i receptionen.'
                    : 'Discover scenic local jogging paths and green spaces around Hisings Backa. Running route maps (3 km and 5 km) are available at reception.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. PRACTICAL ETIQUETTE & VISITING GUIDE (Deep Navy #0D1A26 Section) */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 lg:p-10 rounded-2xl border border-[#BF8641]/30 shadow-xl space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
              {lang === 'sv' ? 'Gästguide' : 'Guest Etiquette'}
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-[#F8F5EF]">
              {lang === 'sv' ? 'Bra att veta inför ditt besök i relaxen' : 'Good to Know for Your Visit'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#D3C8B9]">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <Check className="w-4 h-4 text-[#F2C777] shrink-0 mt-0.5" />
              <span>{lang === 'sv' ? 'Badkläder krävs i pool och bubbelpool' : 'Swimwear required in swimming pool and hot tub'}</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <Check className="w-4 h-4 text-[#F2C777] shrink-0 mt-0.5" />
              <span>{lang === 'sv' ? 'Handdukar medtages från hotellrummet eller lånas i receptionen' : 'Towels brought from guest room or requested at front desk'}</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <Check className="w-4 h-4 text-[#F2C777] shrink-0 mt-0.5" />
              <span>{lang === 'sv' ? 'Barn under 16 år badar i sällskap av vuxen' : 'Children under 16 must be accompanied by an adult'}</span>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <Check className="w-4 h-4 text-[#F2C777] shrink-0 mt-0.5" />
              <span>{lang === 'sv' ? 'Dusch före bad är obligatoriskt för allas trivsel och renhet' : 'Showering prior to entering pool and sauna is mandatory'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOOK ROOM CTA */}
      <section className="max-w-2xl mx-auto px-6 text-center space-y-4">
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#02070D]">
          {lang === 'sv' ? 'Upplev avkoppling på Hotel Nordic Gate' : 'Enjoy Complimentary Wellness Access'}
        </h3>
        <p className="text-sm text-[#25303A]">
          {lang === 'sv'
            ? 'Boka din vistelse direkt online — frukostbuffé och fri tillgång till relax ingår i samtliga rumsbokningar.'
            : 'Book your stay directly online — organic breakfast and wellness relaxation are included with all room reservations.'}
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/booking')}
            className="px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <span>{lang === 'sv' ? 'Boka Vistelse' : 'Reserve Room'}</span>
            <ArrowRight className="w-4 h-4 text-[#F2C777]" />
          </button>
        </div>
      </section>

    </div>
  );
};
