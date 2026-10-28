// Facilities & Amenities API-aligned schema definitions

export type FacilityCategoryEnum =
  | 'wellness'
  | 'dining'
  | 'connectivity'
  | 'transport'
  | 'services'
  | 'family'
  | 'accessibility';

export interface FacilityCategoryOption {
  value: FacilityCategoryEnum;
  label: string;
}

export const FACILITY_CATEGORIES: FacilityCategoryOption[] = [
  { value: 'wellness', label: 'Wellness & Relaxation' },
  { value: 'dining', label: 'Breakfast & Dining' },
  { value: 'connectivity', label: 'Connectivity & Work' },
  { value: 'transport', label: 'Transport & Parking' },
  { value: 'services', label: 'Hotel & Front Desk Services' },
  { value: 'family', label: 'Family & Children' },
  { value: 'accessibility', label: 'Accessibility' },
];

export const getCategoryDisplay = (cat: string): string => {
  const match = FACILITY_CATEGORIES.find((c) => c.value === cat);
  return match ? match.label : cat;
};

// Response representation from server
export interface ApiFacilityItem {
  id: number; // read-only
  name: string;
  slug: string; // read-only when server-generated
  category: FacilityCategoryEnum;
  category_display: string; // read-only
  description: string;
  icon: string;
  is_available: boolean;
  is_free: boolean;
  requires_reservation: boolean;
  additional_information: string | null;
  display_order: number;
}

// Request payload for create / update
export interface ApiFacilityPayload {
  name: string;
  category: FacilityCategoryEnum;
  description: string;
  icon: string;
  is_available: boolean;
  is_free: boolean;
  requires_reservation: boolean;
  additional_information?: string | null;
  display_order: number;
}

export const generateFacilitySlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const validateFacilityFields = (data: Partial<ApiFacilityPayload>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Facility name is required';
  } else if (data.name.length > 150) {
    errors.name = 'Facility name cannot exceed 150 characters';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (!data.description || !data.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!data.icon || !data.icon.trim()) {
    errors.icon = 'Icon identifier is required';
  }

  const order = Number(data.display_order);
  if (isNaN(order) || !Number.isInteger(order) || order < 0) {
    errors.display_order = 'Display order must be an integer (0 or higher)';
  }

  return errors;
};
