import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import type { 
  RatePlan, 
  RatePlanPayload, 
  NightlyRate, 
  NightlyRatePayload,
  CancellationPolicy 
} from '../../../redux/feature/pricing/pricingTypes';

// Pure logic helper functions matching the components
export function generateRatePlanCode(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]+/g, '_')
    .slice(0, 15);
}

export function validateRatePlanPayload(payload: Partial<RatePlanPayload>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!payload.name || payload.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters');
  }
  if (!payload.code || !/^[A-Z0-9_-]+$/i.test(payload.code)) {
    errors.push('Code must contain only letters, numbers, hyphens, and underscores');
  }
  if (!payload.cancellation_policy || !['flexible', 'non_refundable'].includes(payload.cancellation_policy)) {
    errors.push('Invalid cancellation policy');
  }
  if (payload.cancellation_policy === 'flexible') {
    if (payload.free_cancellation_deadline_hours === null || payload.free_cancellation_deadline_hours === undefined) {
      errors.push('Free cancellation deadline is required for flexible policy');
    } else if (payload.free_cancellation_deadline_hours < 0) {
      errors.push('Free cancellation deadline must be >= 0 hours');
    }
  } else if (payload.cancellation_policy === 'non_refundable') {
    if (payload.free_cancellation_deadline_hours !== null && payload.free_cancellation_deadline_hours !== undefined) {
      errors.push('Free cancellation deadline must be null for non-refundable policy');
    }
  }
  if (!Array.isArray(payload.room_types) || payload.room_types.length === 0) {
    errors.push('At least one room type ID must be selected');
  } else if (!payload.room_types.every((id) => typeof id === 'number' && Number.isInteger(id) && id > 0)) {
    errors.push('Room types must be an array of positive numeric IDs');
  }

  return { isValid: errors.length === 0, errors };
}

export function formatDecimalPrice(input: string | number): string {
  const str = input.toString().trim().replace(',', '.');
  const num = parseFloat(str);
  if (isNaN(num) || num <= 0) return '0.00';
  return num.toFixed(2);
}

export function validateNightlyRatePayload(payload: Partial<NightlyRatePayload>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!payload.room_type || typeof payload.room_type !== 'number' || payload.room_type <= 0) {
    errors.push('Room type must be a positive integer ID');
  }
  if (!payload.rate_plan || typeof payload.rate_plan !== 'number' || payload.rate_plan <= 0) {
    errors.push('Rate plan must be a positive integer ID');
  }
  if (!payload.stay_date || !/^\d{4}-\d{2}-\d{2}$/.test(payload.stay_date)) {
    errors.push('Stay date must be in YYYY-MM-DD format');
  }
  if (!payload.price || !/^\d+(\.\d{1,2})?$/.test(payload.price) || parseFloat(payload.price) <= 0) {
    errors.push('Price must be a valid positive decimal string');
  }
  if (!payload.minimum_stay || typeof payload.minimum_stay !== 'number' || payload.minimum_stay < 1) {
    errors.push('Minimum stay must be an integer >= 1');
  }
  if (typeof payload.is_closed_to_arrival !== 'boolean') {
    errors.push('is_closed_to_arrival must be a boolean');
  }
  if (typeof payload.is_closed_to_departure !== 'boolean') {
    errors.push('is_closed_to_departure must be a boolean');
  }

  return { isValid: errors.length === 0, errors };
}

export function isRoomTypeCompatibleWithRatePlan(ratePlan: { room_types: number[] }, roomTypeId: number): boolean {
  if (!ratePlan || !Array.isArray(ratePlan.room_types) || ratePlan.room_types.length === 0) {
    return true;
  }
  return ratePlan.room_types.includes(roomTypeId);
}

describe('Admin Pricing & Rate Plan Management Logic', () => {

  test('generateRatePlanCode converts plan names into slug-style uppercase codes', () => {
    assert.equal(generateRatePlanCode('Flexible Heritage Rate'), 'FLEXIBLE_HERITA');
    assert.equal(generateRatePlanCode('15% Advance Purchase'), '15_ADVANCE_PURC');
    assert.equal(generateRatePlanCode('Gourmet & Spa Weekend!'), 'GOURMET_SPA_WEE');
  });

  test('validateRatePlanPayload enforces required fields and cancellation policy rules', () => {
    // Valid flexible plan
    const validFlex: RatePlanPayload = {
      name: 'Flexible Heritage Rate',
      code: 'FLEX',
      description: 'Free cancellation up to 24h prior to arrival.',
      cancellation_policy: 'flexible',
      free_cancellation_deadline_hours: 24,
      breakfast_included: true,
      pool_included: true,
      is_active: true,
      room_types: [1, 2, 3, 4, 5],
    };
    const res1 = validateRatePlanPayload(validFlex);
    assert.equal(res1.isValid, true);
    assert.equal(res1.errors.length, 0);

    // Valid non-refundable plan
    const validNonRef: RatePlanPayload = {
      name: 'Non-Refundable Saver',
      code: 'NONREF',
      cancellation_policy: 'non_refundable',
      free_cancellation_deadline_hours: null,
      breakfast_included: true,
      pool_included: false,
      is_active: true,
      room_types: [1, 2],
    };
    const res2 = validateRatePlanPayload(validNonRef);
    assert.equal(res2.isValid, true);

    // Invalid: non-refundable with deadline hours
    const invalidNonRef = {
      ...validNonRef,
      free_cancellation_deadline_hours: 48,
    };
    const res3 = validateRatePlanPayload(invalidNonRef);
    assert.equal(res3.isValid, false);
    assert.ok(res3.errors.some((e) => e.includes('null for non-refundable')));

    // Invalid: flexible with null deadline hours
    const invalidFlex = {
      ...validFlex,
      free_cancellation_deadline_hours: null,
    };
    const res4 = validateRatePlanPayload(invalidFlex);
    assert.equal(res4.isValid, false);
    assert.ok(res4.errors.some((e) => e.includes('Free cancellation deadline is required')));
  });

  test('validateRatePlanPayload strictly requires numeric room type IDs and rejects objects', () => {
    const invalidPayload: any = {
      name: 'Heritage Rate',
      code: 'HERITAGE',
      cancellation_policy: 'flexible',
      free_cancellation_deadline_hours: 24,
      breakfast_included: true,
      pool_included: true,
      is_active: true,
      room_types: [{ id: 1, name: 'Double' }, { id: 2, name: 'Twin' }], // Invalid: objects instead of numeric IDs
    };
    const res = validateRatePlanPayload(invalidPayload);
    assert.equal(res.isValid, false);
    assert.ok(res.errors.some((e) => e.includes('array of positive numeric IDs')));
  });

  test('formatDecimalPrice produces clean two-decimal monetary string representation', () => {
    assert.equal(formatDecimalPrice('1295'), '1295.00');
    assert.equal(formatDecimalPrice('1295.5'), '1295.50');
    assert.equal(formatDecimalPrice('1295,50'), '1295.50');
    assert.equal(formatDecimalPrice(2150), '2150.00');
    assert.equal(formatDecimalPrice('invalid'), '0.00');
  });

  test('validateNightlyRatePayload validates stay date format, decimal price, and constraints', () => {
    const validRate: NightlyRatePayload = {
      room_type: 4,
      rate_plan: 1,
      stay_date: '2026-11-15',
      price: '2150.00',
      currency: 'SEK',
      minimum_stay: 1,
      is_closed_to_arrival: false,
      is_closed_to_departure: false,
    };
    const res1 = validateNightlyRatePayload(validRate);
    assert.equal(res1.isValid, true);
    assert.equal(res1.errors.length, 0);

    // Invalid stay date
    const invalidDate = { ...validRate, stay_date: '15-11-2026' };
    const res2 = validateNightlyRatePayload(invalidDate);
    assert.equal(res2.isValid, false);
    assert.ok(res2.errors.some((e) => e.includes('YYYY-MM-DD')));

    // Invalid price
    const invalidPrice = { ...validRate, price: 'free' };
    const res3 = validateNightlyRatePayload(invalidPrice);
    assert.equal(res3.isValid, false);
    assert.ok(res3.errors.some((e) => e.includes('valid positive decimal string')));

    // Minimum stay < 1
    const invalidMinStay = { ...validRate, minimum_stay: 0 };
    const res4 = validateNightlyRatePayload(invalidMinStay);
    assert.equal(res4.isValid, false);
    assert.ok(res4.errors.some((e) => e.includes('integer >= 1')));
  });

  test('isRoomTypeCompatibleWithRatePlan correctly validates room applicability', () => {
    const gourmetPlan = { room_types: [3, 4, 5] };

    // Standard Twin (3), Superior Double (4), Family Room (5) are compatible
    assert.equal(isRoomTypeCompatibleWithRatePlan(gourmetPlan, 3), true);
    assert.equal(isRoomTypeCompatibleWithRatePlan(gourmetPlan, 4), true);
    assert.equal(isRoomTypeCompatibleWithRatePlan(gourmetPlan, 5), true);

    // Compact Double (1) is outside scope
    assert.equal(isRoomTypeCompatibleWithRatePlan(gourmetPlan, 1), false);

    // Unrestricted plan (empty or all) allows all room types
    assert.equal(isRoomTypeCompatibleWithRatePlan({ room_types: [] }, 1), true);
  });

});
