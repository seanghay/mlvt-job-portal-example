// Reset data/dev.db and fill it with synthetic data.
// Usage: npm run db:seed
import { openDb } from '../server/db.ts'
import { seed } from '../server/seed.ts'

const db = openDb()
seed(db)
const count = (t: string) => (db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get() as { n: number }).n
console.log(
  `Seeded: ${count('employers')} employers, ${count('jobs')} jobs, ${count('job_seekers')} job seekers, ${count('enrollments')} enrollments`,
)
