# coy-discover

Standalone "Discover" tab for Coy: swipe profiles, get matched, review matches.

Demo Link: https://drive.google.com/file/d/1HY4YCYC9t14-wf3tyZAYUZ4NBmRg6odb/view?usp=sharing

**Stack:** React (Vite) + Tailwind + framer-motion + lucide-react · Express + better-sqlite3 · Vitest + Supertest

## Setup

Requires Node.js 18+.

```bash
# Backend (terminal 1)
cd server
npm install
npm run dev        # http://localhost:4000 (DB auto-created and seeded at server/data/coy.db)

# Frontend (terminal 2)
cd client
npm install
npm run dev        # http://localhost:5173 (proxies /api/* to the backend)
```

## Tests

```bash
cd server
npm test
```

## Notes

* Reset the demo: stop the server and delete `server/data/`; it re-seeds on next start.
* Controls: drag the card, use the Pass/Like buttons, or press the Left/Right arrow keys.
* Demo match: profiles 2 and 4 in the deck (Ananya, Isha) have already liked you.
* `liked_current_user` is internal; it is never selected into any API response.
