import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft,
  Check,
  ShieldCheck,
  KeyRound
} from 'lucide-react';

export const ResetPasswordView: React.FC = () => {
  const { lang, navigate } = useHotel();

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Requirements checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const allRequirementsMet = hasMinLength && hasUppercase && hasNumberOrSpecial;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!allRequirementsMet) {
      setErrorMessage(
        lang === 'sv'
          ? 'Lösenordet uppfyller inte alla säkerhetskrav nedan.'
          : 'Password does not meet all security requirements.'
      );
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage(
        lang === 'sv'
          ? 'Lösenorden matchar inte varandra.'
          : 'Passwords do not match.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
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
            <span>{lang === 'sv' ? 'Avbryt och gå till inloggning' : 'Cancel and return to Login'}</span>
          </button>

          <span className="font-brand-logo text-xl text-[#F8F5EF]">
            Hotel Nordic Gate
          </span>
        </div>
      </header>

      {/* Main Form Box */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10 my-6">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-[#D3C8B9] shadow-xl overflow-hidden">
          
          <div className="bg-[#0D1A26] text-[#F8F5EF] p-8 text-center relative overflow-hidden border-b border-[#BF8641]/30">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#F2C777] flex items-center justify-center mx-auto mb-3 border border-white/15">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="type-h2 text-2xl sm:text-3xl font-semibold text-[#F8F5EF]">
              {lang === 'sv' ? 'Välj ett nytt lösenord' : 'Create New Password'}
            </h1>
            <p className="text-xs sm:text-sm text-[#D3C8B9] max-w-sm mx-auto mt-2 font-light leading-relaxed">
              {lang === 'sv'
                ? 'Sätt ett nytt säkert lösenord för ditt Hotel Nordic Gate-konto.'
                : 'Choose a strong and secure password for your Hotel Nordic Gate account.'}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {isSuccess ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="type-h3 text-xl font-semibold text-[#02070D]">
                    {lang === 'sv' ? 'Lösenordet har uppdaterats!' : 'Password Successfully Updated!'}
                  </h3>
                  <p className="text-xs text-[#25303A] max-w-sm mx-auto leading-relaxed">
                    {lang === 'sv'
                      ? 'Ditt nya lösenord har sparats och är nu aktivt. Du kan nu logga in med dina nya uppgifter.'
                      : 'Your new password has been saved and is now active. You may now log in with your new credentials.'}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#BF8641] hover:bg-[#8C5F27] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{lang === 'sv' ? 'Gå till inloggning nu' : 'Proceed to Login'}</span>
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

                {/* New Password */}
                <div>
                  <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D] mb-1.5">
                    {lang === 'sv' ? 'Nytt lösenord *' : 'New Password *'}
                  </label>
                  <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#BF8641] focus-within:border-transparent transition-all">
                    <Lock className="w-4 h-4 text-[#BF8641] mr-2.5 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minst 8 tecken"
                      className="w-full bg-transparent text-sm text-[#02070D] focus:outline-none"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#25303A]/60 hover:text-[#02070D] cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D] mb-1.5">
                    {lang === 'sv' ? 'Bekräfta nytt lösenord *' : 'Confirm New Password *'}
                  </label>
                  <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#BF8641] focus-within:border-transparent transition-all">
                    <Lock className="w-4 h-4 text-[#BF8641] mr-2.5 shrink-0" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Upprepa lösenord"
                      className="w-full bg-transparent text-sm text-[#02070D] focus:outline-none"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[#25303A]/60 hover:text-[#02070D] cursor-pointer p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="p-4 bg-[#EDE7DC] rounded-xl border border-[#D3C8B9] space-y-2 text-xs">
                  <span className="font-semibold text-[#02070D] block">
                    {lang === 'sv' ? 'Lösenordskrav:' : 'Password Requirements:'}
                  </span>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        hasMinLength ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {hasMinLength ? <Check className="w-3 h-3" /> : '•'}
                      </div>
                      <span className={hasMinLength ? 'text-emerald-800 font-medium' : 'text-[#25303A]'}>
                        {lang === 'sv' ? 'Minst 8 tecken långt' : 'At least 8 characters'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        hasUppercase ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {hasUppercase ? <Check className="w-3 h-3" /> : '•'}
                      </div>
                      <span className={hasUppercase ? 'text-emerald-800 font-medium' : 'text-[#25303A]'}>
                        {lang === 'sv' ? 'Minst en stor bokstav (A-Ö)' : 'At least one uppercase letter (A-Z)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        hasNumberOrSpecial ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {hasNumberOrSpecial ? <Check className="w-3 h-3" /> : '•'}
                      </div>
                      <span className={hasNumberOrSpecial ? 'text-emerald-800 font-medium' : 'text-[#25303A]'}>
                        {lang === 'sv' ? 'Minst en siffra eller specialtecken' : 'At least one number or special character'}
                      </span>
                    </div>

                    {confirmPassword.length > 0 && (
                      <div className="flex items-center gap-2 pt-1 border-t border-[#D3C8B9]">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          passwordsMatch ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                          {passwordsMatch ? <Check className="w-3 h-3" /> : '×'}
                        </div>
                        <span className={passwordsMatch ? 'text-emerald-800 font-medium' : 'text-rose-700'}>
                          {passwordsMatch 
                            ? (lang === 'sv' ? 'Lösenorden matchar varandra' : 'Passwords match')
                            : (lang === 'sv' ? 'Lösenorden matchar inte' : 'Passwords do not match')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !allRequirementsMet || !passwordsMatch}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      isLoading || !allRequirementsMet || !passwordsMatch
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-[#BF8641] hover:bg-[#8C5F27]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#F2C777]" />
                        <span>{lang === 'sv' ? 'Uppdaterar lösenord...' : 'Updating password...'}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-[#F2C777]" />
                        <span>{lang === 'sv' ? 'Spara nytt lösenord' : 'Save New Password'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </main>

      <footer className="text-center p-6 text-xs text-[#25303A]/70">
        <p>Hotel Nordic Gate Göteborg · Säker portalautentisering</p>
      </footer>

    </div>
  );
};
