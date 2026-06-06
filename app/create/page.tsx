import { redirect } from "next/navigation"
import { HostShell } from "@/components/host-shell"
import { CreatePollWizard } from "@/components/create-poll-wizard"
import { getSession } from "@/lib/auth"

export default async function CreatePollPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <HostShell
      active="create"
      title="Create a poll"
      subtitle="Set up a live quiz or vote in a single step."
      user={{ fullName: session.orgName, orgName: session.orgName, email: session.email }}
    >
      <CreatePollWizard />
    </HostShell>
  )
}
