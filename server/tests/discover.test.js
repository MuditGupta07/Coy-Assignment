import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { createDatabase } from '../src/db/database.js';
import { seedIfEmpty } from '../src/db/seed.js';
import { createApp } from '../src/app.js';

let db;
let app;

const idWhere = (liked) =>
  db.prepare('SELECT id FROM profiles WHERE liked_current_user = ? ORDER BY id LIMIT 1').get(liked).id;

beforeEach(() => {
  db = createDatabase(':memory:');
  seedIfEmpty(db);
  app = createApp(db);
});

afterEach(() => {
  db.close();
});

describe('seeding', () => {
  it('seeds 32 profiles with 10 incoming likes, and is idempotent', () => {
    expect(db.prepare('SELECT COUNT(*) AS c FROM profiles').get().c).toBe(32);
    expect(db.prepare('SELECT COUNT(*) AS c FROM profiles WHERE liked_current_user = 1').get().c).toBe(10);
    expect(seedIfEmpty(db)).toBe(0);
    expect(db.prepare('SELECT COUNT(*) AS c FROM profiles').get().c).toBe(32);
  });
});

describe('GET /feed', () => {
  it('returns seeded profiles and never leaks liked_current_user', async () => {
    const res = await request(app).get('/feed');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(32);
    for (const profile of res.body) {
      expect(Object.keys(profile).sort()).toEqual(
        ['age', 'bio', 'id', 'interests', 'location', 'name', 'photo_url'].sort()
      );
      expect(profile).not.toHaveProperty('liked_current_user');
      expect(Array.isArray(profile.interests)).toBe(true);
    }
    expect(JSON.stringify(res.body)).not.toContain('liked_current_user');
  });
});

describe('POST /swipe', () => {
  it('pass removes the profile from the feed and never creates a match', async () => {
    const likedYouId = idWhere(1);
    const res = await request(app).post('/swipe').send({ profileId: likedYouId, direction: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ matched: false });

    const feed = await request(app).get('/feed');
    expect(feed.body.map((p) => p.id)).not.toContain(likedYouId);
    expect(feed.body).toHaveLength(31);

    const matches = await request(app).get('/matches');
    expect(matches.body).toEqual([]);
  });

  it('like on a profile that did not like the user returns matched: false', async () => {
    const id = idWhere(0);
    const res = await request(app).post('/swipe').send({ profileId: id, direction: 'like' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ matched: false });

    const matches = await request(app).get('/matches');
    expect(matches.body).toEqual([]);
  });

  it('like on a profile that liked the user returns matched: true and appears in /matches', async () => {
    const id = idWhere(1);
    const res = await request(app).post('/swipe').send({ profileId: id, direction: 'like' });
    expect(res.status).toBe(200);
    expect(res.body.matched).toBe(true);
    expect(res.body.match.id).toBe(id);
    expect(res.body.match).not.toHaveProperty('liked_current_user');

    const matches = await request(app).get('/matches');
    expect(matches.body).toHaveLength(1);
    expect(matches.body[0].id).toBe(id);
    expect(matches.body[0]).toHaveProperty('matched_at');
    expect(matches.body[0]).not.toHaveProperty('liked_current_user');
  });

  it('orders matches by most recently matched first', async () => {
    const likedIds = db.prepare('SELECT id FROM profiles WHERE liked_current_user = 1 ORDER BY id LIMIT 2').all();
    for (const { id } of likedIds) {
      await request(app).post('/swipe').send({ profileId: id, direction: 'like' });
    }
    const matches = await request(app).get('/matches');
    expect(matches.body.map((m) => m.id)).toEqual(likedIds.map((r) => r.id).reverse());
  });

  it('rejects swiping on an already-swiped profile without duplicating records', async () => {
    const id = idWhere(1);
    const first = await request(app).post('/swipe').send({ profileId: id, direction: 'like' });
    expect(first.body.matched).toBe(true);

    const second = await request(app).post('/swipe').send({ profileId: id, direction: 'like' });
    expect(second.status).toBe(409);
    expect(second.body).not.toHaveProperty('matched');

    const count = db.prepare('SELECT COUNT(*) AS c FROM swipes WHERE target_profile_id = ?').get(id).c;
    expect(count).toBe(1);
    expect((await request(app).get('/matches')).body).toHaveLength(1);
  });

  it('validates input', async () => {
    const id = idWhere(0);
    expect((await request(app).post('/swipe').send({ direction: 'like' })).status).toBe(400);
    expect((await request(app).post('/swipe').send({ profileId: id })).status).toBe(400);
    expect((await request(app).post('/swipe').send({ profileId: id, direction: 'super' })).status).toBe(400);
    expect((await request(app).post('/swipe').send({ profileId: 'abc', direction: 'like' })).status).toBe(400);
    expect((await request(app).post('/swipe').send({ profileId: 99999, direction: 'like' })).status).toBe(404);
    expect(db.prepare('SELECT COUNT(*) AS c FROM swipes').get().c).toBe(0);
  });
});
