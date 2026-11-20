import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/shared/EmptyState.jsx';
import ErrorState from '../components/shared/ErrorState.jsx';
import LoadingState from '../components/shared/LoadingState.jsx';
import MatchModal from '../components/discover/MatchModal.jsx';
import ProfileDetailsPanel from '../components/discover/ProfileDetailsPanel.jsx';
import SwipeActions from '../components/discover/SwipeActions.jsx';
import SwipeDeck from '../components/discover/SwipeDeck.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { useDiscoverDeck } from '../hooks/useDiscoverDeck.js';
import { api } from '../services/api.js';
import { SWIPE } from '../utils/constants.js';
import styles from './DiscoverPage.module.css';

export default function DiscoverPage({ onMatch }) {
  const deck = useDiscoverDeck({ onMatch });
  const me = useAsyncData(api.getMe);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const navigate = useNavigate();
  const { swipe, newMatch } = deck;

  useEffect(() => {
    const onKeyDown = (event) => {
      if (newMatch) return;
      if (event.key === 'ArrowRight') swipe(SWIPE.LIKE);
      if (event.key === 'ArrowLeft') swipe(SWIPE.PASS);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [swipe, newMatch]);

  if (deck.status === 'loading') return <LoadingState label="Finding people for you" />;
  if (deck.status === 'error') return <ErrorState message={deck.loadError.message} onRetry={deck.retry} />;
  if (!deck.current && deck.hasMore) return <LoadingState label="Finding more people" />;
  if (!deck.current) {
    return (
      <EmptyState
        title="You’re all caught up"
        message="You’ve seen everyone for now. Check back later for new people."
        actionLabel="View matches"
        onAction={() => navigate('/matches')}
      />
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.stage}>
        <SwipeDeck current={deck.current} next={deck.next} exitDirection={deck.exitDirection} onSwipe={swipe} />
        <SwipeActions
          disabled={Boolean(deck.exitDirection)}
          onPass={() => swipe(SWIPE.PASS)}
          onLike={() => swipe(SWIPE.LIKE)}
          onInfo={() => setIsDetailsOpen((isOpen) => !isOpen)}
        />
        {deck.swipeError && (
          <p className={styles.error} role="alert">
            {deck.swipeError}
          </p>
        )}
        <p className={styles.hint}>Drag the card, use the buttons, or press ← and →</p>
      </div>
      <ProfileDetailsPanel profile={deck.current} isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} />
      {newMatch && me.data && (
        <MatchModal
          me={me.data}
          profile={newMatch.profile}
          onContinue={deck.dismissMatch}
          onViewMatches={() => navigate('/matches')}
        />
      )}
    </section>
  );
}
