# Plan: job applications

Goal: job seekers can apply for a job, and officers can see applications per job.

- [x] 1. Add `applications` table (job_id, job_seeker_id, status, applied_at) to `server/db.ts`
- [x] 2. Seed 500 synthetic applications in `server/seed.ts`, tested on synthetic data
- [ ] 3. API: `POST /api/jobs/:id/applications` with validation (phone uses `isValidCambodianPhone`)
- [ ] 4. API: `GET /api/jobs/:id/applications` for officers
- [ ] 5. UI: "Apply" form on the job page, with loading, error and "Application sent" states
- [ ] 6. Tests for every step above, then remove the old "contact employer by phone" text

## Rules

- One step, then run `npm test`, then commit. Git is the save point.
- Tick the box and add a note here when a step is done.

## Notes

- Step 2: some seed job seekers had the same phone number. Applications now use `job_seeker_id`, not the phone, as the key. See `docs/decisions.md` (to write).
