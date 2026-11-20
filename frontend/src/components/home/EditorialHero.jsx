import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EDITORIAL_THEMES } from '../../data/editorialThemes.js';
import { useEditorialRotation } from '../../hooks/useEditorialRotation.js';
import { classNames } from '../../utils/classNames.js';
import Button from '../shared/Button.jsx';
import styles from './EditorialHero.module.css';

export default function EditorialHero() {
  const navigate = useNavigate();
  const { activeIndex, activeTheme, selectTheme } = useEditorialRotation(EDITORIAL_THEMES);
  const [failedImages, setFailedImages] = useState(() => new Set());
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = 0;
    if (Math.abs(dx) >= 40) {
      const next = (activeIndex + (dx < 0 ? 1 : -1) + EDITORIAL_THEMES.length) % EDITORIAL_THEMES.length;
      selectTheme(next);
    }
  };

  return (
    <section
      className={styles.hero}
      style={{ backgroundColor: activeTheme.bgColor }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Coy Editorial Home"
    >
      {EDITORIAL_THEMES.map((theme, index) => {
        const isActive = index === activeIndex;
        return (
          <div key={theme.id} className={classNames(styles.backdropLayer, isActive && styles.activeLayer)} aria-hidden="true">
            {!failedImages.has(theme.id) && (
              <img
                src={theme.imageUrl}
                alt=""
                className={classNames(styles.bgImage, isActive && styles.zooming)}
                style={{ objectPosition: theme.objPos || 'center 26%' }}
                onError={() => setFailedImages((prev) => new Set(prev).add(theme.id))}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            )}
            <div className={styles.scrim} />
          </div>
        );
      })}
      <div className={styles.content}>
        <div key={activeTheme.id} className={styles.copyBlock}>
          <span className={styles.eyebrow}>{activeTheme.eyebrow}</span>
          <h1 className={styles.headline}>{activeTheme.headline}</h1>
          <p className={styles.supporting}>{activeTheme.supportingText}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button onClick={() => navigate('/discover')}>Start Discovering</Button>
          <Button variant="secondary" onClick={() => navigate('/matches')}>Matches &amp; Gifts</Button>
        </div>
      </div>
    </section>
  );
}
