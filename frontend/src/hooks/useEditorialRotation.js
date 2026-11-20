import { useCallback, useEffect, useRef, useState } from 'react';

const ROTATION_INTERVAL_MS = 9000;
const IDLE_RESUME_MS = 12000;

export function useEditorialRotation(themes) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  // Preload upcoming theme image
  useEffect(() => {
    if (!themes.length) return;
    const nextTheme = themes[(activeIndex + 1) % themes.length];
    if (!nextTheme?.imageUrl) return;
    const img = new Image();
    img.src = nextTheme.imageUrl;
  }, [activeIndex, themes]);

  // Automatic rotation timer
  useEffect(() => {
    if (prefersReducedMotion || isPaused || themes.length <= 1) return undefined;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % themes.length);
    }, ROTATION_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [prefersReducedMotion, isPaused, themes.length]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, IDLE_RESUME_MS);
  }, []);

  const selectTheme = useCallback(
    (index) => {
      setActiveIndex(index);
      setIsPaused(true);
      scheduleResume();
    },
    [scheduleResume],
  );

  const pauseTemporarily = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
  }, []);

  const resumeAfterIdle = useCallback(() => {
    scheduleResume();
  }, [scheduleResume]);

  return {
    activeIndex,
    activeTheme: themes[activeIndex],
    isPaused,
    prefersReducedMotion,
    selectTheme,
    pauseTemporarily,
    resumeAfterIdle,
  };
}
