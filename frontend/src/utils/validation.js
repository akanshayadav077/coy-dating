const NAME_PATTERN = /^[\p{L}][\p{L}\p{M} '’-]{0,29}$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export function validateFirstName(value) {
  const name = value.trim();
  if (!name) return 'Enter your first name.';
  return NAME_PATTERN.test(name) ? null : 'Use letters only, up to 30 characters.';
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'Enter your email address.';
  return EMAIL_PATTERN.test(email) && email.length <= MAX_EMAIL_LENGTH ? null : 'Enter a valid email address.';
}
