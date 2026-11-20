import ProfileCard from '../shared/ProfileCard.jsx';
import { useSwipeGesture } from '../../hooks/useSwipeGesture.js';
import { classNames } from '../../utils/classNames.js';
import { SWIPE } from '../../utils/constants.js';
import { DISTANCE_THRESHOLD } from '../../utils/swipeDecision.js';
import styles from './SwipeCard.module.css';

const MAX_TILT_DEGREES = 15;
const EXIT_TILT_DEGREES = 25;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function getTransform(offsetX, exitDirection) {
  if (exitDirection) {
    const sign = exitDirection === SWIPE.LIKE ? 1 : -1;
    return `translateX(${sign * 130}vw) rotate(${sign * EXIT_TILT_DEGREES}deg)`;
  }
  return `translateX(${offsetX}px) rotate(${clamp(offsetX / 12, -MAX_TILT_DEGREES, MAX_TILT_DEGREES)}deg)`;
}

export default function SwipeCard({ profile, exitDirection, onSwipe }) {
  const { offsetX, isDragging, handlers } = useSwipeGesture({ onSwipe, disabled: Boolean(exitDirection) });

  const leaning = exitDirection ?? (offsetX > 0 ? SWIPE.LIKE : SWIPE.PASS);
  const strength = exitDirection ? 1 : clamp(Math.abs(offsetX) / DISTANCE_THRESHOLD, 0, 1);

  return (
    <div
      className={classNames(styles.card, isDragging && styles.dragging)}
      style={{ transform: getTransform(offsetX, exitDirection), opacity: exitDirection ? 0 : 1 }}
      {...handlers}
    >
      <ProfileCard profile={profile} priority />
      <span className={classNames(styles.stamp, styles.like)} style={{ opacity: leaning === SWIPE.LIKE ? strength : 0 }}>
        Like
      </span>
      <span className={classNames(styles.stamp, styles.pass)} style={{ opacity: leaning === SWIPE.PASS ? strength : 0 }}>
        Pass
      </span>
    </div>
  );
}
