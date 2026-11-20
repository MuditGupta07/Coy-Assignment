import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Sparkles, X } from 'lucide-react';
import SwipeCard from './SwipeCard.jsx';
import MatchModal from './MatchModal.jsx';
import { fetchFeed, swipeProfile } from '../api/client.js';

function StateCard({ icon: Icon, title, message, actionLabel, onAction }) {
  return (
    <div className="nb-card flex h-full flex-col items-center justify-center gap-3 bg-sky px-8 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-yellow shadow-nb">
        <Icon size={28} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <h2 className="text-2xl">{title}</h2>
      <p className="text-sm font-bold text-slate">{message}</p>
      {actionLabel && (
        <button type="button" onClick={onAction} className="nb-btn mt-2 bg-white text-sm">
          <RefreshCw size={16} strokeWidth={2.5} aria-hidden="true" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default function DiscoverTab({ onMatch, onViewMatches }) {
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [exitDirection, setExitDirection] = useState('pass');
  const [match, setMatch] = useState(null);
  const [toast, setToast] = useState(null);
  const busy = useRef(false);

  const top = profiles[0];

  const loadFeed = useCallback(async () => {
    setStatus('loading');
    try {
      setProfiles(await fetchFeed());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const decide = useCallback(
    async (direction) => {
      if (busy.current || !top || match) return;
      busy.current = true;
      const profile = top;

      // Optimistically animate the card out; roll back if the server rejects it.
      setExitDirection(direction);
      setProfiles((prev) => prev.filter((p) => p.id !== profile.id));

      try {
        const result = await swipeProfile(profile.id, direction);
        if (result.matched) {
          setMatch(result.match);
          onMatch();
        }
      } catch (err) {
        // 409 means the server already has this swipe, so the card should stay gone.
        if (err.status !== 409) {
          setProfiles((prev) => [profile, ...prev]);
          setToast('Could not save that swipe. Try again.');
        }
      } finally {
        busy.current = false;
      }
    },
    [top, match, onMatch]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') decide('like');
      else if (e.key === 'ArrowLeft') decide('pass');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decide]);

  const closeMatch = useCallback(() => setMatch(null), []);

  let content;
  if (status === 'loading') {
    content = <div className="nb-card h-full animate-pulse bg-peach" aria-label="Loading profiles" />;
  } else if (status === 'error') {
    content = (
      <StateCard
        icon={RefreshCw}
        title="Can't load profiles"
        message="Check that the backend is running, then try again."
        actionLabel="Try again"
        onAction={loadFeed}
      />
    );
  } else if (!top) {
    content = (
      <StateCard
        icon={Sparkles}
        title="You've seen everyone nearby!"
        message="New people show up here as they join. Check your matches in the meantime."
        actionLabel="Refresh"
        onAction={loadFeed}
      />
    );
  } else {
    content = (
      <>
        {profiles.length > 2 && (
          <div className="absolute inset-0 translate-y-5 scale-[0.9] rounded-3xl border-2 border-ink bg-peach" />
        )}
        {profiles.length > 1 && (
          <div className="absolute inset-0 translate-y-2.5 scale-[0.95] rounded-3xl border-2 border-ink bg-sky" />
        )}
        <AnimatePresence custom={exitDirection}>
          <SwipeCard key={top.id} profile={top} direction={exitDirection} onSwipe={decide} />
        </AnimatePresence>
      </>
    );
  }

  const canSwipe = status === 'ready' && Boolean(top);

  return (
    <section className="flex flex-1 flex-col px-5 pb-4 pt-4">
      <div className="relative mb-6 min-h-[380px] flex-1">{content}</div>

      <div className="flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={() => decide('pass')}
          disabled={!canSwipe}
          aria-label="Pass"
          className="nb-btn h-16 w-16 bg-white p-0 text-pink"
        >
          <X size={32} strokeWidth={3.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => decide('like')}
          disabled={!canSwipe}
          aria-label="Like"
          className="nb-btn h-16 w-16 bg-green p-0 text-ink"
        >
          <Heart size={30} strokeWidth={3} fill="currentColor" aria-hidden="true" />
        </button>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full border-2 border-ink bg-yellow px-4 py-2 text-sm font-bold shadow-nb"
        >
          {toast}
        </div>
      )}

      <AnimatePresence>
        {match && (
          <MatchModal
            match={match}
            onKeepSwiping={closeMatch}
            onViewMatches={() => {
              closeMatch();
              onViewMatches();
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
