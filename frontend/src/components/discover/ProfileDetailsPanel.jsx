import Button from '../shared/Button.jsx';
import Icon from '../shared/Icon.jsx';
import InterestTag from '../shared/InterestTag.jsx';
import { classNames } from '../../utils/classNames.js';
import styles from './ProfileDetailsPanel.module.css';

export default function ProfileDetailsPanel({ profile, isOpen, onClose }) {
  const { name, age, city, college, bio, interests } = profile;

  return (
    <aside className={classNames(styles.panel, isOpen && styles.open)} aria-label={`About ${name}`}>
      <Button variant="ghost" className={styles.close} onClick={onClose}>
        Close
      </Button>
      <h2 className={styles.name}>
        {name}, {age}
      </h2>
      <p className={styles.place}>
        <Icon name="pin" size={16} />
        {city}
      </p>
      <p className={styles.bio}>{bio}</p>
      <dl className={styles.facts}>
        <dt>City</dt>
        <dd>{city}</dd>
        <dt>College</dt>
        <dd>{college}</dd>
      </dl>
      <h3 className={styles.heading}>Interests</h3>
      <ul className={styles.tags}>
        {interests.map((interest) => (
          <InterestTag key={interest} label={interest} />
        ))}
      </ul>
    </aside>
  );
}
