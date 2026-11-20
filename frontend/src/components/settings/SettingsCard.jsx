import styles from './SettingsCard.module.css';

export default function SettingsCard({ heading, children }) {
  return (
    <section className={styles.group}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div className={styles.card}>{children}</div>
    </section>
  );
}
