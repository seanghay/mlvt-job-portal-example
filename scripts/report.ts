// Build the monthly enrollment report.
// Usage:
//   npm run report -- --month=2026-11
//   npm run report -- --month=2026-11 --digits=km --pdf
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { isEmpty, openDb } from '../server/db.ts'
import { buildEnrollmentReport, renderReportHtml } from '../server/report.ts'
import { seed } from '../server/seed.ts'

const { values } = parseArgs({
  options: {
    month: { type: 'string', default: '2026-11' },
    digits: { type: 'string', default: 'latin' },
    pdf: { type: 'boolean', default: false },
  },
})

const db = openDb()
if (isEmpty(db)) seed(db)

const report = buildEnrollmentReport(db, values.month!)
const html = renderReportHtml(report, { digits: values.digits === 'km' ? 'km' : 'latin' })

mkdirSync('reports', { recursive: true })
const htmlPath = resolve(`reports/enrollment-${report.month}.html`)
writeFileSync(htmlPath, html)
console.log(`HTML: ${htmlPath}`)
console.log(`Total ${report.total} · previous ${report.previousTotal} · change ${report.changePct}%`)

if (values.pdf) {
  // Uses the Google Chrome already installed on this machine. Chromium shapes Khmer correctly.
  const { chromium } = await import('playwright-core')
  const browser = await chromium.launch({ channel: 'chrome' })
  const page = await browser.newPage()
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const pdfPath = htmlPath.replace(/\.html$/, '.pdf')
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="font-size:9px;width:100%;text-align:center;color:#566170">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  })
  await browser.close()
  console.log(`PDF:  ${pdfPath}`)
}
