import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateRoomTypeSlug,
  validateRoomTypeFields,
  RoomTypePayload,
} from './roomTypeTypes.js';

describe('Room Type Pure Logic & Schema Tests', () => {
  it('generates clean URL-safe slugs with Scandinavian diacritics normalized', () => {
    assert.equal(generateRoomTypeSlug('Superior Double'), 'superior-double');
    assert.equal(
      generateRoomTypeSlug('Nordic Fjäll Suite & Spa'),
      'nordic-fjall-suite-spa'
    );
    assert.equal(generateRoomTypeSlug('  Åre Deluxe Penthouse  '), 'are-deluxe-penthouse');
  });

  it('validates required room type name and enforces 120 character limit', () => {
    const emptyErrors = validateRoomTypeFields({
      name: '',
      max_occupancy: 2,
      bed_configuration: { queen_bed: 1 },
    });
    assert.equal(emptyErrors.name, 'Room type name is required');

    const tooLongName = 'A'.repeat(121);
    const longErrors = validateRoomTypeFields({
      name: tooLongName,
      max_occupancy: 2,
      bed_configuration: { queen_bed: 1 },
    });
    assert.match(longErrors.name, /cannot exceed 120 characters/);
  });

  it('validates max occupancy integer boundary (1 <= occupancy <= 32767)', () => {
    const zeroOccupancy = validateRoomTypeFields({
      name: 'Deluxe Room',
      max_occupancy: 0,
      bed_configuration: { king_bed: 1 },
    });
    assert.equal(
      zeroOccupancy.max_occupancy,
      'Max occupancy must be an integer between 1 and 32,767'
    );

    const negativeOccupancy = validateRoomTypeFields({
      name: 'Deluxe Room',
      max_occupancy: -2,
      bed_configuration: { king_bed: 1 },
    });
    assert.equal(
      negativeOccupancy.max_occupancy,
      'Max occupancy must be an integer between 1 and 32,767'
    );

    const excessiveOccupancy = validateRoomTypeFields({
      name: 'Deluxe Room',
      max_occupancy: 35000,
      bed_configuration: { king_bed: 1 },
    });
    assert.equal(
      excessiveOccupancy.max_occupancy,
      'Max occupancy must be an integer between 1 and 32,767'
    );

    const validOccupancy = validateRoomTypeFields({
      name: 'Deluxe Room',
      max_occupancy: 4,
      bed_configuration: { king_bed: 1 },
    });
    assert.equal(validOccupancy.max_occupancy, undefined);
  });

  it('validates bed_configuration is an object and not null or array', () => {
    const invalidConfig = validateRoomTypeFields({
      name: 'Deluxe Room',
      max_occupancy: 2,
      bed_configuration: 'invalid-string' as any,
    });
    assert.equal(
      invalidConfig.bed_configuration,
      'Bed configuration must be a valid JSON object'
    );

    const validConfig = validateRoomTypeFields({
      name: 'Deluxe Room',
      max_occupancy: 2,
      bed_configuration: { king_bed: 1, sofa_bed: 1 },
    });
    assert.equal(validConfig.bed_configuration, undefined);
  });

  it('validates size_sqm is a positive decimal number when provided', () => {
    const invalidSize = validateRoomTypeFields({
      name: 'Deluxe Room',
      max_occupancy: 2,
      bed_configuration: { king_bed: 1 },
      size_sqm: 'abc',
    });
    assert.equal(invalidSize.size_sqm, 'Room size must be a valid positive number');

    const validSize = validateRoomTypeFields({
      name: 'Deluxe Room',
      max_occupancy: 2,
      bed_configuration: { king_bed: 1 },
      size_sqm: '28.50',
    });
    assert.equal(validSize.size_sqm, undefined);

    const emptySize = validateRoomTypeFields({
      name: 'Deluxe Room',
      max_occupancy: 2,
      bed_configuration: { king_bed: 1 },
      size_sqm: null,
    });
    assert.equal(emptySize.size_sqm, undefined);
  });
});
