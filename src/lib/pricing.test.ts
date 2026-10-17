import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNights, calculateBookingPrice, formatSEK, generateBookingReference } from './pricing.ts';

test('calculateNights correctly counts nights between dates', () => {
  assert.equal(calculateNights('2026-10-20', '2026-10-22'), 2);
  assert.equal(calculateNights('2026-10-20', '2026-10-25'), 5);
  // Default minimum 1 night if same day or invalid
  assert.equal(calculateNights('2026-10-20', '2026-10-20'), 1);
});

test('calculateBookingPrice computes room total and Swedish 12% hotel VAT', () => {
  const result = calculateBookingPrice({
    nightlyRateSEK: 2800,
    nights: 2,
    ratePlanMultiplier: 1.0,
  });

  assert.equal(result.nights, 2);
  assert.equal(result.baseRoomSubtotalSEK, 5600);
  assert.equal(result.roomGrossSEK, 5600);
  // 5600 * (0.12 / 1.12) = 600
  assert.equal(result.vatRoomSEK, 600);
  assert.equal(result.roomNetSEK, 5000);
  assert.equal(result.totalGrossSEK, 5600);
});

test('calculateBookingPrice correctly calculates ancillary extras with 25% VAT', () => {
  const result = calculateBookingPrice({
    nightlyRateSEK: 3000,
    nights: 1,
    extras: [
      { priceSEK: 500, count: 2, vatRate: 0.25 }, // 1000 SEK total
    ],
  });

  assert.equal(result.extrasGrossSEK, 1000);
  // 1000 * (0.25 / 1.25) = 200 SEK VAT
  assert.equal(result.vatExtrasSEK, 200);
  assert.equal(result.totalGrossSEK, 4000);
  assert.equal(result.totalVatSEK, Math.round(3000 * (0.12 / 1.12)) + 200);
});

test('calculateBookingPrice applies promotional discount accurately', () => {
  const result = calculateBookingPrice({
    nightlyRateSEK: 4000,
    nights: 2,
    promoDiscountPercent: 10,
  });

  assert.equal(result.baseRoomSubtotalSEK, 8000);
  assert.equal(result.discountAmountSEK, 800);
  assert.equal(result.roomGrossSEK, 7200);
});

test('formatSEK outputs proper Swedish kronor representation', () => {
  const formattedSv = formatSEK(2850, 'sv');
  assert.match(formattedSv, /2\s?850\s*kr/);
});

test('generateBookingReference produces SH- prefixed code', () => {
  const ref = generateBookingReference('SH');
  assert.match(ref, /^SH-\d{5}$/);
});
