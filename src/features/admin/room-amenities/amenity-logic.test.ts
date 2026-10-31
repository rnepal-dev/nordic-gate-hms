import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateAmenitySlug,
  validateAmenityFields,
} from './amenityTypes.ts';
import { INITIAL_ROOM_AMENITIES } from '../../../data/adminMockData.ts';

test('INITIAL_ROOM_AMENITIES conforms to Django REST Swagger schema', () => {
  assert.ok(INITIAL_ROOM_AMENITIES.length >= 8, 'Should have at least 8 initial room amenities');

  for (const item of INITIAL_ROOM_AMENITIES) {
    assert.strictEqual(typeof item.id, 'number', 'id must be an integer');
    assert.ok(item.name.length > 0 && item.name.length <= 120, 'name length must be 1-120');
    assert.ok(item.slug.length > 0, 'slug must be non-empty');
    assert.ok(item.icon.length <= 100, 'icon must be <= 100 chars');
    assert.ok(item.description.length <= 255, 'description must be <= 255 chars');
    assert.strictEqual(typeof item.is_active, 'boolean', 'is_active must be boolean');
    assert.strictEqual(typeof item.display_order, 'number', 'display_order must be number');
    assert.ok(item.display_order >= 0 && item.display_order <= 2147483647, 'display_order within integer bounds');
  }
});

test('generateAmenitySlug handles spaces, Swedish diacritics and symbols', () => {
  assert.strictEqual(
    generateAmenitySlug('Hansgrohe Rain Shower'),
    'hansgrohe-rain-shower'
  );
  assert.strictEqual(
    generateAmenitySlug('Sjöstrand Kaffemaskin & Te'),
    'sjostrand-kaffemaskin-te'
  );
  assert.strictEqual(
    generateAmenitySlug('High-Speed Wi-Fi 6!'),
    'high-speed-wi-fi-6'
  );
});

test('validateAmenityFields enforces name required and character limits', () => {
  const emptyErrors = validateAmenityFields({});
  assert.ok(emptyErrors.name, 'Name should be required');

  const tooLongName = 'A'.repeat(121);
  const nameErrors = validateAmenityFields({ name: tooLongName });
  assert.ok(nameErrors.name, 'Name > 120 chars should be rejected');

  const tooLongDesc = 'D'.repeat(256);
  const descErrors = validateAmenityFields({ name: 'Valid Name', description: tooLongDesc });
  assert.ok(descErrors.description, 'Description > 255 chars should be rejected');

  const negativeOrder = validateAmenityFields({ name: 'Valid Name', display_order: -5 });
  assert.ok(negativeOrder.display_order, 'Negative display_order should be rejected');

  const validErrors = validateAmenityFields({
    name: 'Hansgrohe Rain Shower',
    description: 'Walk-in rain shower with thermostatic mixer',
    icon: 'bath',
    display_order: 10,
    is_active: true,
  });
  assert.strictEqual(Object.keys(validErrors).length, 0, 'Valid payload should have 0 errors');
});
