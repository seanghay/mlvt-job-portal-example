import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export type DB = DatabaseSync

export const DEFAULT_DB_PATH = 'data/dev.db'

const schema = `
CREATE TABLE IF NOT EXISTS provinces (
  id        TEXT PRIMARY KEY,
  name_en   TEXT NOT NULL,
  name_km   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS employers (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  province_id TEXT NOT NULL REFERENCES provinces(id)
);

CREATE TABLE IF NOT EXISTS jobs (
  id          INTEGER PRIMARY KEY,
  title_en    TEXT NOT NULL,
  title_km    TEXT NOT NULL,
  employer_id INTEGER NOT NULL REFERENCES employers(id),
  province_id TEXT NOT NULL REFERENCES provinces(id),
  type        TEXT NOT NULL CHECK (type IN ('full', 'part', 'apprentice')),
  salary_min  INTEGER NOT NULL,
  salary_max  INTEGER NOT NULL,
  posted_at   TEXT NOT NULL,
  closes_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS job_seekers (
  id          INTEGER PRIMARY KEY,
  name_en     TEXT NOT NULL,
  name_km     TEXT NOT NULL,
  phone       TEXT NOT NULL,
  province_id TEXT NOT NULL REFERENCES provinces(id),
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS enrollments (
  id          INTEGER PRIMARY KEY,
  programme   TEXT NOT NULL,
  province_id TEXT NOT NULL REFERENCES provinces(id),
  gender      TEXT NOT NULL CHECK (gender IN ('f', 'm')),
  enrolled_on TEXT NOT NULL
);
`

/** Open (and create if needed) a SQLite database. Use ':memory:' in tests. */
export function openDb(path: string = DEFAULT_DB_PATH): DB {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec('PRAGMA foreign_keys = ON;')
  db.exec(schema)
  return db
}

export function isEmpty(db: DB): boolean {
  const row = db.prepare('SELECT COUNT(*) AS n FROM jobs').get() as { n: number }
  return row.n === 0
}
