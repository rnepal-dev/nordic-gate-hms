import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import type { OnlinePaymentMethod } from '../../types/hotel.ts';
import { formatSEK, maskCardNumber, generateTransactionReference } from '../../lib/pricing.ts';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Ban,
  Sparkles,
  RefreshCw,
  QrCode
} from 'lucide-react';

interface OnlinePaymentSectionProps {
  totalGrossSEK: number;
  vatRoomSEK: number;
  vatExtrasSEK: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  onPaymentSuccess: (details: {
    method: OnlinePaymentMethod;
    transactionId: string;
    cardMask: string;
  }) => void;
  onBack: () => void;
}

export const OnlinePaymentSection: React.FC<OnlinePaymentSectionProps> = ({
  totalGrossSEK,
  vatRoomSEK,
  vatExtrasSEK,
  guestName,
  guestEmail,
  guestPhone,
  onPaymentSuccess,
  onBack,
}) => {
  const { lang } = useHotel();

  const [paymentMethod, setPaymentMethod] = useState<OnlinePaymentMethod>('card');
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 8921 7842 4242');
  const [cardHolder, setCardHolder] = useState(guestName || 'Carl von Linné');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('384');
  
  // Swish state
  const [swishPhone, setSwishPhone] = useState(guestPhone || '+46 70 123 45 67');

  // Klarna bank state
  const [selectedBank, setSelectedBank] = useState('Swedbank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [authComplete, setAuthComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Format expiry MM/YY
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleSimulatePayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\D/g, '');
      if (cleanNum.length < 15) {
        setErrorMsg(lang === 'sv' ? 'Ange ett giltigt 16-siffrigt kortnummer' : 'Please enter a valid card number');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setErrorMsg(lang === 'sv' ? 'Ange giltigt utgångsdatum (MM/ÅÅ)' : 'Please enter valid expiration date (MM/YY)');
        return;
      }
      if (!cardCvc || cardCvc.length < 3) {
        setErrorMsg(lang === 'sv' ? 'Ange giltig CVC/CVV (3 eller 4 siffror)' : 'Please enter valid CVC code');
        return;
      }
    }

    if (paymentMethod === 'swish') {
      if (!swishPhone || swishPhone.length < 8) {
        setErrorMsg(lang === 'sv' ? 'Ange ett giltigt mobilnummer för Swish' : 'Please enter a valid mobile number for Swish');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate 3D Secure / BankID authorization
    setTimeout(() => {
      setIsProcessing(false);
      setAuthComplete(true);

      const txnId = generateTransactionReference();
      const mask = paymentMethod === 'card' 
        ? maskCardNumber(cardNumber) 
        : paymentMethod === 'swish'
        ? `Swish (${swishPhone})`
        : paymentMethod === 'klarna'
        ? `Klarna Direktbank (${selectedBank})`
        : 'Apple Pay';

      // Slight celebratory delay before advancing to review
      setTimeout(() => {
        onPaymentSuccess({
          method: paymentMethod,
          transactionId: txnId,
          cardMask: mask,
        });
      }, 700);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Cash-free Hotel Policy Banner */}
      <div className="bg-[#0D1A26] text-[#F8F5EF] p-5 rounded-2xl border border-[#BF8641]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#BF8641]/20 border border-[#BF8641]/40 flex items-center justify-center shrink-0 text-[#F2C777]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#F2C777] font-bold">
                {lang === 'sv' ? '100% Kontantfritt Hotell' : '100% Cash-Free Property'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-white/10 text-[#D3C8B9] px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-[#F2C777]" />
                BankID & 3D Secure
              </span>
            </div>
            <p className="text-xs text-[#D3C8B9] mt-0.5 leading-relaxed">
              {lang === 'sv' 
                ? 'För gästernas och medarbetarnas trygghet accepterar Hotel Nordic Gate endast säkra digitala betalningar.' 
                : 'For the safety and convenience of our guests, Hotel Nordic Gate exclusively accepts secure digital payments.'}
            </p>
          </div>
        </div>

        <div className="text-right sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
          <span className="text-[11px] uppercase tracking-wider text-[#D3C8B9] block">
            {lang === 'sv' ? 'Belopp att betala' : 'Amount to Pay'}
          </span>
          <span className="type-price text-2xl font-bold text-[#F2C777]">
            {formatSEK(totalGrossSEK, lang)}
          </span>
          <span className="block text-[10px] text-[#D3C8B9]/80">
            {lang === 'sv' 
              ? `Inkl. moms: ${formatSEK(vatRoomSEK + vatExtrasSEK, lang)}` 
              : `Incl. VAT: ${formatSEK(vatRoomSEK + vatExtrasSEK, lang)}`}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-300 px-4 py-3 rounded-xl shadow-xs">
          <Ban className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Payment Method Selector Tabs */}
      <div className="space-y-3">
        <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D]">
          {lang === 'sv' ? 'Välj betalningsmetod online' : 'Select Online Payment Method'}
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Kortbetalning */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
              paymentMethod === 'card'
                ? 'bg-[#EDE7DC] border-[#BF8641] shadow-md ring-2 ring-[#BF8641]/20'
                : 'bg-white border-[#D3C8B9] hover:border-[#BF8641]/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#BF8641]' : 'text-[#25303A]'}`} />
              {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-[#BF8641]" />}
            </div>
            <div className="type-h4 font-semibold text-[#02070D] text-sm">
              {lang === 'sv' ? 'Kredit- / Betalkort' : 'Credit / Debit Card'}
            </div>
            <div className="text-[11px] text-[#25303A]/80 mt-0.5">
              Visa, Mastercard, Amex
            </div>
          </button>

          {/* Swish */}
          <button
            type="button"
            onClick={() => setPaymentMethod('swish')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
              paymentMethod === 'swish'
                ? 'bg-[#EDE7DC] border-[#BF8641] shadow-md ring-2 ring-[#BF8641]/20'
                : 'bg-white border-[#D3C8B9] hover:border-[#BF8641]/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Smartphone className={`w-5 h-5 ${paymentMethod === 'swish' ? 'text-[#BF8641]' : 'text-[#25303A]'}`} />
              {paymentMethod === 'swish' && <CheckCircle2 className="w-4 h-4 text-[#BF8641]" />}
            </div>
            <div className="type-h4 font-semibold text-[#02070D] text-sm">
              Swish
            </div>
            <div className="text-[11px] text-[#25303A]/80 mt-0.5">
              {lang === 'sv' ? 'Direkt via mobilen' : 'Instant mobile app'}
            </div>
          </button>

          {/* Klarna / Direktbank */}
          <button
            type="button"
            onClick={() => setPaymentMethod('klarna')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
              paymentMethod === 'klarna'
                ? 'bg-[#EDE7DC] border-[#BF8641] shadow-md ring-2 ring-[#BF8641]/20'
                : 'bg-white border-[#D3C8B9] hover:border-[#BF8641]/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Building2 className={`w-5 h-5 ${paymentMethod === 'klarna' ? 'text-[#BF8641]' : 'text-[#25303A]'}`} />
              {paymentMethod === 'klarna' && <CheckCircle2 className="w-4 h-4 text-[#BF8641]" />}
            </div>
            <div className="type-h4 font-semibold text-[#02070D] text-sm">
              {lang === 'sv' ? 'Klarna / BankID' : 'Klarna Direct Bank'}
            </div>
            <div className="text-[11px] text-[#25303A]/80 mt-0.5">
              {lang === 'sv' ? 'Swedbank, SEB, Nordea' : 'Direct bank & invoice'}
            </div>
          </button>

          {/* Apple Pay / Google Pay */}
          <button
            type="button"
            onClick={() => setPaymentMethod('apple_pay')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
              paymentMethod === 'apple_pay'
                ? 'bg-[#EDE7DC] border-[#BF8641] shadow-md ring-2 ring-[#BF8641]/20'
                : 'bg-white border-[#D3C8B9] hover:border-[#BF8641]/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sparkles className={`w-5 h-5 ${paymentMethod === 'apple_pay' ? 'text-[#BF8641]' : 'text-[#25303A]'}`} />
              {paymentMethod === 'apple_pay' && <CheckCircle2 className="w-4 h-4 text-[#BF8641]" />}
            </div>
            <div className="type-h4 font-semibold text-[#02070D] text-sm">
              Apple / Google Pay
            </div>
            <div className="text-[11px] text-[#25303A]/80 mt-0.5">
              {lang === 'sv' ? 'Ett klick i mobilen' : '1-touch wallet'}
            </div>
          </button>

        </div>
      </div>

      {/* 3. Payment Method Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D3C8B9] shadow-sm">
        
        {/* === A. CARD PAYMENT === */}
        {paymentMethod === 'card' && (
          <div className="space-y-6">
            
            {/* Visual Luxury Card Preview */}
            <div className="max-w-md mx-auto relative rounded-2xl p-6 bg-gradient-to-br from-[#0D1A26] via-[#1A2C3D] to-[#0A141F] text-[#F8F5EF] shadow-xl border border-[#BF8641]/40 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#F2C777]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <span className="text-lg tracking-wider text-[#F8F5EF] font-bold">
                  Hotel Nordic Gate
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#F2C777] font-sans font-semibold">
                  SÄKER BETALNING
                </span>
              </div>

              {/* EMV Chip & Contactless */}
              <div className="flex items-center gap-3 my-4 relative z-10">
                <div className="w-10 h-7 rounded bg-gradient-to-br from-[#F2C777] to-[#BF8641] border border-white/30 shadow-xs flex items-center justify-center">
                  <div className="w-6 h-4 border border-black/20 rounded-xs" />
                </div>
                <div className="text-white/40 text-xs">))))</div>
              </div>

              {/* Number */}
              <div className="type-code text-lg tracking-widest text-white/95 my-2 relative z-10 font-bold">
                {cardNumber || '•••• •••• •••• 4242'}
              </div>

              {/* Cardholder & Expiry */}
              <div className="flex justify-between items-end text-xs pt-2 border-t border-white/10 relative z-10">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#D3C8B9]">
                    KORTINNEHAVARE
                  </span>
                  <span className="font-semibold tracking-wide uppercase text-white truncate max-w-[200px] block">
                    {cardHolder || 'GÄSTENS NAMN'}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#D3C8B9]">
                    GILTIG T.O.M.
                  </span>
                  <span className="type-code text-sm text-white">
                    {cardExpiry || '11/28'}
                  </span>
                </div>
              </div>
            </div>

            {/* Input fields */}
            <form onSubmit={handleSimulatePayment} className="space-y-4 max-w-xl mx-auto">
              
              <div>
                <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D] mb-1.5">
                  {lang === 'sv' ? 'Kortnummer *' : 'Card Number *'}
                </label>
                <div className="flex items-center bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#BF8641] focus-within:border-transparent">
                  <CreditCard className="w-4 h-4 text-[#BF8641] mr-2.5 shrink-0" />
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-transparent text-sm type-code text-[#02070D] focus:outline-none"
                  />
                  <span className="text-[10px] uppercase font-bold text-[#25303A]/60 px-1.5 py-0.5 bg-white rounded border border-[#D3C8B9]">
                    3D SECURE
                  </span>
                </div>
              </div>

              <div>
                <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D] mb-1.5">
                  {lang === 'sv' ? 'Kortinnehavarens namn *' : 'Cardholder Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Carl von Linné"
                  className="w-full bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3.5 py-2.5 text-sm font-semibold text-[#02070D] focus:ring-2 focus:ring-[#BF8641] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D] mb-1.5">
                    {lang === 'sv' ? 'Utgångsdatum (MM/ÅÅ) *' : 'Expiry Date (MM/YY) *'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="11/28"
                    className="w-full bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3.5 py-2.5 text-sm type-code text-[#02070D] focus:ring-2 focus:ring-[#BF8641] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D] mb-1.5">
                    {lang === 'sv' ? 'CVC / CVV *' : 'CVC / CVV *'}
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full bg-[#F8F5EF] rounded-xl border border-[#D3C8B9] px-3.5 py-2.5 text-sm type-code text-[#02070D] focus:ring-2 focus:ring-[#BF8641] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#EDE7DC]/70 rounded-xl border border-[#D3C8B9] flex items-center gap-2.5 text-xs text-[#25303A]">
                <ShieldCheck className="w-4 h-4 text-[#BF8641] shrink-0" />
                <span>
                  {lang === 'sv'
                    ? 'Korttransaktionen skyddas med 256-bitars SSL-kryptering och BankID tvåfaktorsautentisering.'
                    : 'Transaction protected by 256-bit SSL encryption and BankID two-factor authentication.'}
                </span>
              </div>
            </form>
          </div>
        )}

        {/* === B. SWISH PAYMENT === */}
        {paymentMethod === 'swish' && (
          <div className="max-w-xl mx-auto space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-[#0D1A26] text-[#F2C777] flex items-center justify-center mx-auto shadow-md">
              <Smartphone className="w-8 h-8" />
            </div>

            <div>
              <h4 className="type-h3 text-xl sm:text-2xl font-semibold text-[#02070D]">
                {lang === 'sv' ? 'Betala med Swish' : 'Pay with Swish'}
              </h4>
              <p className="text-xs text-[#25303A] max-w-md mx-auto mt-1 leading-relaxed">
                {lang === 'sv'
                  ? 'Pengarna dras direkt från ditt anslutna bankkonto. Öppna Swish-appen i din telefon och godkänn beloppet med Mobilt BankID.'
                  : 'Funds are transferred instantly from your Swedish bank account. Open the Swish app and approve with Mobile BankID.'}
              </p>
            </div>

            <div className="p-4 bg-[#EDE7DC] rounded-xl border border-[#D3C8B9] text-left max-w-sm mx-auto space-y-2">
              <label className="type-label block text-xs font-semibold uppercase tracking-wider text-[#02070D]">
                {lang === 'sv' ? 'Mobilnummer för Swish' : 'Mobile number for Swish'}
              </label>
              <div className="flex items-center bg-white rounded-xl border border-[#D3C8B9] px-3.5 py-2.5">
                <Smartphone className="w-4 h-4 text-[#BF8641] mr-2 shrink-0" />
                <input
                  type="tel"
                  value={swishPhone}
                  onChange={(e) => setSwishPhone(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-[#02070D] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-[#25303A]/70">
              <QrCode className="w-4 h-4 text-[#BF8641]" />
              <span>{lang === 'sv' ? 'Mottagare: Hotel Nordic Gate AB (Swish-nr: 123 750 19 00)' : 'Recipient: Hotel Nordic Gate AB'}</span>
            </div>
          </div>
        )}

        {/* === C. KLARNA / DIREKTBANK === */}
        {paymentMethod === 'klarna' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center">
              <h4 className="type-h3 text-xl sm:text-2xl font-semibold text-[#02070D]">
                {lang === 'sv' ? 'Direktbetalning via svensk bank & BankID' : 'Direct Bank Payment & BankID'}
              </h4>
              <p className="text-xs text-[#25303A] mt-1">
                {lang === 'sv'
                  ? 'Välj din internetbank nedan för säker inloggning och direktbetalning med Mobilt BankID.'
                  : 'Select your Swedish bank for secure login and payment via Mobile BankID.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {['Swedbank', 'Handelsbanken', 'SEB', 'Nordea', 'Danske Bank', 'Länsförsäkringar'].map(bank => (
                <button
                  key={bank}
                  type="button"
                  onClick={() => setSelectedBank(bank)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    selectedBank === bank
                      ? 'bg-[#0D1A26] text-[#F8F5EF] border-[#0D1A26] shadow-md'
                      : 'bg-[#F8F5EF] text-[#02070D] border-[#D3C8B9] hover:border-[#BF8641]'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>

            <div className="p-4 bg-[#EDE7DC] rounded-xl border border-[#D3C8B9] flex items-center gap-3 text-xs text-[#25303A]">
              <Lock className="w-4 h-4 text-[#BF8641] shrink-0" />
              <span>
                {lang === 'sv'
                  ? `Vald bank: ${selectedBank}. Identifiering sker med Mobilt BankID via krypterad förbindelse.`
                  : `Selected: ${selectedBank}. Verified with Swedish Mobile BankID.`}
              </span>
            </div>
          </div>
        )}

        {/* === D. APPLE PAY === */}
        {paymentMethod === 'apple_pay' && (
          <div className="max-w-md mx-auto space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8 text-[#F2C777]" />
            </div>

            <div>
              <h4 className="type-h3 text-xl sm:text-2xl font-semibold text-[#02070D]">
                Apple Pay & Google Pay
              </h4>
              <p className="text-xs text-[#25303A] mt-1">
                {lang === 'sv'
                  ? 'Bekräfta betalningen med Face ID, Touch ID eller ditt sparade betalkort.'
                  : 'Confirm payment using Face ID, Touch ID or your saved digital wallet.'}
              </p>
            </div>

            <div className="p-4 bg-[#EDE7DC] rounded-xl border border-[#D3C8B9] text-xs text-[#25303A]">
              {lang === 'sv' ? 'Totalbelopp:' : 'Total amount:'}{' '}
              <span className="type-price text-base font-bold text-[#02070D]">
                {formatSEK(totalGrossSEK, lang)}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D3C8B9]">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="w-full sm:w-auto px-6 py-3 border border-[#D3C8B9] hover:border-[#BF8641] text-[#25303A] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'sv' ? 'Tillbaka till gästuppgifter' : 'Back to Guest Details'}</span>
        </button>

        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={isProcessing || authComplete}
          className={`w-full sm:w-auto px-8 py-3.5 bg-[#BF8641] hover:bg-[#8C5F27] text-white font-bold text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
            isProcessing ? 'opacity-80 cursor-wait' : ''
          }`}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Auktoriserar med BankID...' : 'Authorizing via BankID...'}</span>
            </>
          ) : authComplete ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#F2C777]" />
              <span>{lang === 'sv' ? 'Betalning Godkänd!' : 'Payment Approved!'}</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-[#F2C777]" />
              <span>
                {lang === 'sv' 
                  ? `Godkänn & Betala ${formatSEK(totalGrossSEK, lang)}` 
                  : `Authorize & Pay ${formatSEK(totalGrossSEK, lang)}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
