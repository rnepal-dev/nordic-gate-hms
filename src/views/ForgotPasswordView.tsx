import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Send,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export const ForgotPasswordView: React.FC = () => {
  const { lang, navigate } = useHotel();
  const [email, setEmail] = useState<string>('carl.linne@goteborg.se');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage(
        lang === 'sv' 
          ? 'Vänligen ange en giltig e-postadress.' 
          : 'Please provide a valid email address.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex flex-col justify-between selection:bg-[#F2C777]/30 selection:text-[#02070D]">
      
      {/* Top Header */}
      <header className="w-full bg-[#0D1A26] border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-xs text-[#D3C8B9] hover:text-[#F2C777] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'sv' ? 'Tillbaka till inloggning' : 'Back to Login'}</span>
          </button>

          <span className="font-brand-logo text-xl text-[#F8F5EF]">
            Hotel Nordic Gate
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 my-6">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-[#D3C8B9] shadow-xl overflow-hidden">
          
          <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 text-center relative overflow-hidden border-b border-[#BF8641]/30">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#F2C777] flex items-center justify-center mx-auto mb-3 border border-white/15">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="type-h2 text-2xl sm:text-3xl font-semibold text-[#F8F5EF]">
              {lang === 'sv' ? 'Återställ ditt lösenord' : 'Reset Your Password'}
            </h1>
            <p className="text-xs sm:text-sm text-[#D3C8B9] max-w-sm mx-auto mt-2 font-light leading-relaxed">
              {lang === 'sv'
                ? 'Ange din registrerade e-postadress nedan så skickar vi en säker återställningslänk.'
                : 'Enter your registered email address and we will send you a secure password reset link.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {isSubmitted ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="type-h3 text-xl font-semibold text-[#02070D]">
                    {lang === 'sv' ? 'Återställningslänk skickad!' : 'Reset Link Sent!'}
                  </h3>
                  <p className="text-xs text-[#25303A] max-w-sm mx-auto leading-relaxed">
                    {lang === 'sv'
                      ? `Vi har skickat instruktioner för att återställa lösenordet till `
                      : `We have sent password reset instructions to `}
                    <strong className="text-[#02070D] font-mono">{email}</strong>.
                  </p>
                  <p className="text-[11px] text-[#25303A]/70 max-w-sm mx-auto">
                    {lang === 'sv'
                      ? 'Länken är giltig i 15 minuter. Om du inte mottagit mejlet inom kort, kontrollera skräpposten.'
                      : 'The link is valid for 15 minutes. Check your spam folder if you do not see it.'}
                  </p>
                </div>

                <div className="p-4 bg-[#EDE7DC] rounded-xl border border-[#D3C8B9] text-left text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#02070D] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#BF8641]" />
                    <span>{lang === 'sv' ? 'Demo-instruktion' : 'Demo Flow Guidance'}</span>
                  </div>
                  <p className="text-[#25303A] text-[11px]">
                    {lang === 'sv'
                      ? 'I denna frontend-demo kan du klicka nedan för att simulera att du öppnat mejllänken och välja ett nytt lösenord direkt.'
                      : 'In this frontend demo, click below to simulate opening the reset email link and setting a new password.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/reset-password')}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#BF8641] hover:bg-[#8C5F27] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{lang === 'sv' ? 'Fortsätt till: Välj nytt lösenord' : 'Proceed to Set New Password'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full py-2.5 text-xs text-[#25303A] hover:text-[#02070D] font-medium transition-colors cursor-pointer"
                  >
                    {lang === 'sv' ? 'Tillbaka till inloggningssidan' : 'Return to Login Page'}
                  </button>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMessage && (
                  <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

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
                      placeholder="din.epost@nordicgate.se"
                      className="w-full bg-transparent text-sm text-[#02070D] focus:outline-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      isLoading ? 'bg-[#BF8641]/70 cursor-not-allowed' : 'bg-[#BF8641] hover:bg-[#8C5F27]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#F2C777]" />
                        <span>{lang === 'sv' ? 'Skickar återställningslänk...' : 'Sending reset link...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#F2C777]" />
                        <span>{lang === 'sv' ? 'Skicka återställningslänk' : 'Send Reset Link'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-4 text-center border-t border-[#EDE7DC]">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-xs text-[#BF8641] hover:text-[#8C5F27] font-semibold underline cursor-pointer"
                  >
                    {lang === 'sv' ? 'Kommer du ihåg lösenordet? Logga in' : 'Remembered your password? Log in'}
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </main>

      <footer className="text-center p-6 text-xs text-[#25303A]/70">
        <p>Hotel Nordic Gate Göteborg · Kundtjänst & Support: reception@nordicgate.se</p>
      </footer>

    </div>
  );
};
