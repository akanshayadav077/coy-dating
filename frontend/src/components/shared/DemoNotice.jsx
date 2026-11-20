import styles from './DemoNotice.module.css';

export default function DemoNotice({ children }) {
  return (
    <p className={styles.notice}>
      <strong className={styles.badge}>Demo</strong>
      {children}
    </p>
  );
}
