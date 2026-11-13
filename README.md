# MLVT Job Portal (demo)

A small job portal for the Claude Code workshop. Job seekers find jobs, employers post them, officers see reports.

**Synthetic data only.** Every name, phone number and employer is made up. Never put real citizen data in this project.

## Before the workshop (10 minutes)

You need:
- **Node.js 22.13 or newer**: check with `node -v`
- **Claude Code**, installed and logged in: check with `claude --version`
- **Google Chrome** (for the PDF report)

Then:

```bash
git clone <repo-url> mlvt-job-portal
cd mlvt-job-portal
npm install
npm test          # should say: 14 passed
npm run dev       # open http://localhost:5173
```

You should see a table of open jobs. If you do, you are ready.

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | API on :3001 and web app on :5173 |
| `npm test` | Run all tests (Vitest) |
| `npm run lint` | Lint (oxlint) |
| `npm run typecheck` | TypeScript check |
| `npm run db:seed` | Reset `data/dev.db` with fresh synthetic data |
| `npm run report -- --month=2026-11` | Monthly enrollment report as HTML |
| `npm run report -- --month=2026-11 --digits=km --pdf` | Same, with Khmer digits, plus a PDF |
| `npm run deploy` | Build and deploy to Vercel production (presenter only) |

## Stack

- **API:** Node.js + Express 5, in `server/`
- **Database:** SQLite, built into Node (`node:sqlite`), file `data/dev.db` (created on first run)
- **Web:** React + Tailwind CSS + Vite, in `src/`
- **Tests:** Vitest + Supertest, next to the code (`*.test.ts`)
- **Reports:** `server/report.ts` (the numbers) and `scripts/report.ts` (HTML and PDF)

## Deployed version

Live demo: https://mlvt-job-portal.vercel.app (health check: `/up`)

On Vercel the API can't keep a SQLite file, so `server/vercel-entry.ts` builds an in-memory database with the same synthetic data on every cold start. `npm run build` bundles it with esbuild to `build-api/app.mjs`, which `api/index.mjs` loads. Reports and PDFs run locally only.
