import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/shared/EmptyState.jsx';
import ErrorState from '../components/shared/ErrorState.jsx';
import LoadingState from '../components/shared/LoadingState.jsx';
import MatchCard from '../components/matches/MatchCard.jsx';
import MatchChatModal from '../components/matches/MatchChatModal.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { api } from '../services/api.js';
import styles from './MatchesPage.module.css';

export default function MatchesPage() {
  const { status, data, error, reload } = useAsyncData(api.getMatches);
  const [activeMatch, setActiveMatch] = useState(null);
  const navigate = useNavigate();

  function renderContent() {
    if (status === 'loading') return <LoadingState label="Loading your matches" />;
    if (status === 'error') return <ErrorState message={error.message} onRetry={reload} />;
    if (data.total === 0) {
      return (
        <EmptyState
          title="No matches yet"
          message="When you and someone else both like each other, they’ll show up here."
          actionLabel="Start discovering"
          onAction={() => navigate('/discover')}
        />
      );
    }
    return (
      <div className={styles.grid}>
        {data.matches.map((match) => (
          <MatchCard key={match.id} match={match} onSelect={setActiveMatch} />
        ))}
      </div>
    );
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Matches</h1>
      {renderContent()}
      {activeMatch && (
        <MatchChatModal
          match={activeMatch}
          onClose={() => setActiveMatch(null)}
          onMessageSent={reload}
        />
      )}
    </section>
  );
}
