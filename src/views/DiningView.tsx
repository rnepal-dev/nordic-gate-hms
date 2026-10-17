import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { HOTEL_IMAGES } from '../data/hotelData.ts';
import { 
  Coffee, 
  Clock, 
  Check, 
  ArrowRight, 
  UtensilsCrossed, 
  Wine, 
  Sparkles, 
  ShieldCheck, 
  Calendar,
  Users
} from 'lucide-react';

export const DiningView: React.FC = () => {
  const { lang, navigate } = useHotel();
  const [tableDate, setTableDate] = useState('2026-10-24');
  const [tableTime, setTableTime] = useState('19:00');
  const [guestsCount, setGuestsCount] = useState(2);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const dinnerDishes = [
    {
      nameSv: 'Klassiska Svenska Köttbullar',
      nameEn: 'Traditional Swedish Meatballs',
      descSv: 'Klassiska köttbullar med rårörda lingon, pressgurka, gräddsås och krämig potatispuré.',
      descEn: 'Swedish meatballs served with lingonberries, pickled cucumber, cream sauce, and mashed potatoes.',
      price: '195 kr',
      badgeSv: 'Klassiker',
      badgeEn: 'Classic',
    },
    {
      nameSv: 'Ugnsbakad Laxfilé från Västkusten',
      nameEn: 'Oven-Baked West Coast Salmon',
      descSv: 'Serveras med dillslungad potatis, hollandaisesås och krispiga gröna primörer.',
      descEn: 'Served with dill-tossed potatoes, warm hollandaise, and crisp market greens.',
      price: '245 kr',
      badgeSv: 'Fisk & Skaldjur',
      badgeEn: 'Seafood',
    },
    {
      nameSv: 'Nordic Gate Högrevsburgare (200g)',
      nameEn: 'Nordic Gate Prime Chuck Burger',
      descSv: 'Svensk högrev med lagrad Västerbottensost, karamelliserad lök, rökt majonnäs och krispiga pommes.',
      descEn: 'Swedish prime beef with aged Västerbottensost, caramelized onion, smoked aioli, and skin-on fries.',
      price: '215 kr',
      badgeSv: 'Populär',
      badgeEn: 'Popular',
    },
    {
      nameSv: 'Krämig Kantarell- & Svamppasta',
      nameEn: 'Creamy Chanterelle & Wild Mushroom Pasta',
      descSv: 'Färsk tagliatelle, stekta kantareller, vitlök, vitvinsås, riven parmesan och färsk timjan.',
      descEn: 'Fresh tagliatelle with pan-seared chanterelles, white wine cream, parmesan, and fresh thyme.',
      price: '195 kr',
      badgeSv: 'Vegetarisk',
      badgeEn: 'Vegetarian',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-20 pb-16">
      
      {/* 1. LUXURY HERO BANNER */}
      <section className="bg-[#0D1A26] text-[#F8F5EF] pt-14 pb-16 px-6 border-b border-[#BF8641]/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#F2C777] font-semibold">
              <Coffee className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Frukost, Restaurang & Bar' : 'Breakfast, Restaurant & Bar'}</span>
              <span aria-hidden="true" className="text-white/30">·</span>
              <span>Göteborg</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F8F5EF] tracking-wide leading-tight">
              {lang === 'sv' ? 'Skandinavisk Frukostbuffé & Kvällsbistro' : 'Scandinavian Breakfast Buffet & Bistro'}
            </h1>
            <p className="text-sm sm:text-base text-[#EDE7DC]/90 leading-relaxed font-light">
              {lang === 'sv'
                ? 'Njut av en generös ekologisk frukostbuffé varje morgon och välsmakande middagar i vår trivsamma hotellrestaurang. I loungebaren väntar svalkande drycker och lokala hantverksöl från Göteborg i en avslappnad atmosfär.'
                : 'Enjoy a rich organic breakfast buffet every morning and satisfying evening meals in our welcoming hotel restaurant. Relax with refreshing beverages and local craft beers in the lounge bar.'}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#D3C8B9]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Frukost: Vardagar 06:30–09:30, Helger 07:00–10:30' : 'Breakfast: Mon–Fri 06:30–09:30, Weekends 07:00–10:30'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Middag: Mån–Lör 17:30–22:00' : 'Dinner: Mon–Sat 17:30–22:00'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src={HOTEL_IMAGES.diningRestaurant}
                alt="Hotel Nordic Gate frukost och restaurang"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. BREAKFAST SECTION (Warm Sand #EDE7DC Surface) */}
      <section className="bg-[#EDE7DC] py-16 border-y border-[#D3C8B9]">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
              {lang === 'sv' ? 'Ingår alltid för samtliga hotellgäster' : 'Always Included with Your Room'}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#02070D]">
              {lang === 'sv' ? 'Den Skandinaviska Ekologiska Frukostbuffén' : 'Scandinavian Organic Breakfast Buffet'}
            </h2>
            <p className="text-sm text-[#25303A] leading-relaxed">
              {lang === 'sv'
                ? 'Starta dagen på bästa sätt. Vår frukostbuffé bjuder på ett rikt urval av hälsosamma, ekologiska och närproducerade råvaror.'
                : 'Start your morning with our generous Scandinavian breakfast spread featuring fresh, organic, and wholesome options.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#25303A]">
            <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-[#02070D]">
                {lang === 'sv' ? 'Bageri & Pålägg' : 'Bakery & Deli'}
              </h3>
              <p className="leading-relaxed text-[#25303A]">
                {lang === 'sv'
                  ? 'Nybakat surdegsbröd, frallor, klassiskt knäckebröd, ekologiskt smör, svenska ostar, skinka, kalkon och hemlagade fruktmarmelader.'
                  : 'Freshly baked sourdough breads, rolls, traditional crispbreads, cheeses, sliced cold cuts, and seasonal fruit preserves.'}
              </p>
            </div>

            <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-[#02070D]">
                {lang === 'sv' ? 'Varma Klassiker' : 'Hot Breakfast Favourites'}
              </h3>
              <p className="leading-relaxed text-[#25303A]">
                {lang === 'sv'
                  ? 'Krämig äggröra från frigående höns, krispigt stekt bacon, små goda frukostkorvar, bönor och varm havregrynsgröt.'
                  : 'Creamy free-range scrambled eggs, crispy bacon, breakfast sausages, baked beans, and warm rolled oats porridge.'}
              </p>
            </div>

            <div className="p-6 bg-[#F8F5EF] rounded-2xl border border-[#D3C8B9] space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-[#02070D]">
                {lang === 'sv' ? 'Specialkost & Allergiutbud' : 'Special Dietary Corner'}
              </h3>
              <p className="leading-relaxed text-[#25303A]">
                {lang === 'sv'
                  ? 'Egen separat avdelning med glutenfritt bröd och flingor, laktosfria mejeriprodukter, samt växtbaserad havre- och sojadryck.'
                  : 'Dedicated section with gluten-free breads, lactose-free milk & yogurts, and plant-based vegan alternatives.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENING BISTRO MENU (Warm Ivory #F8F5EF with refined cards) */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#EDE7DC]">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-[#BF8641] font-semibold">
              {lang === 'sv' ? 'Kvällsmeny i Bistron' : 'Evening Bistro Menu'}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl text-[#02070D]">
              {lang === 'sv' ? 'Vällagat, enkelt och genuint gott' : 'Swedish Classics & European Favourites'}
            </h2>
            <p className="text-sm text-[#25303A]">
              {lang === 'sv'
                ? 'Koppla av i restaurangen efter en händelserik dag i Göteborg med väl valda råvaror och drycker.'
                : 'Relax in our restaurant after your day with satisfying flavours, craft beers, and good company.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#02070D] bg-[#EDE7DC] px-4 py-2 rounded-xl border border-[#D3C8B9]">
            <Clock className="w-4 h-4 text-[#BF8641]" />
            <span>Mån–Lör 17:30 – 22:00</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dinnerDishes.map((dish, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#EDE7DC] space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-xl font-bold text-[#02070D]">
                    {lang === 'sv' ? dish.nameSv : dish.nameEn}
                  </h3>
                  <span className="px-3 py-1 rounded-md text-[11px] font-semibold bg-[#EDE7DC] text-[#02070D] border border-[#D3C8B9] shrink-0">
                    {lang === 'sv' ? dish.badgeSv : dish.badgeEn}
                  </span>
                </div>
                <p className="text-xs text-[#25303A] mt-2 leading-relaxed">
                  {lang === 'sv' ? dish.descSv : dish.descEn}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EDE7DC] flex items-center justify-between mt-2">
                <span className="font-serif text-2xl font-bold text-[#02070D] tabular-nums">
                  {dish.price}
                </span>
                <span className="text-xs text-[#25303A]/70 font-medium">
                  {lang === 'sv' ? 'Inkl. 12% moms' : 'Incl. 12% VAT'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TABLE RESERVATION FORM (Deep Navy #0D1A26 Section) */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 lg:p-12 rounded-2xl shadow-xl space-y-8 border border-[#BF8641]/30">
          <div className="space-y-2 text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2C777]">
              {lang === 'sv' ? 'Bordsbokning i Restaurangen' : 'Restaurant Table Reservation'}
            </span>
            <h3 className="font-serif text-3xl lg:text-4xl text-[#F8F5EF]">
              {lang === 'sv' ? 'Boka bord för middag' : 'Reserve a Table for Dinner'}
            </h3>
            <p className="text-xs sm:text-sm text-[#D3C8B9]">
              {lang === 'sv'
                ? 'Säkra ditt bord inför kvällen. Både hotellgäster och externa besökare är varmt välkomna.'
                : 'Secure your evening table. Hotel guests and outside visitors are warmly welcome.'}
            </p>
          </div>

          {bookingConfirmed ? (
            <div className="p-8 bg-white/10 rounded-2xl text-center space-y-4 border border-[#F2C777]/40">
              <div className="w-12 h-12 rounded-full bg-[#BF8641] text-white flex items-center justify-center mx-auto shadow-md">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-2xl text-[#F8F5EF]">
                {lang === 'sv' ? 'Tack! Din bordsbokning är bekräftad' : 'Thank you! Table reservation confirmed'}
              </h4>
              <p className="text-xs sm:text-sm text-[#D3C8B9] max-w-md mx-auto">
                {lang === 'sv'
                  ? `Bord reserverat för ${guestsCount} gäster den ${tableDate} kl. ${tableTime}. Vi ser fram emot ditt besök!`
                  : `Table reserved for ${guestsCount} guests on ${tableDate} at ${tableTime}. We look forward to welcoming you!`}
              </p>
              <button
                onClick={() => setBookingConfirmed(false)}
                className="text-xs font-semibold text-[#F2C777] hover:underline mt-2 cursor-pointer inline-block"
              >
                {lang === 'sv' ? 'Gör en ny bordsbokning' : 'Make another reservation'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleTableSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D3C8B9] mb-1.5 font-bold">
                    {lang === 'sv' ? 'Datum' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={tableDate}
                    onChange={(e) => setTableDate(e.target.value)}
                    className="w-full bg-[#02070D] border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EF] focus:outline-none focus:border-[#F2C777] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D3C8B9] mb-1.5 font-bold">
                    {lang === 'sv' ? 'Tid' : 'Time'}
                  </label>
                  <select
                    value={tableTime}
                    onChange={(e) => setTableTime(e.target.value)}
                    className="w-full bg-[#02070D] border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EF] focus:outline-none focus:border-[#F2C777] cursor-pointer"
                  >
                    <option value="17:30">17:30</option>
                    <option value="18:00">18:00</option>
                    <option value="18:30">18:30</option>
                    <option value="19:00">19:00</option>
                    <option value="19:30">19:30</option>
                    <option value="20:00">20:00</option>
                    <option value="20:30">20:30</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D3C8B9] mb-1.5 font-bold">
                    {lang === 'sv' ? 'Antal gäster' : 'Guests'}
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-[#02070D] border border-white/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EF] focus:outline-none focus:border-[#F2C777] cursor-pointer"
                  >
                    <option value={1}>1 {lang === 'sv' ? 'person' : 'guest'}</option>
                    <option value={2}>2 {lang === 'sv' ? 'personer' : 'guests'}</option>
                    <option value={3}>3 {lang === 'sv' ? 'personer' : 'guests'}</option>
                    <option value={4}>4 {lang === 'sv' ? 'personer' : 'guests'}</option>
                    <option value={5}>5 {lang === 'sv' ? 'personer' : 'guests'}</option>
                    <option value={6}>6+ {lang === 'sv' ? 'personer' : 'guests'}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs lg:text-sm font-bold rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span>{lang === 'sv' ? 'Bekräfta Bordsbokning' : 'Confirm Table Reservation'}</span>
                <ArrowRight className="w-4 h-4 text-[#F2C777]" />
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
