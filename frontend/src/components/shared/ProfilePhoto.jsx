import { useState } from 'react';
import { classNames } from '../../utils/classNames.js';
import styles from './ProfilePhoto.module.css';

const getInitials = (name) =>
  name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function ProfilePhoto({ src, name, priority = false }) {
  const [status, setStatus] = useState('loading');

  const markLoadedIfCached = (image) => {
    if (image?.complete && image.naturalWidth > 0) setStatus('loaded');
  };

  if (status === 'error') {
    return (
      <div className={styles.frame} role="img" aria-label={`Photo of ${name} unavailable`}>
        <span className={styles.initials}>{getInitials(name)}</span>
      </div>
    );
  }

  return (
    <div className={styles.frame}>
      {status === 'loading' && <div className={styles.skeleton} />}
      <img
        ref={markLoadedIfCached}
        className={classNames(styles.image, status === 'loaded' && styles.loaded)}
        src={src}
        alt={`Photo of ${name}`}
        width="400"
        height="500"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable="false"
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </div>
  );
}
