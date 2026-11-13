import { describe, expect, it } from 'vitest'
import { formatSalary, formatShortDate } from './format.ts'

describe('formatSalary', () => {
  it('shows a range', () => {
    expect(formatSalary(300, 450)).toBe('300 - 450 USD')
  })

  it('shows one number when min and max are the same', () => {
    expect(formatSalary(250, 250)).toBe('250 USD')
  })
})

describe('formatShortDate', () => {
  it('formats an ISO date as day and month', () => {
    expect(formatShortDate('2026-11-30')).toBe('30 Nov')
  })
})
