import { JobsPage } from './pages/JobsPage.tsx'

export function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-7 w-7 rounded bg-primary" />
            <span className="font-semibold">MLVT Job Portal</span>
            <span className="text-sm text-muted">ផតថលការងារ</span>
          </div>
          <span className="text-sm text-muted">Demo · synthetic data</span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <JobsPage />
      </main>
    </div>
  )
}
