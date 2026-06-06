import { redirect } from "next/navigation"
import { HostShell } from "@/components/host-shell"
import { Building2, Palette, Users, ChevronRight } from "lucide-react"
import { getSession } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  await connectDB()
  const user = await User.findById(session.userId).select("-password").lean()
  if (!user) redirect("/login")

  return (
    <HostShell
      active="settings"
      title="Settings"
      subtitle="Manage your workspace and branding."
      user={{ fullName: user.fullName, orgName: user.orgName, email: user.email }}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-canvas text-navy">
                <Building2 className="size-5" />
              </span>
              <h2 className="text-base font-semibold text-navy">Organization</h2>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Workspace name" value={user.orgName} />
              <Field label="Email" value={user.email} />
              <Field label="Full name" value={user.fullName} />
              <Field label="Member since" value={new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })} readOnly />
            </div>
          </section>

          <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-canvas text-navy">
                <Palette className="size-5" />
              </span>
              <h2 className="text-base font-semibold text-navy">Branding</h2>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Swatch color="#11358B" name="Navy" />
              <Swatch color="#6192FC" name="Blue" />
              <Swatch color="#C7EF66" name="Lime" />
              <Swatch color="#EFF0F4" name="Canvas" border />
            </div>
            <button className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-105">
              Save branding
            </button>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-canvas text-navy">
                <Users className="size-5" />
              </span>
              <h2 className="text-base font-semibold text-navy">Account</h2>
            </div>
            <div className="mt-4 space-y-3">
              <button className="flex w-full items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-canvas">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
                    {user.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">Owner</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            </div>
          </section>
        </aside>
      </div>
    </HostShell>
  )
}

function Field({ label, value, readOnly }: { label: string; value: string; readOnly?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        defaultValue={value}
        readOnly={readOnly}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/40 focus:border-ring focus:ring-2 read-only:bg-canvas read-only:cursor-default"
      />
    </div>
  )
}

function Swatch({ color, name, border }: { color: string; name: string; border?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`size-12 rounded-xl shadow-sm ${border ? "ring-1 ring-border" : ""}`}
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-muted-foreground">{name}</span>
    </div>
  )
}
