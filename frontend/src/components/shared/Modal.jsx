import { useEffect, useId, useRef } from 'react';
import Icon from './Icon.jsx';
import styles from './Modal.module.css';

export function ModalActions({ children }) {
  return <div className={styles.actions}>{children}</div>;
}

export default function Modal({ title, onClose, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal();
  }, []);

  const closeOnBackdropClick = (event) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} onClose={onClose} onClick={closeOnBackdropClick}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
