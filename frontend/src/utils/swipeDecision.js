import { SWIPE } from './constants.js';

export const DISTANCE_THRESHOLD = 120;
export const VELOCITY_THRESHOLD = 0.5;
export const MIN_FLICK_DISTANCE = 30;

export function decideSwipe({ distance, elapsedMs }) {
  const travelled = Math.abs(distance);
  const velocity = travelled / Math.max(elapsedMs, 1);
  const isFlick = velocity > VELOCITY_THRESHOLD && travelled > MIN_FLICK_DISTANCE;

  if (travelled <= DISTANCE_THRESHOLD && !isFlick) return null;
  return distance > 0 ? SWIPE.LIKE : SWIPE.PASS;
}
