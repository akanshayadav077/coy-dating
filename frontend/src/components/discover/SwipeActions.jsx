import Icon from '../shared/Icon.jsx';
import { classNames } from '../../utils/classNames.js';
import styles from './SwipeActions.module.css';

export default function SwipeActions({ onPass, onLike, onInfo, disabled }) {
  return (
    <div className={styles.actions}>
      <button className={classNames(styles.round, styles.pass)} onClick={onPass} disabled={disabled} aria-label="Pass">
        <Icon name="close" size={28} />
      </button>
      <button className={classNames(styles.round, styles.info)} onClick={onInfo} aria-label="View details">
        <Icon name="info" size={22} />
      </button>
      <button className={classNames(styles.round, styles.like)} onClick={onLike} disabled={disabled} aria-label="Like">
        <Icon name="heart" size={30} filled />
      </button>
    </div>
  );
}
