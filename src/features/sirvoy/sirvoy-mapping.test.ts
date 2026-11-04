import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  SIRVOY_CONFIG, 
  INITIAL_SIRVOY_MAPPINGS, 
  resolveSirvoyRoomId, 
  validateBookingCriteria 
} from '../../lib/sirvoy-config.ts';

describe('Sirvoy Integration Architecture & Mapping Tests', () => {

  it('SIRVOY_CONFIG has the verified official test widget configuration', () => {
    assert.equal(SIRVOY_CONFIG.enabled, true, 'Sirvoy live test widget enabled for development');
    assert.equal(SIRVOY_CONFIG.widgetUrl, 'https://secured.sirvoy.com/widget/sirvoy.js');
    assert.equal(SIRVOY_CONFIG.formId, '8006fb2be9f17e06');
  });

  it('INITIAL_SIRVOY_MAPPINGS contains the 5 verified room categories without fake IDs', () => {
    assert.equal(INITIAL_SIRVOY_MAPPINGS.length, 5);
    const slugs = INITIAL_SIRVOY_MAPPINGS.map(m => m.djangoRoomSlug);
    assert.deepEqual(slugs, [
      'compact-double',
      'compact-twin',
      'standard-twin',
      'superior-double',
      'family-room'
    ]);

    // All Sirvoy room IDs must remain undefined until official mapping is provided
    for (const mapping of INITIAL_SIRVOY_MAPPINGS) {
      assert.equal(mapping.sirvoyRoomTypeId, undefined, `Room ${mapping.roomName} should not have a fake Sirvoy ID`);
    }
  });

  it('resolveSirvoyRoomId safely returns null when mapping is unverified (fallback to general engine)', () => {
    assert.equal(resolveSirvoyRoomId('compact-double'), null);
    assert.equal(resolveSirvoyRoomId('superior-double'), null);
    assert.equal(resolveSirvoyRoomId(1), null);
    assert.equal(resolveSirvoyRoomId(undefined), null);
    assert.equal(resolveSirvoyRoomId(''), null);
  });

  it('validateBookingCriteria enforces strict date order and minimum adult capacity', () => {
    // Valid stay
    const valid = validateBookingCriteria({
      checkIn: '2026-11-15',
      checkOut: '2026-11-17',
      adults: 2,
      children: 0,
    });
    assert.equal(valid.isValid, true);
    assert.equal(valid.error, undefined);

    // Missing dates
    const missing = validateBookingCriteria({
      checkIn: '',
      checkOut: '2026-11-17',
      adults: 2,
    });
    assert.equal(missing.isValid, false);
    assert.match(missing.error || '', /required/i);

    // Check-out same as check-in
    const sameDay = validateBookingCriteria({
      checkIn: '2026-11-15',
      checkOut: '2026-11-15',
      adults: 2,
    });
    assert.equal(sameDay.isValid, false);
    assert.match(sameDay.error || '', /after/i);

    // Check-out before check-in
    const inverted = validateBookingCriteria({
      checkIn: '2026-11-18',
      checkOut: '2026-11-15',
      adults: 2,
    });
    assert.equal(inverted.isValid, false);
    assert.match(inverted.error || '', /after/i);

    // Invalid calendar date format
    const invalidFormat = validateBookingCriteria({
      checkIn: 'invalid-date',
      checkOut: '2026-11-17',
      adults: 1,
    });
    assert.equal(invalidFormat.isValid, false);
    assert.match(invalidFormat.error || '', /format/i);

    // Adults < 1
    const zeroAdults = validateBookingCriteria({
      checkIn: '2026-11-15',
      checkOut: '2026-11-17',
      adults: 0,
    });
    assert.equal(zeroAdults.isValid, false);
    assert.match(zeroAdults.error || '', /adult/i);

    // Large group flag (>10 guests)
    const largeGroup = validateBookingCriteria({
      checkIn: '2026-11-15',
      checkOut: '2026-11-17',
      adults: 12,
    });
    assert.equal(largeGroup.isValid, false);
    assert.match(largeGroup.error || '', /group/i);
  });
});
