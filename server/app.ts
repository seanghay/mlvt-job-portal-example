import express from 'express'
import type { DB } from './db.ts'

/** Build the Express app. Pass a database so tests can use an in-memory one. */
export function createApp(db: DB) {
  const app = express()
  app.use(express.json())

  // Health check, used after a deploy.
  app.get('/up', (_req, res) => {
    db.prepare('SELECT 1').get()
    res.json({ status: 'ok' })
  })

  app.get('/api/provinces', (_req, res) => {
    res.json(db.prepare('SELECT id, name_en, name_km FROM provinces ORDER BY name_en').all())
  })

  app.get('/api/jobs', (_req, res) => {
    const rows = db
      .prepare(
        `SELECT j.id, j.title_en AS titleEn, j.title_km AS titleKm, e.name AS employer,
                p.name_en AS provinceEn, p.name_km AS provinceKm,
                j.type, j.salary_min AS salaryMin, j.salary_max AS salaryMax,
                j.posted_at AS postedAt, j.closes_at
         FROM jobs j
         JOIN employers e ON e.id = j.employer_id
         JOIN provinces p ON p.id = j.province_id
         ORDER BY j.posted_at DESC, j.id DESC
         LIMIT 50`,
      )
      .all()
    res.json(rows)
  })

  app.get('/api/jobs/:id', (req, res) => {
    const row = db
      .prepare(
        `SELECT j.*, e.name AS employer, p.name_en AS province_en, p.name_km AS province_km
         FROM jobs j
         JOIN employers e ON e.id = j.employer_id
         JOIN provinces p ON p.id = j.province_id
         WHERE j.id = ?`,
      )
      .get(Number(req.params.id))
    if (!row) return res.status(404).json({ error: 'Job not found' })
    res.json(row)
  })

  return app
}
