import { redirect } from "next/navigation"
import { HostShell } from "@/components/host-shell"
import { MyPollsContent } from "@/components/my-polls-content"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Poll from "@/models/Poll"

export default async function MyPollsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  await connectDB()
  const rawPolls = await Poll.find({ hostId: session.userId })
    .sort({ createdAt: -1 })
    .lean()

  const polls = rawPolls.map((p) => ({
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

  return (
    <HostShell
      active="polls"
      title="My Polls"
      subtitle="Browse, filter, and relaunch your sessions."
      user={{ fullName: session.orgName, orgName: session.orgName, email: session.email }}
    >
      <MyPollsContent polls={polls} />
    </HostShell>
  )
}
