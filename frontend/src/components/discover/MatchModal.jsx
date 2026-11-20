import { useEffect, useRef } from 'react';
import Button from '../shared/Button.jsx';
import Icon from '../shared/Icon.jsx';
import ProfilePhoto from '../shared/ProfilePhoto.jsx';
import { classNames } from '../../utils/classNames.js';
import styles from './MatchModal.module.css';

export default function MatchModal({ me, profile, onContinue, onViewMatches }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="match-title" onClose={onContinue}>
      <div className={styles.sparkles} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className={styles.photos}>
        <div className={classNames(styles.photo, styles.left)}>
          <ProfilePhoto src={me.photoUrl} name={me.name} priority />
        </div>
        <div className={classNames(styles.photo, styles.right)}>
          <ProfilePhoto src={profile.photoUrl} name={profile.name} priority />
        </div>
        <span className={styles.heart}>
          <Icon name="heart" size={28} filled />
        </span>
      </div>
      <h2 id="match-title" className={styles.title}>
        It’s a match!
      </h2>
      <p className={styles.message}>You and {profile.name} liked each other.</p>
      <div className={styles.actions}>
        <Button onClick={onViewMatches} autoFocus>
          Say hi in Matches
        </Button>
        <Button variant="secondary" onClick={onContinue}>
          Keep discovering
        </Button>
      </div>
    </dialog>
  );
}
