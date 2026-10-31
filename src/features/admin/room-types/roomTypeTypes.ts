// Room Types Model - Exactly aligned with Django REST Swagger specification

export interface RoomType {
  id: number; // integer, Read-only
  name: string; // string, Required, max 120
  slug: string; // string, Read-only (server-generated)
  description: string; // string, Editable
  max_occupancy: number; // integer, Required, min 1, max 32767
  bed_configuration: Record<string, number | string>; // JSON object, Editable
  size_sqm: string | null; // nullable string, Editable
  amenities: string; // string, Read-only summary (e.g. "Wi-Fi 6, Breakfast, Rain Shower")
  amenity_ids: number[]; // unique integer array, Editable
  is_active: boolean; // boolean, Editable, default: true
  created_at: string; // datetime string, Read-only
  updated_at: string; // datetime string, Read-only
}

// Request payload for create/update (read-only fields excluded)
export interface RoomTypePayload {
  name: string; // required, max 120
  description?: string;
  max_occupancy: number; // required, min 1, max 32767
  bed_configuration: Record<string, number | string>; // JSON object
  size_sqm?: string | null; // nullable string
  amenity_ids?: number[]; // unique integer array
  is_active?: boolean;
}

// Form values schema for React Hook Form
export interface RoomTypeFormValues {
  name: string;
  description: string;
  max_occupancy: number;
  bed_configuration: Record<string, number | string>;
  size_sqm: string;
  amenity_ids: number[];
  is_active: boolean;
}

export const generateRoomTypeSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const validateRoomTypeFields = (data: Partial<RoomTypePayload>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Room type name is required';
  } else if (data.name.length > 120) {
    errors.name = `Name cannot exceed 120 characters (currently ${data.name.length})`;
  }

  const occupancy = Number(data.max_occupancy);
  if (isNaN(occupancy) || !Number.isInteger(occupancy) || occupancy < 1 || occupancy > 32767) {
    errors.max_occupancy = 'Max occupancy must be an integer between 1 and 32,767';
  }

  if (data.size_sqm !== undefined && data.size_sqm !== null && data.size_sqm.trim() !== '') {
    const parsed = parseFloat(data.size_sqm);
    if (isNaN(parsed) || parsed < 0) {
      errors.size_sqm = 'Room size must be a valid positive number';
    }
  }

  if (!data.bed_configuration || typeof data.bed_configuration !== 'object' || Array.isArray(data.bed_configuration)) {
    errors.bed_configuration = 'Bed configuration must be a valid JSON object';
  }

  return errors;
};
