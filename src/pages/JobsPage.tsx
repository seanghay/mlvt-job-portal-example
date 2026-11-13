import { useEffect, useState } from 'react'
import { formatSalary, formatShortDate, jobTypeLabel, type Job } from '../lib/format.ts'

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/jobs')
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((data) => setJobs(data as Job[]))
      .catch(() => setError(true))
  }, [])

  return (
    <section>
      <h1 className="text-2xl font-semibold">Open jobs</h1>
      <p className="mt-1 text-muted">Jobs from employers registered with the ministry.</p>

      {error && <p className="mt-6 rounded border border-red-200 bg-red-50 p-4 text-red-800">Could not load jobs. Is the API running?</p>}
      {!jobs && !error && <p className="mt-6 text-muted">Loading…</p>}

      {jobs && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full text-left">
            <thead className="border-b-2 border-ink text-sm text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Job</th>
                <th className="px-4 py-2 font-medium">Province</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Salary / month</th>
                <th className="px-4 py-2 font-medium">Closes</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <a href={`#/jobs/${job.id}`} className="font-medium text-primary underline">
                      {job.titleEn}
                    </a>
                    <div className="text-sm text-muted">{job.employer}</div>
                  </td>
                  <td className="px-4 py-3">{job.provinceEn}</td>
                  <td className="px-4 py-3">{jobTypeLabel[job.type]}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatSalary(job.salaryMin, job.salaryMax)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatShortDate(job.closesAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
