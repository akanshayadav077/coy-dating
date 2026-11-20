import styles from './SettingsRow.module.css';

export default function SettingsRow({ title, description, action }) {
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
