import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { DEMO_LOGIN_PRESETS } from '../data/authDemoData.ts';
import type { LoginRole } from '../types/hotel.ts';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Home,
  KeyRound
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { lang, setLang, navigate, login } = useHotel();

  const [selectedRole, setSelectedRole] = useState<LoginRole>('guest');
  const [email, setEmail] = useState<string>(DEMO_LOGIN_PRESETS.guest.defaultEmail);
  const [password, setPassword] = useState<string>(DEMO_LOGIN_PRESETS.guest.defaultPassword);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  
  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // When role changes, prefill with role's demo credentials
  const handleRoleSelect = (role: LoginRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmail(DEMO_LOGIN_PRESETS[role].defaultEmail);
    setPassword(DEMO_LOGIN_PRESETS[role].defaultPassword);
  };

  const handleQuickDemoFill = (role: LoginRole) => {
    handleRoleSelect(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic frontend validation
    if (!email || !email.includes('@')) {
      setErrorMessage(
        lang === 'sv' 
          ? 'Vänligen ange en giltig e-postadress.' 
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage(
        lang === 'sv' 
          ? 'Lösenordet måste bestå av minst 6 tecken.' 
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    // Simulated test failure condition
    if (password.toLowerCase() === 'error' || email.toLowerCase().includes('fail')) {
      setErrorMessage(
        lang === 'sv'
          ? 'Ogiltiga inloggningsuppgifter. Kontrollera e-postadress och lösenord, eller kontakta receptionen.'
          : 'Invalid credentials. Please verify your email and password, or contact the front desk.'
      );
      return;
    }

    setIsLoading(true);

    // Simulate luxury authentication roundtrip
    setTimeout(() => {
      setIsLoading(false);
      const preset = DEMO_LOGIN_PRESETS[selectedRole];
      
      const sessionUser = {
        ...preset.user,
        email: email,
      };

      setSuccessMessage(
        lang === 'sv' 
          ? `Inloggning lyckades! Omdirigerar till ${preset.destinationLabelSv}...` 
          : `Login successful! Redirecting to ${preset.destinationLabelEn}...`
      );

      // Perform context login and redirect
      setTimeout(() => {
        login(sessionUser, preset.destination);
      }, 700);
    }, 850);
  };

  const activePreset = DEMO_LOGIN_PRESETS[selectedRole];

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col justify-between selection:bg-[#F2C777]/30 selection:text-[#02070D]">
      
      {/* Top Header Bar */}
      <header className="w-full bg-[#0D1A26] border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs text-[#D3C8B9] hover:text-[#F2C777] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'sv' ? 'Tillbaka till webbplatsen' : 'Back to Website'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 text-xs text-[#D3C8B9]">
            <button
              onClick={() => setLang('sv')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                lang === 'sv' ? 'bg-[#BF8641] text-white font-semibold' : 'hover:text-white'
              }`}
            >
              SV
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                lang === 'en' ? 'bg-[#BF8641] text-white font-semibold' : 'hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Experience */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 my-4">
        <div className="w-full max-w-xl bg-white rounded-2xl border border-[#D3C8B9] shadow-xl overflow-hidden">
          
          {/* Header Card Brand Banner */}
          <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 text-center relative overflow-hidden border-b border-[#BF8641]/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F2C777]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-2">
              <span className="font-brand-logo text-3xl sm:text-4xl tracking-wide text-[#F8F5EF] block">
                Hotel Nordic Gate
              </span>
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#F2C777] font-semibold block">
                Göteborg · Säker Portalinloggning
              </span>
              <p className="text-xs sm:text-sm text-[#D3C8B9] max-w-md mx-auto pt-1 font-light">
                {lang === 'sv'
                  ? 'Välkommen till hotellets digitala portalsystem. Välj din roll nedan för anpassad åtkomst.'
                  : 'Welcome to the hotel digital portal. Select your role below for personalized access.'}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* 1. Role Selection Segmented Control */}
            <div className="space-y-2">
              <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D]">
                {lang === 'sv' ? 'Välj inloggningstyp' : 'Select Login Role'}
              </label>

              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F8F5EF] rounded-xl border border-[#D3C8B9]">
                
                {/* Guest Role Tab */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('guest')}
                  className={`py-2.5 px-3 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === 'guest'
                      ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-md ring-1 ring-white/10'
                      : 'text-[#25303A] hover:bg-white/80 hover:text-[#02070D]'
                  }`}
                >
                  <User className={`w-4 h-4 shrink-0 ${selectedRole === 'guest' ? 'text-[#F2C777]' : 'text-[#BF8641]'}`} />
                  <span className="truncate">{lang === 'sv' ? 'Gäst' : 'Guest'}</span>
                </button>

                {/* Front Desk Role Tab */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('front_desk')}
                  className={`py-2.5 px-3 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === 'front_desk'
                      ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-md ring-1 ring-white/10'
                      : 'text-[#25303A] hover:bg-white/80 hover:text-[#02070D]'
                  }`}
                >
                  <Building2 className={`w-4 h-4 shrink-0 ${selectedRole === 'front_desk' ? 'text-[#F2C777]' : 'text-[#BF8641]'}`} />
                  <span className="truncate">{lang === 'sv' ? 'Reception' : 'Front Desk'}</span>
                </button>

                {/* Admin Role Tab */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className={`py-2.5 px-3 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-[#0D1A26] text-[#F8F5EF] shadow-md ring-1 ring-white/10'
                      : 'text-[#25303A] hover:bg-white/80 hover:text-[#02070D]'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 shrink-0 ${selectedRole === 'admin' ? 'text-[#F2C777]' : 'text-[#BF8641]'}`} />
                  <span className="truncate">{lang === 'sv' ? 'Hotellchef' : 'Admin / HMS'}</span>
                </button>

              </div>

              {/* Role Context Helper Banner */}
              <div className="p-3.5 bg-[#EDE7DC] rounded-xl border border-[#D3C8B9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-[#02070D]">
                      {lang === 'sv' ? activePreset.labelSv : activePreset.labelEn}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#BF8641] bg-white px-2 py-0.5 rounded border border-[#D3C8B9]">
                      {lang === 'sv' ? activePreset.badgeSv : activePreset.badgeEn}
                    </span>
                  </div>
                  <p className="text-[#25303A] text-[11px] leading-relaxed">
                    {lang === 'sv' ? activePreset.descSv : activePreset.descEn}
                  </p>
                </div>

                <div className="shrink-0 pt-0.5 sm:pt-0">
                  <span className="text-[10px] text-[#25303A]/70 font-mono block">
                    {lang === 'sv' ? 'Mål: ' : 'Target: '}
                    <strong className="text-[#02070D]">{lang === 'sv' ? activePreset.destinationLabelSv : activePreset.destinationLabelEn}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Error & Success Feedback Banners */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{lang === 'sv' ? 'Inloggningen misslyckades' : 'Authentication Error'}</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-start gap-3 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{lang === 'sv' ? 'Godkänd inloggning' : 'Authentication Successful'}</p>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {/* 2. Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Field */}
              <div>
                <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D] mb-1.5">
                  {lang === 'sv' ? 'E-postadress *' : 'Email Address *'}
                </label>
                <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#BF8641] focus-within:border-transparent transition-all">
                  <Mail className="w-4 h-4 text-[#BF8641] mr-2.5 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="namn@nordicgate.se"
                    className="w-full bg-transparent text-sm text-[#02070D] focus:outline-none"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D]">
                    {lang === 'sv' ? 'Lösenord *' : 'Password *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-xs text-[#BF8641] hover:text-[#8C5F27] font-semibold hover:underline cursor-pointer"
                  >
                    {lang === 'sv' ? 'Glömt lösenord?' : 'Forgot password?'}
                  </button>
                </div>

                <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#BF8641] focus-within:border-transparent transition-all">
                  <Lock className="w-4 h-4 text-[#BF8641] mr-2.5 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent text-sm text-[#02070D] focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#25303A]/60 hover:text-[#02070D] cursor-pointer p-1"
                    title={showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between text-xs text-[#25303A] pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-[#BF8641] text-[#BF8641] w-4 h-4 focus:ring-[#BF8641] cursor-pointer"
                  />
                  <span>{lang === 'sv' ? 'Kom ihåg mig på denna enhet' : 'Remember me on this device'}</span>
                </label>
                
                <span className="text-[11px] text-[#25303A]/60 hidden sm:inline">
                  256-bit SSL krypterad
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isLoading 
                      ? 'bg-[#BF8641]/70 cursor-not-allowed' 
                      : 'bg-[#BF8641] hover:bg-[#8C5F27] hover:shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#F2C777]" />
                      <span>{lang === 'sv' ? 'Autentiserar uppgifter...' : 'Authenticating...'}</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-[#F2C777]" />
                      <span>
                        {lang === 'sv' 
                          ? `Logga in som ${activePreset.badgeSv}` 
                          : `Sign In as ${activePreset.badgeEn}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* 3. Demo Quick Selector Bar for Reviewers */}
            <div className="pt-4 border-t border-[#EDE7DC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#25303A]/70 font-semibold">
                  {lang === 'sv' ? 'Snabbtest med demouppgifter:' : 'Quick Demo Credentials:'}
                </span>
                <span className="text-[10px] text-[#BF8641] font-medium">
                  {lang === 'sv' ? 'Klicka för att fylla i' : 'Click to autofill'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('guest')}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedRole === 'guest'
                      ? 'bg-[#EDE7DC] border-[#BF8641] font-semibold text-[#02070D]'
                      : 'bg-[#F8F5EF] border-[#D3C8B9] hover:border-[#BF8641] text-[#25303A]'
                  }`}
                >
                  <span className="block text-[10px] text-[#BF8641] font-bold">Gäst</span>
                  <span className="truncate block font-mono text-[11px]">Carl von Linné</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('front_desk')}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedRole === 'front_desk'
                      ? 'bg-[#EDE7DC] border-[#BF8641] font-semibold text-[#02070D]'
                      : 'bg-[#F8F5EF] border-[#D3C8B9] hover:border-[#BF8641] text-[#25303A]'
                  }`}
                >
                  <span className="block text-[10px] text-[#BF8641] font-bold">Reception</span>
                  <span className="truncate block font-mono text-[11px]">Klara Sjöstrand</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin')}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-[#EDE7DC] border-[#BF8641] font-semibold text-[#02070D]'
                      : 'bg-[#F8F5EF] border-[#D3C8B9] hover:border-[#BF8641] text-[#25303A]'
                  }`}
                >
                  <span className="block text-[10px] text-[#BF8641] font-bold">Admin</span>
                  <span className="truncate block font-mono text-[11px]">Astrid Lindqvist</span>
                </button>
              </div>

              {/* Demo test toggle for error state testing */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-[#25303A]/70">
                <span>{lang === 'sv' ? 'Testa felaktiga uppgifter:' : 'Test invalid credentials:'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('error');
                    setErrorMessage(
                      lang === 'sv'
                        ? 'Simulerat fel: Ogiltigt lösenord. Kontrollera dina uppgifter.'
                        : 'Simulated error: Invalid password. Please verify credentials.'
                    );
                  }}
                  className="text-rose-600 hover:text-rose-800 underline cursor-pointer"
                >
                  {lang === 'sv' ? 'Framkalla felläge' : 'Trigger error state'}
                </button>
              </div>
            </div>

            {/* 4. Guest / Public Alternatives */}
            <div className="pt-2 text-center border-t border-[#EDE7DC]">
              <p className="text-xs text-[#25303A]">
                {lang === 'sv' ? 'Har du ingen inloggning eller vill du bara boka?' : "Don't have an account or just want to book?"}{' '}
                <button
                  type="button"
                  onClick={() => navigate('/booking')}
                  className="text-[#BF8641] hover:text-[#8C5F27] font-semibold underline cursor-pointer"
                >
                  {lang === 'sv' ? 'Boka rum direkt utan konto' : 'Book directly as guest'}
                </button>
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="text-center p-6 text-xs text-[#25303A]/70">
        <p>
          Hotel Nordic Gate Göteborg · Gamla Tingstadsgatan 1, 422 44 Hisings Backa · Tel: +46 (0)31 750 19 00
        </p>
        <p className="mt-1 text-[11px] text-[#25303A]/50">
          Skyddad webbapplikation för gästportal och hotelladministration (HMS)
        </p>
      </footer>

    </div>
  );
};
