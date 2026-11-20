import { useCallback, useEffect, useState } from 'react';

export function useCountdown(seconds) {
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timeout = setTimeout(() => setSecondsLeft((left) => left - 1), 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const restart = useCallback(() => setSecondsLeft(seconds), [seconds]);
  return { secondsLeft, restart };
}
