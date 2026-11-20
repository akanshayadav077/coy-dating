import ProfileCard from '../shared/ProfileCard.jsx';
import { classNames } from '../../utils/classNames.js';
import SwipeCard from './SwipeCard.jsx';
import styles from './SwipeDeck.module.css';

export default function SwipeDeck({ current, next, exitDirection, onSwipe }) {
  return (
    <div className={styles.deck}>
      {next && (
        <div className={classNames(styles.behind, exitDirection && styles.rising)} aria-hidden="true">
          <ProfileCard profile={next} />
        </div>
      )}
      <SwipeCard key={current.id} profile={current} exitDirection={exitDirection} onSwipe={onSwipe} />
    </div>
  );
}
