import { EyeOff } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-ink bg-white px-5 py-3">
      <h1 className="text-3xl leading-none">
        coy<span className="text-pink">.</span>
      </h1>
      <span className="nb-pill bg-yellow">
        <EyeOff size={14} strokeWidth={2.5} aria-hidden="true" />
        100% anonymous
      </span>
    </header>
  );
}
