const BASE = '/api';

async function request(path, options) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    const err = new Error('Cannot reach the server. Check that the backend is running.');
    err.status = 0;
    throw err;
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

export const fetchFeed = () => request('/feed');

export const fetchMatches = () => request('/matches');

export const swipeProfile = (profileId, direction) =>
  request('/swipe', { method: 'POST', body: JSON.stringify({ profileId, direction }) });
