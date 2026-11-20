import { useCallback, useEffect, useRef, useState } from 'react';

const RESET_AFTER_MS = 2000;

export function useCopyToClipboard() {
  const [status, setStatus] = useState('idle');
  const timeout = useRef(null);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setStatus('idle'), RESET_AFTER_MS);
  }, []);

  return { status, copy };
}
