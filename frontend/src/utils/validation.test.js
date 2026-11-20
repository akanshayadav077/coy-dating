import { describe, expect, it } from 'vitest';
import { validateEmail, validateFirstName } from './validation.js';

describe('validateFirstName', () => {
  it('accepts normal and non-English names', () => {
    expect(validateFirstName('Aanya')).toBeNull();
    expect(validateFirstName('  Ananya-Rose ')).toBeNull();
    expect(validateFirstName('आर्यन')).toBeNull();
  });

  it('rejects empty, numeric and overlong names', () => {
    expect(validateFirstName('   ')).toMatch(/Enter your first name/);
    expect(validateFirstName('R2D2')).toMatch(/letters only/);
    expect(validateFirstName('a'.repeat(31))).toMatch(/letters only/);
  });
});

describe('validateEmail', () => {
  it('accepts a normal address', () => {
    expect(validateEmail(' sam@example.com ')).toBeNull();
  });

  it('rejects malformed addresses', () => {
    expect(validateEmail('')).toMatch(/Enter your email/);
    expect(validateEmail('sam@')).toMatch(/valid email/);
    expect(validateEmail('sam example@x.com')).toMatch(/valid email/);
  });
});
