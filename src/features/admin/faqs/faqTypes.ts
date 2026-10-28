// API-aligned FAQ types matching backend schema
export interface ApiFaqPayload {
  question: string;
  answer: string;
  category?: string;
  display_order: number;
}

export interface ApiFaqItem {
  id: number; // integer, read-only
  question: string; // required string, max 300 chars
  answer: string; // required string
  category?: string; // optional string, max 100 chars
  display_order: number; // integer, min 0, max 2147483647
  created_at?: string; // read-only
  updated_at?: string; // read-only
}

// Admin presentation model (aligns with API model, includes demo presentation helpers)
export interface AdminFaq extends ApiFaqItem {
  // Demo presentation helpers (not included in API payloads)
  questionSv?: string;
  answerSv?: string;
  status?: 'published' | 'draft' | 'archived';
  author?: string;
  updatedAt?: string;
}

export const FAQ_CATEGORIES = [
  { value: 'check_in_out', label: 'Check-in & Check-out' },
  { value: 'dining', label: 'Breakfast & Dining' },
  { value: 'wellness', label: 'Pool & Wellness' },
  { value: 'parking', label: 'Parking & Transport' },
  { value: 'pets', label: 'Pets & Families' },
  { value: 'policies', label: 'Policies & Payments' },
  { value: 'general', label: 'General & Location' },
];

/**
 * Pure function to format clean API payload according to schema
 * Ensures unsupported fields (like status, translations, extra metadata) are not sent.
 */
export const toApiFaqPayload = (data: {
  question: string;
  answer: string;
  category?: string;
  display_order: number;
}): ApiFaqPayload => {
  return {
    question: data.question.trim().slice(0, 300),
    answer: data.answer.trim(),
    category: data.category?.trim().slice(0, 100) || undefined,
    display_order: Math.max(0, Math.min(2147483647, Math.floor(Number(data.display_order) || 0))),
  };
};

/**
 * Validates FAQ fields against exact schema requirements
 */
export const validateFaqFields = (data: {
  question: string;
  answer: string;
  category?: string;
  display_order: number;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.question || !data.question.trim()) {
    errors.question = 'Question is required';
  } else if (data.question.length > 300) {
    errors.question = `Question cannot exceed 300 characters (currently ${data.question.length})`;
  }

  if (!data.answer || !data.answer.trim()) {
    errors.answer = 'Answer is required';
  }

  if (data.category && data.category.length > 100) {
    errors.category = `Category cannot exceed 100 characters (currently ${data.category.length})`;
  }

  const orderNum = Number(data.display_order);
  if (isNaN(orderNum) || !Number.isInteger(orderNum) || orderNum < 0 || orderNum > 2147483647) {
    errors.display_order = 'Display order must be an integer between 0 and 2,147,483,647';
  }

  return errors;
};
