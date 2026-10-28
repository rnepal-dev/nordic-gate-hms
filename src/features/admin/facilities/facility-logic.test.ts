import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateFacilitySlug,
  validateFacilityFields,
  getCategoryDisplay,
  FACILITY_CATEGORIES,
} from './facilityTypes.ts';
import { INITIAL_ADMIN_FACILITIES } from '../../../data/adminMockData.ts';

test('INITIAL_ADMIN_FACILITIES conforms to API schema', () => {
  assert.ok(INITIAL_ADMIN_FACILITIES.length >= 8, 'Should have at least 8 facilities seeded');

  for (const fac of INITIAL_ADMIN_FACILITIES) {
    assert.strictEqual(typeof fac.id, 'number', 'ID must be an integer');
    assert.ok(fac.name.length > 2, 'Name must be provided');
    assert.ok(fac.slug.length > 2, 'Slug must be generated');
    assert.ok(fac.category.length > 0, 'Category must be defined');
    assert.ok(fac.category_display.length > 0, 'Category display must be defined');
    assert.strictEqual(typeof fac.is_available, 'boolean');
    assert.strictEqual(typeof fac.is_free, 'boolean');
    assert.strictEqual(typeof fac.requires_reservation, 'boolean');
    assert.strictEqual(typeof fac.display_order, 'number');
  }
});

test('generateFacilitySlug converts Swedish and special characters to URL-safe slug', () => {
  assert.strictEqual(
    generateFacilitySlug('Heated Indoor Swimming Pool'),
    'heated-indoor-swimming-pool'
  );
  assert.strictEqual(
    generateFacilitySlug('Finsk Bastu & Relax'),
    'finsk-bastu-relax'
  );
  assert.strictEqual(
    generateFacilitySlug('Café & Frukostbuffé'),
    'cafe-frukostbuffe'
  );
});

test('validateFacilityFields rejects missing required fields and accepts valid data', () => {
  const emptyErrors = validateFacilityFields({});
  assert.ok(emptyErrors.name, 'Should require name');
  assert.ok(emptyErrors.category, 'Should require category');
  assert.ok(emptyErrors.description, 'Should require description');
  assert.ok(emptyErrors.icon, 'Should require icon');

  const validErrors = validateFacilityFields({
    name: 'Outdoor Solarium',
    category: 'wellness',
    description: 'Rooftop sun terrace',
    icon: 'sun',
    is_available: true,
    is_free: true,
    requires_reservation: false,
    display_order: 10,
  });
  assert.strictEqual(Object.keys(validErrors).length, 0, 'Valid payload should have zero errors');
});

test('getCategoryDisplay resolves known categories correctly', () => {
  assert.strictEqual(getCategoryDisplay('wellness'), 'Wellness & Relaxation');
  assert.strictEqual(getCategoryDisplay('dining'), 'Breakfast & Dining');
  assert.strictEqual(getCategoryDisplay('connectivity'), 'Connectivity & Work');
});
