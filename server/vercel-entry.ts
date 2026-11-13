// Vercel entry point. Vercel functions can't keep a SQLite file, so each
// cold start builds an in-memory database with the same synthetic data
// (the seed is fixed, so every instance has identical data).
import { createApp } from '../server/app.ts'
import { openDb } from '../server/db.ts'
import { seed } from '../server/seed.ts'

const db = openDb(':memory:')
seed(db)

export default createApp(db)
