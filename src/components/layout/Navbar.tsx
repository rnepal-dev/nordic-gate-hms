import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { Menu, X, Calendar, User, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { lang, setLang, currentRoute, navigate } = useHotel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = currentRoute === '/';
  const isDashboard = currentRoute.startsWith('/app');

  // If in HMS dashboard, we render the HMS shell navbar instead
  if (isDashboard) {
    return null;
  }

  const navLinks = [
    { href: '/rooms', labelSv: 'Rum & Kategorier', labelEn: 'Rooms & Categories' },
    { href: '/faq', labelSv: 'Faciliteter & Info', labelEn: 'Facilities & Info' },
    { href: '/dining', labelSv: 'Frukost & Restaurang', labelEn: 'Breakfast & Dining' },
    { href: '/spa', labelSv: 'Pool & Bastu', labelEn: 'Pool & Sauna' },
    { href: '/our-story', labelSv: 'Om Hotellet', labelEn: 'About Hotel' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    navigate(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200 border-b border-[#0D1A26]/10 bg-[#0D1A26]/95 backdrop-blur-md text-[#F8F5EF]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark in Display Serif */}
        <button
          onClick={() => handleNavClick('/')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C777]"
        >
          <span className="font-serif text-2xl lg:text-3xl tracking-wide text-[#F8F5EF] group-hover:text-[#F2C777] transition-colors whitespace-nowrap shrink-0">
            Hotel Nordic Gate
          </span>
          <span className="block text-[10px] tracking-[0.2em] uppercase text-[#D3C8B9] font-sans -mt-0.5">
            Göteborg · Scandinavian Hospitality
          </span>
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  isActive 
                    ? 'text-[#F2C777] font-semibold' 
                    : 'text-[#F8F5EF]/85 hover:text-[#F8F5EF]'
                }`}
              >
                {lang === 'sv' ? link.labelSv : link.labelEn}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#F2C777]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary CTA Button + Secondary Quick Links */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center text-xs tracking-wider text-[#D3C8B9]">
            <button
              onClick={() => setLang('sv')}
              className={`px-2 py-1 transition-colors cursor-pointer ${
                lang === 'sv' ? 'text-[#F2C777] font-semibold' : 'hover:text-white'
              }`}
            >
              SV
            </button>
            <span className="text-white/30">/</span>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 transition-colors cursor-pointer ${
                lang === 'en' ? 'text-[#F2C777] font-semibold' : 'hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Guest Portal link */}
          <button
            onClick={() => handleNavClick('/guest')}
            className="hidden lg:flex items-center gap-1.5 text-xs text-[#D3C8B9] hover:text-[#F2C777] transition-colors py-2 px-3 border border-[#D3C8B9]/30 rounded cursor-pointer"
            title="Gästportal / Self-Service"
          >
            <User className="w-3.5 h-3.5 text-[#F2C777]" />
            <span className="whitespace-nowrap">
              {lang === 'sv' ? 'Mina Sidor' : 'My Stay'}
            </span>
          </button>

          {/* Staff HMS quick link */}
          <button
            onClick={() => handleNavClick('/app')}
            className="hidden xl:flex items-center gap-1.5 text-xs text-[#D3C8B9] hover:text-white transition-colors py-2 px-2.5 rounded cursor-pointer"
            title="Personal HMS System"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D3C8B9]" />
            <span className="whitespace-nowrap">HMS</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleNavClick('/booking')}
            className="flex items-center gap-2 bg-[#BF8641] hover:bg-[#8C5F27] text-white text-xs lg:text-sm font-semibold tracking-wider uppercase px-5 py-2.5 rounded transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#F2C777]" />
            <span>{lang === 'sv' ? 'Boka Vistelse' : 'Book Your Stay'}</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F8F5EF] hover:text-[#F2C777] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Stäng meny' : 'Öppna meny'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#0D1A26] bg-[#0D1A26] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => handleNavClick('/')}
              className="text-left text-base text-[#F8F5EF] hover:text-[#F2C777] py-1 cursor-pointer"
            >
              {lang === 'sv' ? 'Hem' : 'Home'}
            </button>
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-base text-[#F8F5EF] hover:text-[#F2C777] py-1 cursor-pointer"
              >
                {lang === 'sv' ? link.labelSv : link.labelEn}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('/guest')}
              className="text-left text-base text-[#F8F5EF] hover:text-[#F2C777] py-1 cursor-pointer flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#F2C777]" />
              {lang === 'sv' ? 'Mina Sidor (Gästportal)' : 'My Stays (Guest Portal)'}
            </button>
            <button
              onClick={() => handleNavClick('/app')}
              className="text-left text-base text-[#F8F5EF] hover:text-[#F2C777] py-1 cursor-pointer flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#D3C8B9]" />
              {lang === 'sv' ? 'Hotellsystem (HMS Personal)' : 'Hotel Management (HMS)'}
            </button>
          </nav>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs tracking-wider text-[#D3C8B9]">
              <span>Språk:</span>
              <button
                onClick={() => setLang('sv')}
                className={`cursor-pointer ${lang === 'sv' ? 'text-[#F2C777] font-bold' : ''}`}
              >
                Svenska
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setLang('en')}
                className={`cursor-pointer ${lang === 'en' ? 'text-[#F2C777] font-bold' : ''}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
