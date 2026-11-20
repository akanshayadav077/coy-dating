import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/shared/Header.jsx';
import Navbar from './components/shared/Navbar.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MatchesPage from './pages/MatchesPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { api } from './services/api.js';
import styles from './AppShell.module.css';

export default function AppShell() {
  const [matchCount, setMatchCount] = useState(0);
  const increaseMatchCount = useCallback(() => setMatchCount((count) => count + 1), []);

  useEffect(() => {
    api
      .getMatches()
      .then(({ total }) => setMatchCount(total))
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar matchCount={matchCount} />
      <main className={styles.main}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage onMatch={increaseMatchCount} />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/i/:code" element={<Navigate to="/discover" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
