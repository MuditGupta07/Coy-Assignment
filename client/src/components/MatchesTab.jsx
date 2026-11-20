import { HeartCrack, MapPin, RefreshCw } from 'lucide-react';
import ProfileImage from './ProfileImage.jsx';

function Message({ icon: Icon, title, text, actionLabel, onAction }) {
  return (
    <div className="nb-card mx-5 mt-6 flex flex-col items-center gap-3 bg-sky px-8 py-10 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-yellow shadow-nb">
        <Icon size={28} strokeWidth={2.5} aria-hidden="true" />
      </span>
      <h2 className="text-2xl">{title}</h2>
      <p className="text-sm font-bold text-slate">{text}</p>
      {actionLabel && (
        <button type="button" onClick={onAction} className="nb-btn mt-2 bg-white text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default function MatchesTab({ matches, status, onRetry }) {
  if (status === 'loading') {
    return <p className="px-5 pt-8 text-center text-sm font-bold text-slate">Loading matches…</p>;
  }

  if (status === 'error') {
    return (
      <Message
        icon={RefreshCw}
        title="Can't load matches"
        text="Check that the backend is running, then try again."
        actionLabel="Try again"
        onAction={onRetry}
      />
    );
  }

  if (matches.length === 0) {
    return (
      <Message
        icon={HeartCrack}
        title="No matches yet"
        text="Like someone in Discover. When they like you back, they show up here."
      />
    );
  }

  return (
    <section className="px-5 pb-4 pt-4">
      <h2 className="mb-4 text-2xl">Your matches</h2>
      <ul className="flex flex-col gap-4">
        {matches.map((m) => (
          <li key={m.id} className="nb-card flex overflow-hidden">
            <ProfileImage
              src={m.photo_url}
              name={m.name}
              className="h-auto w-28 shrink-0 self-stretch border-r-2 border-ink object-cover"
            />
            <div className="min-w-0 p-3">
              <div className="flex items-baseline gap-2">
                <h3 className="truncate text-lg">{m.name}</h3>
                <span className="font-extrabold">{m.age}</span>
              </div>
              <p className="flex items-center gap-1 text-xs font-bold text-slate">
                <MapPin size={12} strokeWidth={2.5} aria-hidden="true" />
                {m.location}
              </p>
              <p className="mt-1.5 line-clamp-3 text-sm leading-snug">{m.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
