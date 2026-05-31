import { HostShell } from "@/components/host-shell"
import { MyPollsContent } from "@/components/my-polls-content"

export default function MyPollsPage() {
  return (
    <HostShell active="polls" title="My Polls" subtitle="Browse, filter, and relaunch your sessions.">
      <MyPollsContent />
    </HostShell>
  )
}
