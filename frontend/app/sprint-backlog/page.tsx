import { AppShell } from '@/components/app-shell'
import { SprintBacklogView } from '@/components/sprint-backlog-view'

export default function SprintBacklogPage() {
  return (
    <AppShell>
      <main className="flex-1 p-6 overflow-auto bg-slate-50/50">
        <SprintBacklogView />
      </main>
    </AppShell>
  )
}
