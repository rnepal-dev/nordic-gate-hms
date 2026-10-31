// Hotel Gallery Django REST Swagger Model Alignment

export type GalleryCategoryEnum =
  | 'exterior'
  | 'interior'
  | 'room'
  | 'pool'
  | 'gym'
  | 'restaurant'
  | 'conference'
  | 'other';

export interface GalleryCategoryOption {
  value: GalleryCategoryEnum;
  label: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryOption[] = [
  { value: 'exterior', label: 'Architecture & Exterior' },
  { value: 'interior', label: 'Lobby & Common Areas' },
  { value: 'room', label: 'Guest Rooms & Suites' },
  { value: 'pool', label: 'Indoor Heated Pool & Sauna' },
  { value: 'gym', label: 'Partner Gym & Fitness' },
  { value: 'restaurant', label: 'Restaurant & Dining' },
  { value: 'conference', label: 'Meeting Rooms & Conference' },
  { value: 'other', label: 'General Property & Details' },
];

export const getGalleryCategoryDisplay = (cat: string): string => {
  const match = GALLERY_CATEGORIES.find((c) => c.value === cat);
  if (match) return match.label;
  // Graceful fallback for legacy seed labels
  if (cat === 'rooms') return 'Guest Rooms & Suites';
  if (cat === 'dining') return 'Restaurant & Dining';
  if (cat === 'wellness') return 'Indoor Heated Pool & Sauna';
  if (cat === 'bar') return 'Bar & Cocktail Lounge';
  return cat;
};

// Initial static catalog fallback (for isolated tests without local storage)
export const ROOM_TYPES_CATALOG = [
  { id: 1, name: 'Compact Double Room' },
  { id: 2, name: 'Compact Twin Room' },
  { id: 3, name: 'Standard Twin Room' },
  { id: 4, name: 'Superior Double Room' },
  { id: 5, name: 'Family Room' },
];

export const getRoomTypeName = (
  roomTypeId?: number | null,
  dynamicCatalog?: { id: number; name: string }[]
): string | null => {
  if (!roomTypeId) return null;
  const catalog = dynamicCatalog && dynamicCatalog.length > 0 ? dynamicCatalog : ROOM_TYPES_CATALOG;
  const match = catalog.find((r) => r.id === roomTypeId);
  return match ? match.name : null;
};

// Response representation from Django REST API
export interface ApiGalleryItem {
  id: number; // read-only integer
  title: string; // required, max 200
  description: string; // editable
  image_url: string; // string URL in response; file in upload
  image: string; // read-only URI
  category: GalleryCategoryEnum; // enum
  category_display: string; // read-only
  is_featured: boolean; // editable
  is_active: boolean; // editable
  room_type: number | null; // optional foreign key to RoomType
  room_type_name: string | null; // read-only derived
  display_order: number; // integer 0 to 2,147,483,647
  created_at: string; // read-only datetime string
}

// Request payload for create/update (read-only metadata excluded)
export interface ApiGalleryPayload {
  title: string;
  description: string;
  image_url: string; // URL string for mock store or existing image
  category: GalleryCategoryEnum;
  is_featured: boolean;
  is_active: boolean;
  room_type: number | null;
  display_order: number;
}

// Form values schema for React Hook Form
export interface GalleryFormValues {
  title: string;
  description: string;
  category: GalleryCategoryEnum;
  is_featured: boolean;
  is_active: boolean;
  room_type: string; // 'null' or numeric ID string
  display_order: number;
}

// Prepare multipart/form-data payload as confirmed by Django backend
export const prepareGalleryFormData = (
  values: {
    title: string;
    description?: string;
    category: GalleryCategoryEnum;
    is_featured: boolean;
    is_active: boolean;
    display_order: number;
    room_type: number | null;
  },
  selectedImageFile?: File | null
): FormData => {
  const formData = new FormData();
  formData.append('title', values.title);
  formData.append('description', values.description || '');
  formData.append('category', values.category);
  formData.append('is_featured', String(values.is_featured));
  formData.append('is_active', String(values.is_active));
  formData.append('display_order', String(values.display_order));

  if (values.room_type !== null && values.room_type !== undefined) {
    formData.append('room_type', String(values.room_type));
  }

  if (selectedImageFile) {
    formData.append('image_url', selectedImageFile);
  }

  return formData;
};

export const validateGalleryFields = (
  data: Partial<ApiGalleryPayload>,
  hasSelectedFile?: boolean
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.title || !data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title cannot exceed 200 characters';
  }

  // Image is required: either existing image_url or a selected file
  if (!data.image_url?.trim() && !hasSelectedFile) {
    errors.image_url = 'Image is required';
  }

  const allowedCategories: GalleryCategoryEnum[] = [
    'exterior',
    'interior',
    'room',
    'pool',
    'gym',
    'restaurant',
    'conference',
    'other',
  ];

  if (!data.category) {
    errors.category = 'Category is required';
  } else if (!allowedCategories.includes(data.category)) {
    errors.category = `Invalid category "${data.category}". Must be one of: ${allowedCategories.join(', ')}`;
  }

  const order = Number(data.display_order);
  if (isNaN(order) || !Number.isInteger(order) || order < 0 || order > 2147483647) {
    errors.display_order = 'Display order must be an integer between 0 and 2,147,483,647';
  }

  return errors;
};

// Cross-Module Derivation Helpers
export const getGalleryImagesForRoomType = (
  roomTypeId: number,
  galleryItems: ApiGalleryItem[]
): ApiGalleryItem[] => {
  return galleryItems.filter((item) => item.room_type === roomTypeId);
};

export const getPreferredRoomTypeImage = (
  roomTypeId: number,
  galleryItems: ApiGalleryItem[]
): ApiGalleryItem | null => {
  const matching = galleryItems.filter(
    (item) => item.room_type === roomTypeId && item.is_active !== false
  );
  if (matching.length === 0) return null;

  // Prioritize featured images first, then by display_order ascending
  return matching.sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return a.display_order - b.display_order;
  })[0];
};
