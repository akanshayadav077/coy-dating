import Icon from './Icon.jsx';
import styles from './AuthLayout.module.css';

export default function AuthLayout({ onBack, children }) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.brand}>coy</span>
          {onBack && (
            <button type="button" className={styles.back} onClick={onBack}>
              <Icon name="back" size={18} />
              Back
            </button>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
