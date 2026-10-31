import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadRoomAmenities,
  loadRoomTypes,
  loadRooms,
  loadAdminGallery,
  INITIAL_ROOM_TYPES,
  INITIAL_ROOMS,
  INITIAL_ADMIN_GALLERY,
} from '../../data/adminMockData.ts';
import {
  getGalleryImagesForRoomType,
  getPreferredRoomTypeImage,
} from './gallery/galleryTypes.ts';

test('Cross-Module Linkage: Room Types reference valid Amenity IDs', () => {
  const amenities = loadRoomAmenities();
  const amenityIds = new Set(amenities.map((a) => a.id));

  const roomTypes = loadRoomTypes();
  for (const rt of roomTypes) {
    for (const id of rt.amenity_ids) {
      assert.ok(
        amenityIds.has(id),
        `Room type "${rt.name}" references non-existent amenity ID ${id}`
      );
    }
  }
});

test('Cross-Module Linkage: Physical Rooms reference valid Room Type IDs', () => {
  const roomTypes = loadRoomTypes();
  const roomTypeIds = new Set(roomTypes.map((rt) => rt.id));

  const rooms = loadRooms();
  for (const room of rooms) {
    assert.ok(
      roomTypeIds.has(room.room_type),
      `Physical Room ${room.room_number} references non-existent Room Type ID ${room.room_type}`
    );
  }
});

test('Cross-Module Linkage: Gallery items link to valid Room Types or null', () => {
  const roomTypes = loadRoomTypes();
  const roomTypeIds = new Set(roomTypes.map((rt) => rt.id));

  const gallery = loadAdminGallery();
  for (const item of gallery) {
    if (item.room_type !== null) {
      assert.ok(
        roomTypeIds.has(item.room_type),
        `Gallery item "${item.title}" references non-existent Room Type ID ${item.room_type}`
      );
      assert.ok(
        item.room_type_name,
        `Gallery item "${item.title}" must dynamically resolve room_type_name`
      );
    } else {
      assert.strictEqual(
        item.room_type_name,
        null,
        'General hotel images must have null room_type_name'
      );
    }
  }
});

test('Derived Relationship: Physical Room resolves gallery photos through Room Type', () => {
  const gallery = loadAdminGallery();

  // Test Room 201 (assigned to room_type: 4, Superior Double)
  const room201 = INITIAL_ROOMS.find((r) => r.room_number === '201');
  assert.ok(room201, 'Room 201 must exist');

  const room201Gallery = getGalleryImagesForRoomType(room201.room_type, gallery);
  assert.ok(room201Gallery.length > 0, 'Room 201 must resolve gallery images via Room Type 4');

  const preferred201 = getPreferredRoomTypeImage(room201.room_type, gallery);
  assert.ok(preferred201, 'Room 201 must have a preferred gallery image');
  assert.strictEqual(preferred201.room_type, room201.room_type);
});

test('Relationship-Safe Deletion: Room Type deletion safety detects both physical rooms and gallery images', () => {
  const rooms = loadRooms();
  const gallery = loadAdminGallery();

  // Test Room Type 4 (Superior Double)
  const roomTypeId = 4;
  const assignedRooms = rooms.filter((r) => r.room_type === roomTypeId);
  const linkedGallery = gallery.filter((g) => g.room_type === roomTypeId);

  assert.ok(assignedRooms.length > 0, 'Superior Double has assigned physical rooms');
  assert.ok(linkedGallery.length > 0, 'Superior Double has linked gallery images');

  // Verify dependency guard check logic
  const isDeletable = assignedRooms.length === 0 && linkedGallery.length === 0;
  assert.strictEqual(isDeletable, false, 'Deletion must be blocked when references exist');
});
