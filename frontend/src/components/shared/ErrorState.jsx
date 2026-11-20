import EmptyState from './EmptyState.jsx';

export default function ErrorState({ message, onRetry }) {
  return <EmptyState title="Something went wrong" message={message} actionLabel="Try again" onAction={onRetry} />;
}
