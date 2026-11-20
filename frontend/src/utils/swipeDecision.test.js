import { describe, expect, it } from 'vitest';
import { decideSwipe } from './swipeDecision.js';

describe('decideSwipe', () => {
  it('likes after a long drag to the right', () => {
    expect(decideSwipe({ distance: 150, elapsedMs: 800 })).toBe('like');
  });

  it('passes after a long drag to the left', () => {
    expect(decideSwipe({ distance: -150, elapsedMs: 800 })).toBe('pass');
  });

  it('springs back after a short, slow drag', () => {
    expect(decideSwipe({ distance: 60, elapsedMs: 800 })).toBeNull();
  });

  it('commits a short but fast flick', () => {
    expect(decideSwipe({ distance: -60, elapsedMs: 80 })).toBe('pass');
  });

  it('ignores a tiny tap even when it is fast', () => {
    expect(decideSwipe({ distance: 5, elapsedMs: 5 })).toBeNull();
  });
});
