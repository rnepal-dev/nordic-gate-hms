import React from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { 
  ShieldAlert, 
  ArrowLeft, 
  User, 
  KeyRound, 
  Home,
  Lock,
  Building2
} from 'lucide-react';

export const UnauthorizedView: React.FC = () => {
  const { lang, navigate, currentUser } = useHotel();

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col justify-between selection:bg-[#F2C777]/30 selection:text-[#02070D]">
      
      {/* Top Header */}
      <header className="w-full bg-[#0D1A26] border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs text-[#D3C8B9] hover:text-[#F2C777] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'sv' ? 'Till startsidan' : 'Back to Home'}</span>
          </button>

          <span className="font-brand-logo text-xl text-[#F8F5EF]">
            Hotel Nordic Gate
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 my-8">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-[#D3C8B9] shadow-xl overflow-hidden text-center">
          
          <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 sm:p-10 relative overflow-hidden border-b border-[#BF8641]/30">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[#F2C777] flex items-center justify-center mx-auto mb-4 border border-[#F2C777]/30 shadow-lg">
              <ShieldAlert className="w-8 h-8 text-[#F2C777]" />
            </div>

            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#F2C777] block mb-1">
              {lang === 'sv' ? '403 · Säkerhetsbegränsning' : '403 · Access Restricted'}
            </span>

            <h1 className="type-h2 text-2xl sm:text-3xl font-semibold text-[#F8F5EF]">
              {lang === 'sv' ? 'Behörighet saknas för detta system' : 'Unauthorized Area Access'}
            </h1>

            <p className="text-xs sm:text-sm text-[#D3C8B9] max-w-md mx-auto mt-2 font-light leading-relaxed">
              {lang === 'sv'
                ? 'Den begärda sektionen kräver särskild administrativ eller receptionsbehörighet inom Hotel Nordic Gate HMS.'
                : 'The requested section requires verified staff or administrative credentials within Hotel Nordic Gate HMS.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Context Box */}
            <div className="p-4 bg-[#EDE7DC] rounded-xl border border-[#D3C8B9] text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#02070D]">
                  {lang === 'sv' ? 'Aktuell session:' : 'Current Session:'}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#BF8641] bg-white px-2 py-0.5 rounded border border-[#D3C8B9]">
                  {currentUser ? currentUser.badge : (lang === 'sv' ? 'Ej inloggad' : 'Guest / Public')}
                </span>
              </div>
              <p className="text-[#25303A] text-[11px] leading-relaxed">
                {currentUser?.role === 'guest'
                  ? (lang === 'sv' 
                      ? 'Du är inloggad som boende gäst. För att granska din vistelse, ankomstönskemål och kvitton, besök gästportalen Mina Sidor.'
                      : 'You are signed in as a hotel guest. To review your reservation and preferences, please visit the Guest Portal.')
                  : (lang === 'sv'
                      ? 'Om du är anställd på Hotel Nordic Gate, vänligen logga in med dina officiella personalkoder för reception eller drift.'
                      : 'If you are a staff member, please log in with your official front desk or management credentials.')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/guest')}
                className="py-3 px-4 bg-[#EDE7DC] hover:bg-[#D3C8B9] text-[#02070D] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-[#D3C8B9] transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-[#BF8641]" />
                <span>{lang === 'sv' ? 'Gå till Gästportalen' : 'Go to Guest Portal'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="py-3 px-4 bg-[#0D1A26] hover:bg-[#1A2C3D] text-[#F8F5EF] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-[#F2C777]" />
                <span>{lang === 'sv' ? 'Logga in med personalkonto' : 'Staff Login (HMS)'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#EDE7DC]">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-[#25303A] hover:text-[#02070D] font-medium flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-[#BF8641]" />
                <span>{lang === 'sv' ? 'Tillbaka till Hotel Nordic Gate startsida' : 'Return to Hotel Nordic Gate Home'}</span>
              </button>
            </div>

          </div>

        </div>
      </main>

      <footer className="text-center p-6 text-xs text-[#25303A]/70">
        <p>Hotel Nordic Gate Göteborg · Säkerhet & Behörighetshantering</p>
      </footer>

    </div>
  );
};
