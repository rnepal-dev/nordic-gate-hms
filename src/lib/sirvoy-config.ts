import type { SirvoyEmbedConfig, SirvoyRoomTypeMapping, BookingCriteriaValidation } from '../types/sirvoy.ts';

/**
 * Sirvoy Integration Configuration
 *
 * SAFETY MANDATE:
 * Keep `enabled: false` until:
 * 1. Official Sirvoy JS installation snippet is supplied from Sirvoy Web Tools.
 * 2. Room category identifiers in Sirvoy are verified.
 * 3. Rate plans, prices, channels, and Stripe are verified.
 * 4. Hotel owner grants launch approval.
 */
export const SIRVOY_CONFIG: SirvoyEmbedConfig = {
  enabled: true,
  widgetUrl: 'https://secured.sirvoy.com/widget/sirvoy.js',
  formId: '8006fb2be9f17e06',
  accountId: undefined,
  mappings: {
    // Conceptual mapping skeleton: Will be populated with official Sirvoy IDs
    // 'compact-double': 'SIRVOY_ID_COMPACT_DOUBLE',
    // 'compact-twin': 'SIRVOY_ID_COMPACT_TWIN',
    // 'standard-twin': 'SIRVOY_ID_STANDARD_TWIN',
    // 'superior-double': 'SIRVOY_ID_SUPERIOR_DOUBLE',
    // 'family-room': 'SIRVOY_ID_FAMILY_ROOM',
  },
};

export const INITIAL_SIRVOY_MAPPINGS: SirvoyRoomTypeMapping[] = [
  {
    djangoRoomTypeId: 1,
    djangoRoomSlug: 'compact-double',
    sirvoyRoomTypeId: undefined,
    roomName: 'Compact Double Room',
    maxOccupancy: 2,
  },
  {
    djangoRoomTypeId: 2,
    djangoRoomSlug: 'compact-twin',
    sirvoyRoomTypeId: undefined,
    roomName: 'Compact Twin Room',
    maxOccupancy: 2,
  },
  {
    djangoRoomTypeId: 3,
    djangoRoomSlug: 'standard-twin',
    sirvoyRoomTypeId: undefined,
    roomName: 'Standard Twin Room',
    maxOccupancy: 2,
  },
  {
    djangoRoomTypeId: 4,
    djangoRoomSlug: 'superior-double',
    sirvoyRoomTypeId: undefined,
    roomName: 'Superior Double Room',
    maxOccupancy: 3,
  },
  {
    djangoRoomTypeId: 5,
    djangoRoomSlug: 'family-room',
    sirvoyRoomTypeId: undefined,
    roomName: 'Family Room',
    maxOccupancy: 4,
  },
];

/**
 * Resolves a Sirvoy room identifier from a Django slug or numeric ID.
 * Falls back to null if no verified mapping is registered.
 */
export function resolveSirvoyRoomId(djangoSlugOrId: string | number | undefined | null): string | null {
  if (!djangoSlugOrId) return null;

  const key = String(djangoSlugOrId).toLowerCase().trim();
  const direct = SIRVOY_CONFIG.mappings[key];
  if (direct && direct.trim().length > 0) {
    return direct;
  }

  // Check structured list
  const match = INITIAL_SIRVOY_MAPPINGS.find(
    m => m.djangoRoomSlug === key || (m.djangoRoomTypeId !== undefined && String(m.djangoRoomTypeId) === key)
  );

  return match?.sirvoyRoomTypeId || null;
}

/**
 * Validates search criteria before navigating or passing to booking engine.
 */
export function validateBookingCriteria(criteria: {
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
}): BookingCriteriaValidation {
  const { checkIn, checkOut, adults = 1, children = 0 } = criteria;

  if (!checkIn || !checkOut) {
    return { isValid: false, error: 'Both check-in and check-out dates are required.' };
  }

  const inDate = new Date(checkIn + 'T00:00:00');
  const outDate = new Date(checkOut + 'T00:00:00');

  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
    return { isValid: false, error: 'Invalid calendar date format.' };
  }

  if (outDate.getTime() <= inDate.getTime()) {
    return { isValid: false, error: 'Check-out date must be after check-in date.' };
  }

  if (adults < 1) {
    return { isValid: false, error: 'At least one adult guest is required.' };
  }

  if (adults > 10 || children > 10) {
    return { isValid: false, error: 'For group bookings exceeding 10 guests, please contact our front desk.' };
  }

  return { isValid: true };
}
