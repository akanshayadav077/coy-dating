import { classNames } from '../../utils/classNames.js';
import styles from './Button.module.css';

export default function Button({ variant = 'primary', fullWidth = false, className, children, ...props }) {
  return (
    <button
      type="button"
      className={classNames(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      {...props}
    >
      {children}
    </button>
  );
}
