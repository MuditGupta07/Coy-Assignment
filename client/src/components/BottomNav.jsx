import { Compass, Heart, Home } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'discover', label: 'Discover', Icon: Compass },
  { id: 'matches', label: 'Matches', Icon: Heart },
];

export default function BottomNav({ tab, onChange, matchCount }) {
  return (
    <nav
      aria-label="Main"
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t-2 border-ink bg-white px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 sm:border-x-2"
    >
      <ul className="flex items-center justify-between gap-2">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={active ? 'page' : undefined}
                className={`nav-tab relative flex w-full items-center justify-center gap-2 rounded-full border-2 px-3 py-2 text-sm font-extrabold transition-colors ${
                  active
                    ? 'border-ink bg-pink text-white shadow-nb'
                    : 'border-transparent text-slate hover:text-ink'
                }`}
              >
                <Icon size={18} strokeWidth={2.5} aria-hidden="true" />
                {label}
                {id === 'matches' && matchCount > 0 && (
                  <span
                    className={`absolute -right-1 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink px-1 text-[11px] font-extrabold leading-none ${
                      active ? 'bg-yellow text-ink' : 'bg-pink text-white'
                    }`}
                    aria-label={`${matchCount} matches`}
                  >
                    {matchCount}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
