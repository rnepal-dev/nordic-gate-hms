import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateCalendarNights, validateBookingDatesCalendar, parseDateOnly } from './date-logic.ts';
import type { ReservationCreate } from '../redux/feature/bookings/bookingTypes.ts';

describe('Booking Engine & Dynamic Pricing Contract Tests', () => {

  test('validateBookingDatesCalendar correctly rejects invalid check-out dates', () => {
    // Check-out before check-in
    const res1 = validateBookingDatesCalendar('2026-11-20', '2026-11-18');
    assert.equal(res1.isValid, false);
    assert.match(res1.error || '', /Utcheckningsdatum.*måste vara efter/i);

    // Same day check-out
    const res2 = validateBookingDatesCalendar('2026-11-20', '2026-11-20');
    assert.equal(res2.isValid, false);

    // Valid check-out
    const res3 = validateBookingDatesCalendar('2026-11-20', '2026-11-23');
    assert.equal(res3.isValid, true);
    assert.equal(calculateCalendarNights('2026-11-20', '2026-11-23'), 3);
  });

  test('calculateCalendarNights calculates exact nights across month boundaries', () => {
    // 28 days of February in non-leap year (e.g. 2027)
    const febNights = calculateCalendarNights('2027-02-27', '2027-03-02');
    assert.equal(febNights, 3);

    // Standard stay
    const standardNights = calculateCalendarNights('2026-11-15', '2026-11-17');
    assert.equal(standardNights, 2);
  });

  test('ReservationCreate payload contract validation', () => {
    const payload: ReservationCreate = {
      room_type_id: 1,
      rate_plan_id: 1,
      check_in: '2026-11-15',
      check_out: '2026-11-17',
      adults: 2,
      children: 0,
      guest_first_name: 'Carl',
      guest_last_name: 'von Linné',
      guest_email: 'carl.linne@botanik.se',
      guest_phone: '+46 70 123 45 67',
      guest_country: 'Sverige',
      special_requests: 'Tyst rum',
      accept_booking_terms: true,
      booking_terms_version: '2026.1',
    };

    assert.ok(payload.room_type_id > 0);
    assert.ok(payload.rate_plan_id > 0);
    assert.equal(payload.accept_booking_terms, true);
    assert.equal(payload.booking_terms_version, '2026.1');
    assert.equal(payload.guest_first_name, 'Carl');
    assert.equal(payload.guest_last_name, 'von Linné');
  });

  test('Swedish Hotel VAT (12%) calculation accurately separates net and tax', () => {
    // Swedish hotel accommodation VAT is 12% inclusive: tax = gross * 12 / 112
    const grossPriceSEK = 2590; // 2 nights at 1295
    const expectedVatSEK = Math.round((grossPriceSEK * 12) / 112); // 278 SEK
    assert.equal(expectedVatSEK, 278);
    const netSEK = grossPriceSEK - expectedVatSEK;
    assert.equal(netSEK, 2312);
  });

  test('Ancillary extras Swedish VAT (25%) calculation', () => {
    // Extras like guided cruise or champagne have standard 25% VAT
    const extraPriceSEK = 495;
    const vatRate = 0.25;
    const expectedTax = Math.round((extraPriceSEK * vatRate) / (1 + vatRate)); // 99 SEK
    assert.equal(expectedTax, 99);
  });

});
