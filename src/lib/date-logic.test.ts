import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseDateOnly,
  formatDateOnly,
  calculateCalendarNights,
  generateStayDates,
  validateBookingDatesCalendar,
} from './date-logic.ts';

test('parseDateOnly extracts year, month, day correctly and rejects invalid formats', () => {
  assert.deepEqual(parseDateOnly('2026-10-24'), { year: 2026, month: 10, day: 24 });
  assert.deepEqual(parseDateOnly('2026-03-29'), { year: 2026, month: 3, day: 29 });
  assert.equal(parseDateOnly('invalid-date'), null);
  assert.equal(parseDateOnly(''), null);
  assert.equal(parseDateOnly('2026-13-01'), null); // month 13 invalid
  assert.equal(parseDateOnly('2026-00-10'), null);
});

test('calculateCalendarNights computes exact nights across DST spring forward (March)', () => {
  // Sweden clocks change on last Sunday in March (23h day)
  const nights = calculateCalendarNights('2026-03-28', '2026-03-30');
  assert.equal(nights, 2);
});

test('calculateCalendarNights computes exact nights across DST autumn fallback (October)', () => {
  // Sweden clocks fall back on last Sunday in October (25h day)
  const nights = calculateCalendarNights('2026-10-24', '2026-10-26');
  assert.equal(nights, 2);
});

test('generateStayDates produces exact consecutive stay dates excluding checkout day', () => {
  const dates = generateStayDates('2026-10-24', '2026-10-27');
  assert.deepEqual(dates, ['2026-10-24', '2026-10-25', '2026-10-26']);
});

test('validateBookingDatesCalendar enforces checkout after checkin', () => {
  assert.equal(validateBookingDatesCalendar('2026-10-24', '2026-10-26').isValid, true);
  assert.equal(validateBookingDatesCalendar('2026-10-26', '2026-10-24').isValid, false);
  assert.equal(validateBookingDatesCalendar('2026-10-24', '2026-10-24').isValid, false);
});
