import ErrorState from './components/shared/ErrorState.jsx';
import LoadingState from './components/shared/LoadingState.jsx';
import AppShell from './AppShell.jsx';
import { useAccount } from './hooks/useAccount.js';
import LoginPage from './pages/LoginPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';

export default function App() {
  const { status, error, retry } = useAccount();

  if (status === 'loading') return <LoadingState label="Loading" />;
  if (status === 'error') return <ErrorState message={error.message} onRetry={retry} />;
  if (status === 'loggedOut') return <LoginPage />;
  if (status === 'needsName') return <OnboardingPage />;
  return <AppShell />;
}
