import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import HomeTab from './components/HomeTab.jsx';
import DiscoverTab from './components/DiscoverTab.jsx';
import MatchesTab from './components/MatchesTab.jsx';
import { fetchMatches } from './api/client.js';

export default function App() {
  const [tab, setTab] = useState('discover');
  const [matches, setMatches] = useState([]);
  const [matchesStatus, setMatchesStatus] = useState('loading'); // loading | ready | error

  const refreshMatches = useCallback(async () => {
    try {
      setMatches(await fetchMatches());
      setMatchesStatus('ready');
    } catch {
      setMatchesStatus('error');
    }
  }, []);

  useEffect(() => {
    refreshMatches();
  }, [refreshMatches]);

  return (
    <div className="app-shell">
      <Header />
      <main className="flex flex-1 flex-col pb-[88px]">
        {tab === 'home' && <HomeTab />}
        {tab === 'discover' && (
          <DiscoverTab onMatch={refreshMatches} onViewMatches={() => setTab('matches')} />
        )}
        {tab === 'matches' && (
          <MatchesTab matches={matches} status={matchesStatus} onRetry={refreshMatches} />
        )}
      </main>
      <BottomNav tab={tab} onChange={setTab} matchCount={matches.length} />
    </div>
  );
}
