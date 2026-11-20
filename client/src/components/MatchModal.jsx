import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import ProfileImage from './ProfileImage.jsx';

export default function MatchModal({ match, onKeepSwiping, onViewMatches }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onKeepSwiping();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKeepSwiping]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
    >
      <motion.div
        className="w-full max-w-[360px] rounded-3xl border-2 border-ink bg-pink p-6 text-center text-white shadow-nb-lg"
        initial={{ scale: 0.8, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      >
        <div className="relative mb-6 flex items-center justify-center">
          <div className="z-0 -mr-4 flex h-28 w-28 items-center justify-center rounded-full border-2 border-ink bg-yellow text-2xl font-extrabold text-ink shadow-nb">
            You
          </div>
          <ProfileImage
            src={match.photo_url}
            name={match.name}
            className="z-0 -ml-4 h-28 w-28 rounded-full border-2 border-ink object-cover shadow-nb"
          />
          <span className="absolute left-1/2 top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-green text-ink shadow-nb">
            <Heart size={22} strokeWidth={2.5} fill="currentColor" aria-hidden="true" />
          </span>
        </div>

        <h2 id="match-title" className="text-4xl">
          It&rsquo;s a match!
        </h2>
        <p className="mt-2 text-base font-bold">
          You and {match.name} liked each other. Say hi before the moment passes.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button type="button" onClick={onViewMatches} className="nb-btn bg-green text-ink">
            View Matches
          </button>
          <button type="button" onClick={onKeepSwiping} className="nb-btn bg-white text-ink">
            Keep Swiping
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
