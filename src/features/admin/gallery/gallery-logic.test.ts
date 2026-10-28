import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateGalleryFields,
  getGalleryCategoryDisplay,
  getRoomTypeName,
  ROOM_TYPES_CATALOG,
} from './galleryTypes.ts';
import { INITIAL_ADMIN_GALLERY } from '../../../data/adminMockData.ts';

test('INITIAL_ADMIN_GALLERY conforms to API schema', () => {
  assert.ok(INITIAL_ADMIN_GALLERY.length >= 7, 'Should have at least 7 seeded gallery photos');

  for (const item of INITIAL_ADMIN_GALLERY) {
    assert.strictEqual(typeof item.id, 'number', 'ID must be an integer');
    assert.ok(item.title.length > 2, 'Title must be provided');
    assert.ok(item.image_url.length > 5, 'image_url must be provided');
    assert.ok(item.category.length > 0, 'Category must be defined');
    assert.ok(item.category_display.length > 0, 'Category display must be defined');
    assert.strictEqual(typeof item.is_featured, 'boolean');
    assert.strictEqual(typeof item.display_order, 'number');
  }
});

test('validateGalleryFields enforces title and image_url and character limit', () => {
  const emptyErrors = validateGalleryFields({});
  assert.ok(emptyErrors.title, 'Should require title');
  assert.ok(emptyErrors.image_url, 'Should require image_url');
  assert.ok(emptyErrors.category, 'Should require category');

  const tooLongTitle = 'A'.repeat(201);
  const lengthErrors = validateGalleryFields({
    title: tooLongTitle,
    image_url: 'https://example.com/test.jpg',
    category: 'rooms',
    display_order: 1,
  });
  assert.ok(lengthErrors.title, 'Should reject title > 200 characters');

  const validErrors = validateGalleryFields({
    title: 'Gothenburg Canal View',
    image_url: 'https://example.com/canal.jpg',
    category: 'exterior',
    display_order: 1,
    is_featured: true,
  });
  assert.strictEqual(Object.keys(validErrors).length, 0, 'Valid payload should have zero errors');
});

test('getRoomTypeName correctly maps room type ID to catalog label', () => {
  assert.strictEqual(getRoomTypeName(4), 'Superior Double Room');
  assert.strictEqual(getRoomTypeName(5), 'Family Room');
  assert.strictEqual(getRoomTypeName(null), null);
  assert.strictEqual(getRoomTypeName(undefined), null);
});
