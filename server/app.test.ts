import request from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'
import { createApp } from './app.ts'
import { openDb } from './db.ts'
import { seed } from './seed.ts'

// Each test run gets its own in-memory database with a small synthetic data set.
const db = openDb(':memory:')
const app = createApp(db)

beforeAll(() => {
  seed(db, { employers: 5, jobs: 20, seekers: 10, enrollments: 30 })
})

describe('GET /up', () => {
  it('reports ok', async () => {
    const res = await request(app).get('/up')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('GET /api/jobs', () => {
  it('lists jobs with employer and province names', async () => {
    const res = await request(app).get('/api/jobs')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(20)
    expect(res.body[0]).toMatchObject({
      titleEn: expect.any(String),
      employer: expect.any(String),
      provinceEn: expect.any(String),
    })
  })
})

describe('GET /api/jobs/:id', () => {
  it('returns one job', async () => {
    const res = await request(app).get('/api/jobs/1')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
  })

  it('returns 404 for a job that does not exist', async () => {
    const res = await request(app).get('/api/jobs/9999')
    expect(res.status).toBe(404)
  })
})

describe('GET /api/provinces', () => {
  it('lists all 25 provinces', async () => {
    const res = await request(app).get('/api/provinces')
    expect(res.body).toHaveLength(25)
  })
})
