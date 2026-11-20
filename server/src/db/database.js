import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DEFAULT_DB_PATH = path.resolve(__dirname, '../../data/coy.db');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  photo_url TEXT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT NOT NULL,
  interests TEXT NOT NULL,
  liked_current_user INTEGER NOT NULL DEFAULT 0 CHECK (liked_current_user IN (0, 1))
);

CREATE TABLE IF NOT EXISTS swipes (
  id INTEGER PRIMARY KEY,
  target_profile_id INTEGER NOT NULL UNIQUE REFERENCES profiles(id),
  direction TEXT NOT NULL CHECK (direction IN ('like', 'pass')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * Opens (and initialises) a SQLite database.
 * Pass ':memory:' for an isolated in-memory database (used by tests).
 */
export function createDatabase(filename = DEFAULT_DB_PATH) {
  if (filename !== ':memory:') {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
  }
  const db = new Database(filename);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  return db;
}
