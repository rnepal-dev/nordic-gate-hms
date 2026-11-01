export interface CreateContactI {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Validates an email address according to standard RFC 5322 format.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates non-empty trimmed text.
 */
export function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validates contact form data and returns errors if any.
 */
export function validateContactForm(values: Partial<ContactFormValues>, lang: 'sv' | 'en' = 'en'): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!isNonEmptyString(values.name)) {
    errors.name = lang === 'sv' ? 'Vänligen ange ditt fullständiga namn.' : 'Please enter your full name.';
  }

  if (!values.email || !values.email.trim()) {
    errors.email = lang === 'sv' ? 'Vänligen ange din e-postadress.' : 'Please enter your email address.';
  } else if (!isValidEmail(values.email)) {
    errors.email = lang === 'sv' ? 'Vänligen ange en giltig e-postadress.' : 'Please enter a valid email address.';
  }

  if (!isNonEmptyString(values.subject)) {
    errors.subject = lang === 'sv' ? 'Vänligen ange ett ämne för ditt meddelande.' : 'Please enter a subject.';
  }

  if (!isNonEmptyString(values.message)) {
    errors.message = lang === 'sv' ? 'Vänligen ange ditt meddelande.' : 'Please enter your message.';
  }

  return errors;
}

/**
 * Prepares the clean, trimmed payload strictly adhering to Django CreateContactI contract.
 */
export function prepareContactPayload(values: ContactFormValues): CreateContactI {
  const payload: CreateContactI = {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    subject: values.subject.trim(),
    message: values.message.trim(),
  };

  const trimmedPhone = values.phone?.trim();
  if (trimmedPhone && trimmedPhone.length > 0) {
    payload.phone = trimmedPhone;
  }

  return payload;
}
