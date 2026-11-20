import Button from './Button.jsx';
import styles from './EmptyState.module.css';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className={styles.wrapper}>
      <svg className={styles.art} viewBox="0 0 120 80" aria-hidden="true">
        <circle cx="45" cy="40" r="30" fill="var(--color-primary-tint)" />
        <circle cx="75" cy="40" r="30" fill="none" stroke="var(--color-primary)" strokeWidth="2" />
      </svg>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
