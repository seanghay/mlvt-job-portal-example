// Synthetic data only. Every name, phone number and employer here is made up.
import { faker } from '@faker-js/faker'
import type { DB } from './db.ts'

export const provinces = [
  ['pp', 'Phnom Penh', 'ភ្នំពេញ'],
  ['bmc', 'Banteay Meanchey', 'បន្ទាយមានជ័យ'],
  ['btb', 'Battambang', 'បាត់ដំបង'],
  ['kcm', 'Kampong Cham', 'កំពង់ចាម'],
  ['kch', 'Kampong Chhnang', 'កំពង់ឆ្នាំង'],
  ['ksp', 'Kampong Speu', 'កំពង់ស្ពឺ'],
  ['ktm', 'Kampong Thom', 'កំពង់ធំ'],
  ['kp', 'Kampot', 'កំពត'],
  ['kdl', 'Kandal', 'កណ្ដាល'],
  ['kk', 'Koh Kong', 'កោះកុង'],
  ['krt', 'Kratie', 'ក្រចេះ'],
  ['mdk', 'Mondulkiri', 'មណ្ឌលគិរី'],
  ['pvh', 'Preah Vihear', 'ព្រះវិហារ'],
  ['pv', 'Prey Veng', 'ព្រៃវែង'],
  ['ps', 'Pursat', 'ពោធិ៍សាត់'],
  ['rtk', 'Ratanakiri', 'រតនគិរី'],
  ['sr', 'Siem Reap', 'សៀមរាប'],
  ['shv', 'Preah Sihanouk', 'ព្រះសីហនុ'],
  ['stt', 'Stung Treng', 'ស្ទឹងត្រែង'],
  ['svr', 'Svay Rieng', 'ស្វាយរៀង'],
  ['tk', 'Takeo', 'តាកែវ'],
  ['omc', 'Oddar Meanchey', 'ឧត្តរមានជ័យ'],
  ['kep', 'Kep', 'កែប'],
  ['pln', 'Pailin', 'ប៉ៃលិន'],
  ['tbk', 'Tboung Khmum', 'ត្បូងឃ្មុំ'],
] as const

// Bigger provinces get more jobs and enrollments, so the reports look realistic.
const weight: Record<string, number> = { pp: 10, sr: 5, btb: 4, kdl: 4, kcm: 3, shv: 3, tk: 2, ksp: 2, pv: 2 }
const provinceIds = provinces.flatMap(([id]) => Array(weight[id] ?? 1).fill(id) as string[])

const titles = [
  ['Electrical technician', 'អ្នកបច្ចេកទេសអគ្គិសនី', 'full', 300, 450],
  ['Auto mechanic', 'ជាងម៉ាស៊ីនរថយន្ត', 'full', 280, 380],
  ['Sewing machine operator', 'អ្នកដេរសម្លៀកបំពាក់', 'full', 220, 260],
  ['Garment quality supervisor', 'អ្នកត្រួតពិនិត្យគុណភាពសម្លៀកបំពាក់', 'full', 350, 500],
  ['Hotel receptionist', 'អ្នកទទួលភ្ញៀវសណ្ឋាគារ', 'full', 260, 350],
  ['Cook', 'ចុងភៅ', 'full', 250, 320],
  ['Welder', 'ជាងផ្សារដែក', 'full', 300, 400],
  ['Software developer', 'អ្នកសរសេរកម្មវិធីកុំព្យូទ័រ', 'full', 600, 1200],
  ['Junior accountant', 'គណនេយ្យករកម្រិតដំបូង', 'full', 350, 500],
  ['Delivery driver', 'អ្នកបើកបរដឹកជញ្ជូន', 'part', 180, 260],
  ['Air conditioning technician', 'ជាងថែទាំម៉ាស៊ីនត្រជាក់', 'full', 280, 360],
  ['Warehouse staff', 'បុគ្គលិកឃ្លាំង', 'full', 230, 290],
  ['Graphic designer', 'អ្នករចនាក្រាហ្វិក', 'part', 250, 450],
  ['Construction worker', 'ជាងសំណង់', 'full', 220, 300],
  ['Hairdresser', 'អ្នកកាត់សក់', 'part', 150, 230],
  ['Electrician apprentice', 'កម្មសិក្សាការីអគ្គិសនី', 'apprentice', 110, 150],
  ['Hospitality apprentice', 'កម្មសិក្សាការីផ្នែកសណ្ឋាគារ', 'apprentice', 100, 140],
  ['Welding instructor (TVET)', 'គ្រូបង្គោលផ្នែកផ្សារដែក', 'full', 400, 550],
  ['Shop sales assistant', 'អ្នកលក់ក្នុងហាង', 'part', 160, 210],
  ['English teacher', 'គ្រូបង្រៀនភាសាអង់គ្លេស', 'part', 300, 450],
] as const

const companyWords = ['Mekong', 'Angkor', 'Tonle', 'Bayon', 'Golden', 'Lotus', 'Riverside', 'Central', 'Royal', 'Kampuchea', 'Sunrise', 'Naga']
const companyKinds = ['Garment', 'Services', 'Logistics', 'Hotel', 'Construction', 'Trading', 'Auto', 'Tech', 'Kitchen', 'Power']

const familyNames = [
  ['Sok', 'សុខ'], ['Chan', 'ចាន់'], ['Heng', 'ហេង'], ['Ly', 'លី'], ['Kim', 'គឹម'],
  ['Sun', 'ស៊ុន'], ['Mao', 'ម៉ៅ'], ['Chhim', 'ឈឹម'], ['Pich', 'ពេជ្រ'], ['Keo', 'កែវ'],
] as const
const givenNames = [
  ['Sophea', 'សុភា'], ['Dara', 'ដារ៉ា'], ['Vanna', 'វណ្ណា'], ['Sreynich', 'ស្រីនិច'], ['Rattana', 'រតនា'],
  ['Sovann', 'សុវណ្ណ'], ['Piseth', 'ពិសិដ្ឋ'], ['Chantha', 'ចន្ថា'], ['Bopha', 'បុប្ផា'], ['Vichet', 'វិចិត្រ'],
] as const

export const programmes = ['Electrical', 'Automotive', 'Garment', 'Hospitality', 'ICT', 'Construction', 'Agriculture', 'Beauty'] as const

const iso = (d: Date) => d.toISOString().slice(0, 10)

/** Fill the database with synthetic data. Same seed = same data on every laptop. */
export function seed(db: DB, opts: { employers?: number; jobs?: number; seekers?: number; enrollments?: number } = {}) {
  const { employers = 50, jobs = 300, seekers = 200, enrollments = 2400 } = opts
  faker.seed(42)

  db.exec('DELETE FROM enrollments; DELETE FROM job_seekers; DELETE FROM jobs; DELETE FROM employers; DELETE FROM provinces;')
  db.exec('BEGIN')
  try {
    const p = db.prepare('INSERT INTO provinces (id, name_en, name_km) VALUES (?, ?, ?)')
    for (const [id, en, km] of provinces) p.run(id, en, km)

    const e = db.prepare('INSERT INTO employers (id, name, province_id) VALUES (?, ?, ?)')
    for (let i = 1; i <= employers; i++) {
      e.run(i, `${faker.helpers.arrayElement(companyWords)} ${faker.helpers.arrayElement(companyKinds)} Co. (demo)`, faker.helpers.arrayElement(provinceIds))
    }

    const j = db.prepare(
      `INSERT INTO jobs (id, title_en, title_km, employer_id, province_id, type, salary_min, salary_max, posted_at, closes_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    for (let i = 1; i <= jobs; i++) {
      const [en, km, type, min, max] = faker.helpers.arrayElement(titles)
      const posted = faker.date.between({ from: '2026-10-01', to: '2026-11-12' })
      const closes = new Date(posted.getTime() + faker.number.int({ min: 14, max: 45 }) * 86_400_000)
      j.run(i, en, km, faker.number.int({ min: 1, max: employers }), faker.helpers.arrayElement(provinceIds), type, min, max, iso(posted), iso(closes))
    }

    const s = db.prepare('INSERT INTO job_seekers (id, name_en, name_km, phone, province_id, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    for (let i = 1; i <= seekers; i++) {
      const [fe, fk] = faker.helpers.arrayElement(familyNames)
      const [ge, gk] = faker.helpers.arrayElement(givenNames)
      const phone = `0${faker.helpers.arrayElement(['12', '15', '16', '17', '69', '70', '77', '78', '81', '85', '89', '92', '96', '97', '98'])} ${faker.string.numeric(3)} ${faker.string.numeric(3)}`
      s.run(i, `${fe} ${ge}`, `${fk} ${gk}`, phone, faker.helpers.arrayElement(provinceIds), iso(faker.date.between({ from: '2026-06-01', to: '2026-11-12' })))
    }

    // Enrollments for Sep, Oct and Nov 2026, growing a little each month.
    const en = db.prepare('INSERT INTO enrollments (programme, province_id, gender, enrolled_on) VALUES (?, ?, ?, ?)')
    const months = [
      ['2026-09-01', '2026-09-30', 0.3],
      ['2026-10-01', '2026-10-31', 0.33],
      ['2026-11-01', '2026-11-30', 0.37],
    ] as const
    for (const [from, to, share] of months) {
      const n = Math.round(enrollments * share)
      for (let i = 0; i < n; i++) {
        en.run(faker.helpers.arrayElement(programmes), faker.helpers.arrayElement(provinceIds), faker.helpers.arrayElement(['f', 'm']), iso(faker.date.between({ from, to })))
      }
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}
