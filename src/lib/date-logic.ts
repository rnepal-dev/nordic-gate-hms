/**
 * Date-only Calendar Arithmetic utilities for Hotel Nordic Gate
 * Pure functions immune to local timezones and Daylight Saving Time (DST) shifts.
 */

export interface CalendarDateParts {
  year: number;
  month: number;
  day: number;
}

/**
 * Parses YYYY-MM-DD string into year, month, day components
 */
export function parseDateOnly(dateString: string): CalendarDateParts | null {
  if (!dateString || typeof dateString !== 'string') return null;
  const match = dateString.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

/**
 * Formats year, month, day into YYYY-MM-DD string
 */
export function formatDateOnly(parts: CalendarDateParts): string {
  const y = parts.year.toString().padStart(4, '0');
  const m = parts.month.toString().padStart(2, '0');
  const d = parts.day.toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Calculates calendar nights between two YYYY-MM-DD dates using UTC epoch days.
 * Never subject to Daylight Saving Time 23-hour or 25-hour day errors.
 */
export function calculateCalendarNights(checkIn: string, checkOut: string): number {
  const p1 = parseDateOnly(checkIn);
  const p2 = parseDateOnly(checkOut);
  if (!p1 || !p2) return 1;

  const utc1 = Date.UTC(p1.year, p1.month - 1, p1.day);
  const utc2 = Date.UTC(p2.year, p2.month - 1, p2.day);

  const diffMs = utc2 - utc1;
  const days = Math.round(diffMs / 86400000);
  return days > 0 ? days : 1;
}

/**
 * Generates an array of individual stay dates [checkIn, ..., dayBeforeCheckOut]
 */
export function generateStayDates(checkIn: string, checkOut: string): string[] {
  const p1 = parseDateOnly(checkIn);
  const p2 = parseDateOnly(checkOut);
  if (!p1 || !p2) return [checkIn];

  const dates: string[] = [];
  const startUtc = Date.UTC(p1.year, p1.month - 1, p1.day);
  const endUtc = Date.UTC(p2.year, p2.month - 1, p2.day);

  for (let current = startUtc; current < endUtc; current += 86400000) {
    const d = new Date(current);
    const y = d.getUTCFullYear();
    const m = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = d.getUTCDate().toString().padStart(2, '0');
    dates.push(`${y}-${m}-${day}`);
  }

  return dates.length > 0 ? dates : [checkIn];
}

/**
 * Validates check-in and check-out dates for hotel booking
 */
export function validateBookingDatesCalendar(checkIn: string, checkOut: string): { isValid: boolean; error?: string } {
  const p1 = parseDateOnly(checkIn);
  const p2 = parseDateOnly(checkOut);

  if (!p1) {
    return { isValid: false, error: 'Vänligen ange ett giltigt incheckningsdatum (YYYY-MM-DD)' };
  }
  if (!p2) {
    return { isValid: false, error: 'Vänligen ange ett giltigt utcheckningsdatum (YYYY-MM-DD)' };
  }

  const utc1 = Date.UTC(p1.year, p1.month - 1, p1.day);
  const utc2 = Date.UTC(p2.year, p2.month - 1, p2.day);

  if (utc2 <= utc1) {
    return { isValid: false, error: 'Utcheckningsdatumet måste vara efter incheckningsdatumet' };
  }

  return { isValid: true };
}
