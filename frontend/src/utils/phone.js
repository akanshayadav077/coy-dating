const INDIA_CODE = '+91';

export function validatePhone(countryCode, number) {
  if (!number) return 'Enter your phone number.';
  if (countryCode === INDIA_CODE) {
    return /^[6-9]\d{9}$/.test(number) ? null : 'Enter a valid 10-digit Indian mobile number.';
  }
  return /^\d{7,12}$/.test(number) ? null : 'Enter a valid phone number (7 to 12 digits).';
}

export const toAccountPhone = (countryCode, number) => `${countryCode} ${number}`;

export const formatPhone = (countryCode, number) => `${countryCode} ${number.replace(/^(\d{5})(\d+)$/, '$1 $2')}`;

export function maskPhone(phone) {
  const [countryCode, number = ''] = phone.split(' ');
  return `${countryCode} ${'•'.repeat(Math.max(number.length - 3, 0))}${number.slice(-3)}`;
}
