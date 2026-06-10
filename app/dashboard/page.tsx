import Link from "next/link"
import { redirect } from "next/navigation"
import { HostShell } from "@/components/host-shell"
import { StatCards } from "@/components/stat-cards"
import { DashboardPollGrid } from "@/components/dashboard-poll-grid"
import { PlusCircle } from "lucide-react"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Poll from "@/models/Poll"
import Participant from "@/models/Participant"
import Session from "@/models/Session"

async function getDashboardData(userId: string) {
  await connectDB()

  const [polls, activePolls, todaySessions] = await Promise.all([
    Poll.find({ hostId: userId }).sort({ createdAt: -1 }).limit(20).lean(),
    Poll.countDocuments({ hostId: userId, status: "live" }),
    Session.find({
      hostId: userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
      .select("_id")
      .lean(),
  ])

  const totalVotes = polls.reduce((sum, p) => sum + (p.totalParticipants ?? 0), 0)
  const todaySessionIds = todaySessions.map((s) => s._id)
  const participantsToday = await Participant.countDocuments({
    sessionId: { $in: todaySessionIds },
  })

  return {
    polls,
    stats: { activePolls, totalVotes, participantsToday },
  }
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  const { polls, stats } = await getDashboardData(session.userId)

  const serializedPolls = polls.map((p) => ({
    id: p._id.toString(),
    title: p.title,
    mode: p.mode,
    roomCode: p.roomCode ?? "",
    status: p.status,
    participants: p.totalParticipants ?? 0,
    questions: 1,
    updated:
      p.status === "live"
        ? "Live now"
        : p.status === "draft"
        ? "Draft"
        : new Date(p.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
  }))

  const firstName = session.orgName.split("'")[0] || "there"

  return (
    <HostShell
      active="dashboard"
      title={`Good ${getTimeOfDay()}, ${firstName}`}
      subtitle="Here's what's happening across your live sessions."
      user={{ fullName: firstName, orgName: session.orgName, email: session.email }}
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
        <DashboardPollGrid polls={serializedPolls} />
      </div>
    </HostShell>
  )
}

function getTimeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return "morning"
  if (h < 17) return "afternoon"
  return "evening"
}