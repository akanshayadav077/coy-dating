import { randomBytes } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateReferralCode = (length = 6) =>
  Array.from(randomBytes(length), (byte) => ALPHABET[byte % ALPHABET.length]).join('');
