import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRoomFields,
  PhysicalRoom,
  ROOM_STATUS_CONFIG,
} from './roomTypes.js';

describe('Physical Room Pure Logic & Schema Tests', () => {
  it('validates required room number and enforces 20 character maximum', () => {
    const emptyErrors = validateRoomFields({
      room_number: '',
      room_type: 1,
      status: 'active',
    });
    assert.equal(emptyErrors.room_number, 'Room number is required');

    const tooLongErrors = validateRoomFields({
      room_number: 'ROOM-101-SUPER-DELUXE-EXTRA-LONG',
      room_type: 1,
      status: 'active',
    });
    assert.match(tooLongErrors.room_number, /cannot exceed 20 characters/);

    const validErrors = validateRoomFields({
      room_number: '501-A',
      room_type: 1,
      status: 'active',
    });
    assert.equal(validErrors.room_number, undefined);
  });

  it('validates room type foreign key is a positive integer', () => {
    const invalidTypeErrors = validateRoomFields({
      room_number: '101',
      room_type: 0,
      status: 'active',
    });
    assert.equal(invalidTypeErrors.room_type, 'Please select a valid Room Type');

    const validTypeErrors = validateRoomFields({
      room_number: '101',
      room_type: 3,
      status: 'active',
    });
    assert.equal(validTypeErrors.room_type, undefined);
  });

  it('validates floor number boundary (0 <= floor <= 32767) when provided', () => {
    const negativeFloor = validateRoomFields({
      room_number: '101',
      room_type: 1,
      floor: -1,
    });
    assert.equal(negativeFloor.floor, 'Floor must be an integer between 0 and 32,767');

    const excessiveFloor = validateRoomFields({
      room_number: '101',
      room_type: 1,
      floor: 40000,
    });
    assert.equal(excessiveFloor.floor, 'Floor must be an integer between 0 and 32,767');

    const validFloor = validateRoomFields({
      room_number: '101',
      room_type: 1,
      floor: 4,
    });
    assert.equal(validFloor.floor, undefined);

    const nullFloor = validateRoomFields({
      room_number: '101',
      room_type: 1,
      floor: null,
    });
    assert.equal(nullFloor.floor, undefined);
  });

  it('strictly restricts status to active, maintenance, and out_of_service', () => {
    const allowed = ['active', 'maintenance', 'out_of_service'];
    allowed.forEach((status) => {
      assert.ok(ROOM_STATUS_CONFIG[status as keyof typeof ROOM_STATUS_CONFIG]);
      const res = validateRoomFields({
        room_number: '101',
        room_type: 1,
        status: status as any,
      });
      assert.equal(res.status, undefined);
    });

    // Disallowed statuses like 'occupied', 'dirty', 'vacant' must fail validation
    const disallowed = ['occupied', 'dirty', 'vacant', 'cleaning', 'reserved'];
    disallowed.forEach((status) => {
      const res = validateRoomFields({
        room_number: '101',
        room_type: 1,
        status: status as any,
      });
      assert.match(res.status, /Invalid status value/);
    });
  });
});
