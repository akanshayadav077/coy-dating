import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services/api.js';

const BATCH_SIZE = 20;
const REFILL_THRESHOLD = 3;
const EXIT_ANIMATION_MS = 300;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function useDiscoverDeck({ onMatch }) {
  const [queue, setQueue] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [status, setStatus] = useState('loading');
  const [loadError, setLoadError] = useState(null);
  const [exitDirection, setExitDirection] = useState(null);
  const [swipeError, setSwipeError] = useState(null);
  const [newMatch, setNewMatch] = useState(null);
  const isFetching = useRef(false);

  const fetchProfiles = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const { profiles, remaining } = await api.getFeed(BATCH_SIZE);
      setQueue((current) => {
        const queuedIds = new Set(current.map((profile) => profile.id));
        return [...current, ...profiles.filter((profile) => !queuedIds.has(profile.id))];
      });
      setHasMore(remaining > 0);
      setStatus('ready');
    } catch (error) {
      setLoadError(error);
      setStatus((current) => (current === 'loading' ? 'error' : current));
    } finally {
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    if (status === 'loading' || (status === 'ready' && hasMore && queue.length < REFILL_THRESHOLD)) {
      fetchProfiles();
    }
  }, [status, hasMore, queue.length, fetchProfiles]);

  const swipe = useCallback(
    async (action) => {
      const profile = queue[0];
      if (!profile || exitDirection) return;

      setExitDirection(action);
      setSwipeError(null);
      try {
        const [{ match }] = await Promise.all([api.swipe(profile.id, action), wait(EXIT_ANIMATION_MS)]);
        setQueue((current) => current.slice(1));
        if (match) {
          setNewMatch(match);
          onMatch?.(match);
        }
      } catch (error) {
        if (error.status === 409) setQueue((current) => current.slice(1));
        else setSwipeError(error.message);
      } finally {
        setExitDirection(null);
      }
    },
    [queue, exitDirection, onMatch],
  );

  const retry = useCallback(() => {
    setStatus('loading');
    setLoadError(null);
  }, []);

  return {
    status,
    loadError,
    current: queue[0],
    next: queue[1],
    hasMore,
    exitDirection,
    swipeError,
    newMatch,
    swipe,
    retry,
    dismissMatch: () => setNewMatch(null),
  };
}
