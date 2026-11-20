import ProfilePhoto from '../shared/ProfilePhoto.jsx';
import { formatRelativeTime } from '../../utils/formatRelativeTime.js';
import styles from './MatchCard.module.css';

export default function MatchCard({ match, onSelect }) {
  const { name, age, photoUrl } = match.profile;
  const preview = match.lastMessage?.text ?? 'Tap to break the ice ✨';

  return (
    <button type="button" className={styles.card} onClick={() => onSelect?.(match)}>
      <div className={styles.photo}>
        <ProfilePhoto src={photoUrl} name={name} />
      </div>
      <div className={styles.text}>
        <h2 className={styles.name}>
          {name}, {age}
        </h2>
        <p className={styles.time}>Matched {formatRelativeTime(match.createdAt)}</p>
        <p className={styles.preview}>{preview}</p>
      </div>
    </button>
  );
}
