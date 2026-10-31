// Room Amenities Model - Exactly aligned with Django REST Swagger specification

export interface RoomAmenity {
  id: number; // integer, Read-only
  name: string; // string, Required, max 120
  slug: string; // string, Read-only (server-generated)
  icon: string; // string, max 100
  description: string; // string, max 255
  is_active: boolean; // boolean, default: true
  display_order: number; // integer, min 0, max 2147483647
}

// Request payload for create/update (read-only fields excluded)
export interface RoomAmenityPayload {
  name: string;
  icon?: string;
  description?: string;
  is_active?: boolean;
  display_order?: number;
}

// Form values schema for React Hook Form
export interface RoomAmenityFormValues {
  name: string;
  icon: string;
  description: string;
  is_active: boolean;
  display_order: number;
}

export const generateAmenitySlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const validateAmenityFields = (data: Partial<RoomAmenityPayload>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Amenity name is required';
  } else if (data.name.length > 120) {
    errors.name = `Name cannot exceed 120 characters (currently ${data.name.length})`;
  }

  if (data.icon && data.icon.length > 100) {
    errors.icon = `Icon identifier cannot exceed 100 characters (currently ${data.icon.length})`;
  }

  if (data.description && data.description.length > 255) {
    errors.description = `Description cannot exceed 255 characters (currently ${data.description.length})`;
  }

  const orderNum = Number(data.display_order);
  if (isNaN(orderNum) || !Number.isInteger(orderNum) || orderNum < 0 || orderNum > 2147483647) {
    errors.display_order = 'Display order must be an integer between 0 and 2,147,483,647';
  }

  return errors;
};
