import { describe, expect, it } from 'vitest';
import { formatRelativeTime } from './formatRelativeTime.js';

describe('formatRelativeTime', () => {
  const now = new Date('2026-11-17T12:00:00Z').getTime();

  it('formats minutes', () => {
    expect(formatRelativeTime('2026-11-17T11:55:00Z', now)).toBe('5 minutes ago');
  });

  it('formats hours', () => {
    expect(formatRelativeTime('2026-11-17T09:00:00Z', now)).toBe('3 hours ago');
  });

  it('formats days', () => {
    expect(formatRelativeTime('2026-11-15T12:00:00Z', now)).toBe('2 days ago');
  });
});
