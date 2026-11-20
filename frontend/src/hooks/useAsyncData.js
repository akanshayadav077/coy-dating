import { useCallback, useEffect, useState } from 'react';

export function useAsyncData(load) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;
    setState({ status: 'loading', data: null, error: null });
    load()
      .then((data) => isActive && setState({ status: 'success', data, error: null }))
      .catch((error) => isActive && setState({ status: 'error', data: null, error }));
    return () => {
      isActive = false;
    };
  }, [load, attempt]);

  const reload = useCallback(() => setAttempt((count) => count + 1), []);
  return { ...state, reload };
}
