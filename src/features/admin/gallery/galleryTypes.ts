// Hotel Gallery API-aligned schema definitions

export type GalleryCategoryEnum =
  | 'rooms'
  | 'exterior'
  | 'dining'
  | 'wellness'
  | 'bar'
  | 'surroundings';

export interface GalleryCategoryOption {
  value: GalleryCategoryEnum;
  label: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryOption[] = [
  { value: 'rooms', label: 'Rooms & Accommodations' },
  { value: 'exterior', label: 'Architecture & Exterior' },
  { value: 'dining', label: 'Breakfast & Restaurant' },
  { value: 'wellness', label: 'Indoor Pool & Sauna' },
  { value: 'bar', label: 'Bar & Cocktail Lounge' },
  { value: 'surroundings', label: 'Gothenburg Surroundings' },
];

export const ROOM_TYPES_CATALOG = [
  { id: 1, name: 'Compact Double Room' },
  { id: 2, name: 'Compact Twin Room' },
  { id: 3, name: 'Standard Twin Room' },
  { id: 4, name: 'Superior Double Room' },
  { id: 5, name: 'Family Room' },
];

export const getGalleryCategoryDisplay = (cat: string): string => {
  const match = GALLERY_CATEGORIES.find((c) => c.value === cat);
  return match ? match.label : cat;
};

export const getRoomTypeName = (roomTypeId?: number | null): string | null => {
  if (!roomTypeId) return null;
  const match = ROOM_TYPES_CATALOG.find((r) => r.id === roomTypeId);
  return match ? match.name : null;
};

// Response representation from server
export interface ApiGalleryItem {
  id: number; // read-only
  title: string;
  description: string;
  image_url: string;
  category: GalleryCategoryEnum;
  category_display: string; // read-only
  is_featured: boolean;
  room_type: number | null; // optional integer, nullable
  room_type_name: string | null; // read-only
  display_order: number;
  created_at: string; // read-only
}

// Request payload for create / update
export interface ApiGalleryPayload {
  title: string;
  description: string;
  image_url: string;
  category: GalleryCategoryEnum;
  is_featured: boolean;
  room_type?: number | null;
  display_order: number;
}

export const validateGalleryFields = (data: Partial<ApiGalleryPayload>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title cannot exceed 200 characters';
  }

  if (!data.image_url || !data.image_url.trim()) {
    errors.image_url = 'Image URL or selected image is required';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  const order = Number(data.display_order);
  if (isNaN(order) || !Number.isInteger(order) || order < 0) {
    errors.display_order = 'Display order must be an integer (0 or higher)';
  }

  return errors;
};
