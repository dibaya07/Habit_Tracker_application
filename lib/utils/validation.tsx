export interface ValidationResult {
  valid: boolean;
  value: string;
  error?: string;
}

const NAME_DISALLOWED_CHARS_REGEX = /[^\p{L}\s'’.-]/gu;
const NAME_VALID_PATTERN = /^[\p{L}][\p{L}\s'’.-]*[\p{L}.]$/u;
const CONSECUTIVE_NAME_PUNCTUATION = /[.'’\-]{2,}/;

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

/**
 * Filters characters while typing in a Name field so only valid name characters
 * (letters, spaces, hyphens, apostrophes, dots) can be entered.
 */
export function filterNameInput(raw: string): { sanitized: string; stripped: boolean } {
  const withoutDisallowed = raw.replace(NAME_DISALLOWED_CHARS_REGEX, '');
  const collapsedSpaces = withoutDisallowed.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
  const stripped = withoutDisallowed !== raw;
  return { sanitized: collapsedSpaces, stripped };
}

/**
 * Strips whitespace characters from email input as the user types.
 */
export function filterEmailInput(raw: string): { sanitized: string; stripped: boolean } {
  const sanitized = raw.replace(/\s+/g, '');
  return { sanitized, stripped: sanitized !== raw };
}

/**
 * Validates that a person's name contains only genuine name characters
 * (no digits, no @, no symbols/URLs) and at least 2 letters.
 */
export function validatePersonName(raw: string): ValidationResult {
  const normalized = raw.trim().replace(/\s+/g, ' ');

  if (!normalized) {
    return { valid: false, value: normalized, error: 'Please enter your full name.' };
  }

  if (/\d/.test(normalized)) {
    return {
      valid: false,
      value: normalized,
      error: 'Name cannot contain numbers.',
    };
  }

  if (NAME_DISALLOWED_CHARS_REGEX.test(normalized)) {
    NAME_DISALLOWED_CHARS_REGEX.lastIndex = 0;
    return {
      valid: false,
      value: normalized,
      error: 'Name can only contain letters, spaces, hyphens, or apostrophes.',
    };
  }
  NAME_DISALLOWED_CHARS_REGEX.lastIndex = 0;

  if (CONSECUTIVE_NAME_PUNCTUATION.test(normalized)) {
    return {
      valid: false,
      value: normalized,
      error: 'Please enter a valid name without repeated punctuation.',
    };
  }

  const letters = normalized.match(/\p{L}/gu) || [];
  if (letters.length < 2) {
    return {
      valid: false,
      value: normalized,
      error: 'Name must contain at least 2 letters.',
    };
  }

  if (!NAME_VALID_PATTERN.test(normalized)) {
    return {
      valid: false,
      value: normalized,
      error: 'Please enter a valid full name (letters only).',
    };
  }

  if (normalized.length > 80) {
    return {
      valid: false,
      value: normalized,
      error: 'Name must be 80 characters or fewer.',
    };
  }

  return { valid: true, value: normalized };
}

/**
 * Validates strict email format with proper local part, domain, and 2+ char TLD.
 */
export function validateEmailAddress(raw: string): ValidationResult {
  const normalized = raw.trim().toLowerCase();

  if (!normalized) {
    return { valid: false, value: normalized, error: 'Please enter your email address.' };
  }

  if (/\s/.test(normalized)) {
    return {
      valid: false,
      value: normalized,
      error: 'Email address cannot contain spaces.',
    };
  }

  const [localPart, domainPart, ...extra] = normalized.split('@');
  if (!localPart || !domainPart || extra.length > 0) {
    return {
      valid: false,
      value: normalized,
      error: 'Please enter a valid email address (e.g. name@example.com).',
    };
  }

  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return {
      valid: false,
      value: normalized,
      error: 'Email address format is invalid before the @ symbol.',
    };
  }

  if (domainPart.includes('..') || !domainPart.includes('.')) {
    return {
      valid: false,
      value: normalized,
      error: 'Please include a valid email domain (e.g. @gmail.com).',
    };
  }

  if (!EMAIL_PATTERN.test(normalized) || normalized.length > 254) {
    return {
      valid: false,
      value: normalized,
      error: 'Please enter a valid email address (e.g. name@example.com).',
    };
  }

  return { valid: true, value: normalized };
}
