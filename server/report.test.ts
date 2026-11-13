import { describe, expect, it } from 'vitest'
import { openDb } from './db.ts'
import { buildEnrollmentReport, previousMonth, toKhmerDigits } from './report.ts'
import { seed } from './seed.ts'

const db = openDb(':memory:')
seed(db, { employers: 3, jobs: 5, seekers: 5, enrollments: 300 })

describe('buildEnrollmentReport', () => {
  const r = buildEnrollmentReport(db, '2026-11')

  it('totals match the sum of each breakdown', () => {
    expect(r.byProgramme.reduce((s, p) => s + p.count, 0)).toBe(r.total)
    expect(r.byProvince.reduce((s, p) => s + p.count, 0)).toBe(r.total)
  })

  it('lists every province, even with zero enrollments', () => {
    expect(r.byProvince).toHaveLength(25)
  })

  it('compares with the previous month', () => {
    const expected = Math.round(((r.total - r.previousTotal) / r.previousTotal) * 1000) / 10
    expect(r.changePct).toBe(expected)
  })

  it('rejects a bad month', () => {
    expect(() => buildEnrollmentReport(db, '2026-13')).toThrow()
  })
})

describe('helpers', () => {
  it('finds the previous month across a year boundary', () => {
    expect(previousMonth('2026-01')).toBe('2025-12')
  })

  it('converts to Khmer digits', () => {
    expect(toKhmerDigits(2026)).toBe('២០២៦')
  })
})
