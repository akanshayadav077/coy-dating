const FIRST_NAME_PATTERN = /^[\p{L}][\p{L}\p{M} '’-]{0,29}$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+\d{1,3} \d{6,12}$/;

export const isValidFirstName = (value) => typeof value === 'string' && FIRST_NAME_PATTERN.test(value.trim());

export const isValidEmail = (value) =>
  typeof value === 'string' && value.trim().length <= 254 && EMAIL_PATTERN.test(value.trim());

export const isValidPhone = (value) => typeof value === 'string' && PHONE_PATTERN.test(value);
