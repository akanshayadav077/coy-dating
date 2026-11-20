import { describe, expect, it } from 'vitest';
import { formatPhone, maskPhone, toAccountPhone, validatePhone } from './phone.js';

describe('validatePhone', () => {
  it('requires a 10-digit Indian mobile number starting 6-9', () => {
    expect(validatePhone('+91', '9876543210')).toBeNull();
    expect(validatePhone('+91', '1234567890')).toMatch(/10-digit/);
    expect(validatePhone('+91', '98765')).toMatch(/10-digit/);
  });

  it('accepts 7 to 12 digits for other countries', () => {
    expect(validatePhone('+1', '5551234567')).toBeNull();
    expect(validatePhone('+1', '123')).toMatch(/7 to 12/);
  });

  it('asks for a number when empty', () => {
    expect(validatePhone('+91', '')).toMatch(/Enter your phone/);
  });
});

describe('phone formatting', () => {
  it('builds the account phone, a readable label and a masked label', () => {
    expect(toAccountPhone('+91', '9876543210')).toBe('+91 9876543210');
    expect(formatPhone('+91', '9876543210')).toBe('+91 98765 43210');
    expect(maskPhone('+91 9876543210')).toBe('+91 •••••••210');
  });
});
