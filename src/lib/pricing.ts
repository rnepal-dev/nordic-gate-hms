/**
 * Swedish Hospitality Pricing and Tax Calculations for Stora Hamnen
 */

export interface PriceCalculationInput {
  nightlyRateSEK: number;
  nights: number;
  ratePlanMultiplier?: number;
  extras?: { priceSEK: number; count: number; vatRate?: number }[];
  promoDiscountPercent?: number;
}

export interface PriceCalculationResult {
  nights: number;
  baseRoomSubtotalSEK: number;
  discountAmountSEK: number;
  roomGrossSEK: number;
  roomNetSEK: number;
  vatRoomSEK: number; // 12% Swedish Hotel VAT
  extrasGrossSEK: number;
  vatExtrasSEK: number; // typically 25% for parking/spa or 12% for food
  totalGrossSEK: number;
  totalVatSEK: number;
  totalNetSEK: number;
}

/**
 * Calculates number of nights between two ISO YYYY-MM-DD dates
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

/**
 * Calculates itemized totals, discounts, and Swedish VAT breakdowns
 */
export function calculateBookingPrice(input: PriceCalculationInput): PriceCalculationResult {
  const nights = Math.max(1, input.nights || 1);
  const multiplier = input.ratePlanMultiplier ?? 1.0;
  const promoDiscount = Math.min(100, Math.max(0, input.promoDiscountPercent ?? 0));

  const rawRoomTotal = Math.round(input.nightlyRateSEK * multiplier * nights);
  const discountAmountSEK = Math.round(rawRoomTotal * (promoDiscount / 100));
  const roomGrossSEK = rawRoomTotal - discountAmountSEK;

  // Swedish Hotel accommodation VAT: 12% included in gross price
  // Formula: VAT = Gross * (0.12 / 1.12)
  const vatRoomSEK = Math.round(roomGrossSEK * (0.12 / 1.12));
  const roomNetSEK = roomGrossSEK - vatRoomSEK;

  let extrasGrossSEK = 0;
  let vatExtrasSEK = 0;

  if (input.extras && input.extras.length > 0) {
    for (const extra of input.extras) {
      const lineGross = extra.priceSEK * (extra.count || 0);
      const vatRate = extra.vatRate !== undefined ? extra.vatRate : 0.25; // default 25% standard VAT
      const lineVat = Math.round(lineGross * (vatRate / (1 + vatRate)));
      extrasGrossSEK += lineGross;
      vatExtrasSEK += lineVat;
    }
  }

  const totalGrossSEK = roomGrossSEK + extrasGrossSEK;
  const totalVatSEK = vatRoomSEK + vatExtrasSEK;
  const totalNetSEK = totalGrossSEK - totalVatSEK;

  return {
    nights,
    baseRoomSubtotalSEK: rawRoomTotal,
    discountAmountSEK,
    roomGrossSEK,
    roomNetSEK,
    vatRoomSEK,
    extrasGrossSEK,
    vatExtrasSEK,
    totalGrossSEK,
    totalVatSEK,
    totalNetSEK,
  };
}

/**
 * Format currency in Swedish Kronor (e.g. 2 450 kr or 2,450 SEK)
 */
export function formatSEK(amount: number, locale: 'sv' | 'en' = 'sv'): string {
  const formatted = Math.round(amount).toLocaleString(locale === 'sv' ? 'sv-SE' : 'en-US');
  return locale === 'sv' ? `${formatted} kr` : `${formatted} SEK`;
}

/**
 * Generates an authentic Swedish heritage booking reference
 */
export function generateBookingReference(prefix: string = 'SH'): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
}
