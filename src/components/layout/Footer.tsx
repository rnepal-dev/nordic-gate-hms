import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { Mail, Phone, MapPin, Check, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, navigate, currentRoute } = useHotel();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (currentRoute.startsWith('/app')) {
    return null; // Dedicated HMS layout handles its own footer/status
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#02070D] text-[#EDE7DC] border-t border-[#0D1A26] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand & Address */}
          <div className="space-y-4">
            <h3 className="font-brand-logo text-2xl text-[#F8F5EF] tracking-wide">
              Hotel Nordic Gate
            </h3>
            <p className="text-xs tracking-[0.15em] uppercase text-[#F2C777]">
              Göteborg · Scandinavian Hospitality
            </p>
            <p className="text-sm text-[#D3C8B9] leading-relaxed">
              {lang === 'sv'
                ? 'Välkomnande skandinavisk hotellvistelse i Göteborg med uppvärmd inomhuspool, finsk bastu, ekologisk frukostbuffé och smidiga kommunikationer till stadens centrum.'
                : 'Welcoming Scandinavian hospitality in Gothenburg featuring an indoor heated pool, Finnish sauna, organic breakfast buffet, and quick transit to city center.'}
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#D3C8B9]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F2C777] shrink-0" />
                <span>Gamla Tingstadsgatan 1, 402 76 Göteborg</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F2C777] shrink-0" />
                <span>+46 (0)31 750 19 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F2C777] shrink-0" />
                <span>reception@nordicgate.se</span>
              </div>
            </div>
          </div>

          {/* Navigation Mirrors */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2C777] mb-4">
              {lang === 'sv' ? 'Utforska Hotellet' : 'Explore The Hotel'}
            </h4>
            <ul className="space-y-2.5 text-sm text-[#EDE7DC]/80">
              <li>
                <button
                  onClick={() => navigate('/rooms')}
                  className="hover:text-[#F2C777] transition-colors cursor-pointer"
                >
                  {lang === 'sv' ? 'Rum & Kategorier' : 'Rooms & Categories'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:text-[#F2C777] transition-colors cursor-pointer"
                >
                  {lang === 'sv' ? 'Faciliteter & Regler' : 'Facilities & Policies'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/dining')}
                  className="hover:text-[#F2C777] transition-colors cursor-pointer"
                >
                  {lang === 'sv' ? 'Frukostbuffé & Restaurang' : 'Breakfast & Dining'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/spa')}
                  className="hover:text-[#F2C777] transition-colors cursor-pointer"
                >
                  {lang === 'sv' ? 'Inomhuspool & Bastu' : 'Indoor Pool & Sauna'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/guest')}
                  className="hover:text-[#F2C777] transition-colors cursor-pointer"
                >
                  {lang === 'sv' ? 'Mina Sidor (Gästportal)' : 'Guest Portal'}
                </button>
              </li>
            </ul>
          </div>

          {/* Gothenburg Context & Heritage */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2C777] mb-4">
              {lang === 'sv' ? 'Upplevelser & Kvarter' : 'Curated Experiences'}
            </h4>
            <ul className="space-y-2.5 text-sm text-[#EDE7DC]/80">
              <li className="flex items-center gap-1.5">
                <span className="text-[#BF8641]">·</span>
                <span>{lang === 'sv' ? 'Historiska Haga & Kaffehus' : 'Historic Haga & Fika Culture'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#BF8641]">·</span>
                <span>{lang === 'sv' ? 'Skärgårdstur med hotellets träbåt' : 'Hotel Archipelago Boat Tour'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#BF8641]">·</span>
                <span>{lang === 'sv' ? 'Göteborgs Konstmuseum & Opera' : 'Gothenburg Museum of Art'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#BF8641]">·</span>
                <span>{lang === 'sv' ? 'Klassisk svensk frukostbuffé' : 'Artisanal Swedish Breakfast'}</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => navigate('/app')}
                  className="text-xs text-[#BF8641] hover:text-[#F2C777] underline underline-offset-4 cursor-pointer"
                >
                  {lang === 'sv' ? 'Personalinloggning (HMS Dashboard)' : 'Staff Management Console (HMS)'}
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Gazette */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2C777]">
              {lang === 'sv' ? 'Hamnkvarterets Journal' : 'The Harbour Gazette'}
            </h4>
            <p className="text-xs text-[#D3C8B9] leading-relaxed">
              {lang === 'sv'
                ? 'Motta inbjudningar till säsongens gastronomi, nya sparitualer och exklusiva helger.'
                : 'Receive curated seasonal invitations for culinary tastings, spa retreats, and private stays.'}
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-white/5 border border-[#BF8641]/40 rounded text-xs text-[#F2C777]">
                <Check className="w-4 h-4 text-[#F2C777]" />
                <span>
                  {lang === 'sv'
                    ? 'Tack för din anmälan! Välkommen till Hotel Nordic Gate.'
                    : 'Thank you for subscribing to Hotel Nordic Gate.'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    placeholder={lang === 'sv' ? 'Din e-postadress' : 'Your email address'}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-l text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-[#F2C777]"
                  />
                  <button
                    type="submit"
                    className="bg-[#BF8641] hover:bg-[#8C5F27] text-white px-3 py-2 rounded-r transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Prenumerera"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-stone-400">
                  {lang === 'sv' ? 'Ingen skräppost. Avregistrera när som helst.' : 'No spam. Unsubscribe anytime.'}
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#D3C8B9]/70 gap-4">
          <p>
            © {new Date().getFullYear()} Hotel Nordic Gate · Gamla Tingstadsgatan 1, Göteborg
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-stone-400">
              {lang === 'sv' ? 'Milestone 1 — Real Property Content Integration' : 'Milestone 1 — Property Content Integration'}
            </span>
            <button onClick={() => navigate('/faq')} className="hover:text-white cursor-pointer underline">
              {lang === 'sv' ? 'Hotellregler & FAQ' : 'Policies & FAQ'}
            </button>
            <button onClick={() => navigate('/our-story')} className="hover:text-white cursor-pointer">
              {lang === 'sv' ? 'Om Hotellet' : 'About'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
