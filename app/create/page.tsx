import { HostShell } from "@/components/host-shell"
import { CreatePollWizard } from "@/components/create-poll-wizard"

export default function CreatePollPage() {
  return (
    <HostShell active="create" title="Create a poll" subtitle="Set up a live quiz or vote in a single step.">
      <CreatePollWizard />
    </HostShell>
  )
}
