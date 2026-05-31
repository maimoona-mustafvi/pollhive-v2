import Link from "next/link"
import { HostShell } from "@/components/host-shell"
import { StatCards } from "@/components/stat-cards"
import { PollCard } from "@/components/poll-card"
import { polls, stats } from "@/lib/polls"
import { PlusCircle } from "lucide-react"

export default function DashboardPage() {
  const livePolls = polls.filter((p) => p.status === "live")
  const others = polls.filter((p) => p.status !== "live")

  return (
    <HostShell
      active="dashboard"
      title="Good afternoon, Maya"
      subtitle="Here's what's happening across your live sessions."
      action={
        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:brightness-105"
        >
          <PlusCircle className="size-4.5" />
          New Poll
        </Link>
      }
    >
      <div className="space-y-8">
        <StatCards
          activePolls={stats.activePolls}
          totalVotes={stats.totalVotes}
          participantsToday={stats.participantsToday}
        />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Live now</h2>
            <span className="text-sm text-muted-foreground">{livePolls.length} sessions</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {livePolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Recent polls</h2>
            <Link href="/my-polls" className="text-sm font-medium text-blue hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {others.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </section>
      </div>
    </HostShell>
  )
}
