import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateGalleryFields,
  getGalleryCategoryDisplay,
  getRoomTypeName,
  prepareGalleryFormData,
  getPreferredRoomTypeImage,
  getGalleryImagesForRoomType,
  ApiGalleryItem,
  GALLERY_CATEGORIES,
} from './galleryTypes.ts';
import { INITIAL_ADMIN_GALLERY } from '../../../data/adminMockData.ts';

test('INITIAL_ADMIN_GALLERY conforms to Swagger API schema', () => {
  assert.ok(INITIAL_ADMIN_GALLERY.length >= 8, 'Should have at least 8 seeded gallery photos');

  const validCategories = [
    'exterior',
    'interior',
    'room',
    'pool',
    'gym',
    'restaurant',
    'conference',
    'other',
  ];

  for (const item of INITIAL_ADMIN_GALLERY) {
    assert.strictEqual(typeof item.id, 'number', 'ID must be an integer');
    assert.ok(item.title.length > 2, 'Title must be provided');
    assert.ok(item.image_url.length > 5, 'image_url must be provided');
    assert.ok(item.image.length > 5, 'image must be provided');
    assert.ok(validCategories.includes(item.category), `Category ${item.category} must be in allowed enum`);
    assert.ok(item.category_display.length > 0, 'Category display must be defined');
    assert.strictEqual(typeof item.is_featured, 'boolean');
    assert.strictEqual(typeof item.is_active, 'boolean');
    assert.strictEqual(typeof item.display_order, 'number');
  }
});

test('validateGalleryFields enforces title, category, display_order, and character limits', () => {
  const emptyErrors = validateGalleryFields({});
  assert.ok(emptyErrors.title, 'Should require title');
  assert.ok(emptyErrors.image_url, 'Should require image_url');
  assert.ok(emptyErrors.category, 'Should require category');

  // Title length limit
  const tooLongTitle = 'A'.repeat(201);
  const lengthErrors = validateGalleryFields({
    title: tooLongTitle,
    image_url: 'https://example.com/test.jpg',
    category: 'room',
    display_order: 1,
  });
  assert.ok(lengthErrors.title, 'Should reject title > 200 characters');

  // Invalid category
  const invalidCategoryErrors = validateGalleryFields({
    title: 'Gothenburg Canal View',
    image_url: 'https://example.com/canal.jpg',
    category: 'unsupported_category' as any,
    display_order: 1,
  });
  assert.match(invalidCategoryErrors.category, /Invalid category/);

  // Negative display order
  const negativeOrderErrors = validateGalleryFields({
    title: 'Gothenburg Canal View',
    image_url: 'https://example.com/canal.jpg',
    category: 'exterior',
    display_order: -5,
  });
  assert.ok(negativeOrderErrors.display_order, 'Should reject negative order');

  // Valid payload
  const validErrors = validateGalleryFields({
    title: 'Gothenburg Canal View',
    image_url: 'https://example.com/canal.jpg',
    category: 'exterior',
    display_order: 1,
    is_featured: true,
  });
  assert.strictEqual(Object.keys(validErrors).length, 0, 'Valid payload should have zero errors');
});

test('prepareGalleryFormData builds FormData according to confirmed backend upload contract', () => {
  const values = {
    title: 'Superior Double River View',
    description: 'Looking toward Göta älv at sunset',
    category: 'room' as const,
    is_featured: true,
    is_active: true,
    display_order: 3,
    room_type: 4,
  };

  const formData = prepareGalleryFormData(values);
  assert.strictEqual(formData.get('title'), 'Superior Double River View');
  assert.strictEqual(formData.get('description'), 'Looking toward Göta älv at sunset');
  assert.strictEqual(formData.get('category'), 'room');
  assert.strictEqual(formData.get('is_featured'), 'true');
  assert.strictEqual(formData.get('is_active'), 'true');
  assert.strictEqual(formData.get('display_order'), '3');
  assert.strictEqual(formData.get('room_type'), '4');

  // When room_type is null, no room_type key is appended
  const generalValues = {
    ...values,
    room_type: null,
  };
  const generalFormData = prepareGalleryFormData(generalValues);
  assert.strictEqual(generalFormData.get('room_type'), null);
});

test('getPreferredRoomTypeImage prioritizes featured image then display_order', () => {
  const sampleItems: ApiGalleryItem[] = [
    {
      id: 101,
      title: 'Standard Photo 1',
      description: '',
      image_url: 'https://example.com/1.jpg',
      image: 'https://example.com/1.jpg',
      category: 'room',
      category_display: 'Guest Rooms',
      is_featured: false,
      is_active: true,
      room_type: 4,
      room_type_name: 'Superior Double',
      display_order: 1,
      created_at: '2026-10-01',
    },
    {
      id: 102,
      title: 'Featured Photo',
      description: '',
      image_url: 'https://example.com/2.jpg',
      image: 'https://example.com/2.jpg',
      category: 'room',
      category_display: 'Guest Rooms',
      is_featured: true,
      is_active: true,
      room_type: 4,
      room_type_name: 'Superior Double',
      display_order: 5,
      created_at: '2026-10-02',
    },
    {
      id: 103,
      title: 'Inactive Photo',
      description: '',
      image_url: 'https://example.com/3.jpg',
      image: 'https://example.com/3.jpg',
      category: 'room',
      category_display: 'Guest Rooms',
      is_featured: true,
      is_active: false,
      room_type: 4,
      room_type_name: 'Superior Double',
      display_order: 1,
      created_at: '2026-10-03',
    },
  ];

  // Active featured photo (#102) must win over standard lower order (#101), and inactive (#103) is excluded
  const preferred = getPreferredRoomTypeImage(4, sampleItems);
  assert.ok(preferred);
  assert.strictEqual(preferred.id, 102);

  // Linkage count
  const allForType = getGalleryImagesForRoomType(4, sampleItems);
  assert.strictEqual(allForType.length, 3);
});

test('getRoomTypeName correctly maps room type ID to catalog label', () => {
  assert.strictEqual(getRoomTypeName(4), 'Superior Double Room');
  assert.strictEqual(getRoomTypeName(5), 'Family Room');
  assert.strictEqual(getRoomTypeName(null), null);
  assert.strictEqual(getRoomTypeName(undefined), null);
});
