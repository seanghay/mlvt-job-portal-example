export type Job = {
  id: number
  titleEn: string
  titleKm: string
  employer: string
  provinceEn: string
  provinceKm: string
  type: 'full' | 'part' | 'apprentice'
  salaryMin: number
  salaryMax: number
  postedAt: string
  closesAt: string
}

export const jobTypeLabel: Record<Job['type'], string> = {
  full: 'Full-time',
  part: 'Part-time',
  apprentice: 'Apprenticeship',
}

/** "300 - 450 USD" */
export function formatSalary(min: number, max: number): string {
  return min === max ? `${min} USD` : `${min} - ${max} USD`
}

/** "2026-11-30" -> "30 Nov" */
export function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}
