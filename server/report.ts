// Monthly TVET enrollment report. Every number comes from SQL, never from AI text.
import type { DB } from './db.ts'

export type EnrollmentReport = {
  month: string // "2026-11"
  total: number
  previousTotal: number
  changePct: number | null // vs previous month, rounded to 1 decimal
  femalePct: number
  byProgramme: { name: string; count: number }[]
  byProvince: { en: string; km: string; count: number }[]
  generatedAt: string
}

function monthRange(month: string): [string, string] {
  const [y, m] = month.split('-').map(Number)
  const end = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return [`${month}-01`, `${month}-${String(end).padStart(2, '0')}`]
}

export function previousMonth(month: string): string {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 2, 1))
  return d.toISOString().slice(0, 7)
}

export function buildEnrollmentReport(db: DB, month: string, now = new Date()): EnrollmentReport {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error(`Month must look like 2026-11, got "${month}"`)
  const [from, to] = monthRange(month)
  const [pFrom, pTo] = monthRange(previousMonth(month))

  const count = (a: string, b: string) =>
    (db.prepare('SELECT COUNT(*) AS n FROM enrollments WHERE enrolled_on BETWEEN ? AND ?').get(a, b) as { n: number }).n

  const total = count(from, to)
  const previousTotal = count(pFrom, pTo)
  const female = (
    db.prepare("SELECT COUNT(*) AS n FROM enrollments WHERE gender = 'f' AND enrolled_on BETWEEN ? AND ?").get(from, to) as { n: number }
  ).n

  const byProgramme = db
    .prepare(
      `SELECT programme AS name, COUNT(*) AS count FROM enrollments
       WHERE enrolled_on BETWEEN ? AND ? GROUP BY programme ORDER BY count DESC, name`,
    )
    .all(from, to) as { name: string; count: number }[]

  const byProvince = db
    .prepare(
      `SELECT p.name_en AS en, p.name_km AS km, COUNT(e.id) AS count
       FROM provinces p LEFT JOIN enrollments e ON e.province_id = p.id AND e.enrolled_on BETWEEN ? AND ?
       GROUP BY p.id ORDER BY count DESC, p.name_en`,
    )
    .all(from, to) as { en: string; km: string; count: number }[]

  return {
    month,
    total,
    previousTotal,
    changePct: previousTotal ? Math.round(((total - previousTotal) / previousTotal) * 1000) / 10 : null,
    femalePct: total ? Math.round((female / total) * 1000) / 10 : 0,
    byProgramme,
    byProvince,
    generatedAt: now.toISOString().slice(0, 10),
  }
}

// ───────────────────────────── HTML

const khmerDigits = '០១២៣៤៥៦៧៨៩'
export const toKhmerDigits = (s: string | number) => String(s).replace(/\d/g, (d) => khmerDigits[Number(d)])

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

export function renderReportHtml(r: EnrollmentReport, opts: { digits?: 'latin' | 'km' } = {}): string {
  const n = (v: number | string) => (opts.digits === 'km' ? toKhmerDigits(v) : String(v))
  const monthName = new Date(`${r.month}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const change =
    r.changePct === null ? 'No data for the previous month' : `Enrollments ${r.changePct >= 0 ? 'up' : 'down'} ${n(Math.abs(r.changePct))}% from last month`
  const max = Math.max(...r.byProgramme.map((p) => p.count), 1)
  const barW = 520

  const bars = r.byProgramme
    .map((p, i) => {
      const w = Math.max(2, Math.round((p.count / max) * barW))
      const y = i * 34
      return `<text x="0" y="${y + 18}" class="lbl">${esc(p.name)}</text>
      <rect x="130" y="${y + 4}" width="${w}" height="20" rx="3" fill="#1d4f7a"/>
      <text x="${130 + w + 8}" y="${y + 19}" class="val">${n(p.count)}</text>`
    })
    .join('')

  const rows = r.byProvince
    .map((p) => `<tr><td>${esc(p.km)}</td><td>${esc(p.en)}</td><td class="num">${n(p.count)}</td></tr>`)
    .join('')

  return `<!doctype html>
<html lang="km">
<head>
<meta charset="utf-8">
<title>TVET enrollment report ${r.month}</title>
<link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 18mm 16mm 20mm; }
  body { font-family: 'Kantumruy Pro', 'Noto Sans Khmer', 'Khmer Sangam MN', sans-serif; color: #1b2129; line-height: 1.7; margin: 0; }
  .wrap { max-width: 760px; margin: 0 auto; padding: 32px 16px; }
  .org { color: #566170; font-size: 14px; }
  h1 { font-size: 26px; margin: 4px 0 0; line-height: 1.4; }
  h1 small { display: block; font-size: 17px; font-weight: 400; color: #566170; }
  .key { margin: 24px 0; padding: 16px 20px; border-left: 4px solid #1d4f7a; background: #e8f0f7; font-size: 20px; font-weight: 600; }
  .stats { display: flex; gap: 16px; margin-bottom: 28px; }
  .stat { flex: 1; border: 1px solid #dde1e5; border-radius: 8px; padding: 12px 16px; }
  .stat b { display: block; font-size: 28px; }
  .stat span { color: #566170; font-size: 14px; }
  h2 { font-size: 18px; margin: 28px 0 8px; }
  svg .lbl { font-size: 14px; fill: #1b2129; }
  svg .val { font-size: 13px; fill: #566170; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #dde1e5; }
  th { border-bottom: 2px solid #1b2129; font-weight: 600; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  footer { margin-top: 28px; color: #566170; font-size: 12px; border-top: 1px solid #dde1e5; padding-top: 8px; }
</style>
</head>
<body><div class="wrap">
  <div class="org">ក្រសួងការងារ និងបណ្តុះបណ្តាលវិជ្ជាជីវៈ · Demo report, synthetic data</div>
  <h1>របាយការណ៍ចុះឈ្មោះចូលរៀន TVET<small>TVET enrollment report · ${monthName}</small></h1>

  <div class="key">${change}</div>

  <div class="stats">
    <div class="stat"><b>${n(r.total)}</b><span>Enrollments this month</span></div>
    <div class="stat"><b>${n(r.previousTotal)}</b><span>Last month</span></div>
    <div class="stat"><b>${n(r.femalePct)}%</b><span>Women</span></div>
  </div>

  <h2>Enrollments by programme</h2>
  <svg width="700" height="${r.byProgramme.length * 34}" role="img" aria-label="Enrollments by programme">${bars}</svg>

  <h2>Enrollments by province</h2>
  <table>
    <thead><tr><th>ខេត្ត</th><th>Province</th><th class="num">Enrollments</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <footer>Source: MLVT Job Portal demo database (synthetic) · Period: ${r.month} · Generated: ${r.generatedAt}</footer>
</div></body>
</html>`
}
