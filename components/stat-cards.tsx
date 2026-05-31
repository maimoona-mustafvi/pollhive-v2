import { Activity, BarChart3, Users } from "lucide-react"

type Stat = {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  live?: boolean
}

export function StatCards({
  activePolls,
  totalVotes,
  participantsToday,
}: {
  activePolls: number
  totalVotes: number
  participantsToday: number
}) {
  const items: Stat[] = [
    { label: "Active Polls", value: String(activePolls), sub: "Running right now", icon: Activity, live: true },
    { label: "Total Votes", value: totalVotes.toLocaleString(), sub: "All time", icon: BarChart3 },
    { label: "Participants Today", value: participantsToday.toLocaleString(), sub: "+18% vs yesterday", icon: Users },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((s) => {
        const Icon = s.icon
        return (
          <div key={s.label} className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-canvas text-navy">
                <Icon className="size-5" />
              </span>
              {s.live && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-navy">
                  <span className="size-1.5 animate-pulse rounded-full bg-navy" />
                  Live
                </span>
              )}
            </div>
            <p className="mt-4 text-4xl font-bold tracking-tight text-navy">{s.value}</p>
            <p className="mt-1 text-sm font-medium text-foreground">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
