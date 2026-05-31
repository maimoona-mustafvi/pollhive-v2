import { HostShell } from "@/components/host-shell"
import { Building2, Palette, Users, ChevronRight } from "lucide-react"

export default function SettingsPage() {
  return (
    <HostShell active="settings" title="Settings" subtitle="Manage your workspace and branding.">
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
              <Field label="Workspace name" value="Acme Inc" />
              <Field label="Subdomain" value="acme.pollhive.app" />
              <Field label="Default room size" value="500 participants" />
              <Field label="Time zone" value="GMT+5 (Karachi)" />
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
              <h2 className="text-base font-semibold text-navy">Team</h2>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { n: "Maya Ahsan", r: "Owner", i: "MA" },
                { n: "Daniel Lee", r: "Editor", i: "DL" },
                { n: "Priya Rao", r: "Viewer", i: "PR" },
              ].map((m) => (
                <button key={m.n} className="flex w-full items-center justify-between rounded-xl px-2 py-2 transition-colors hover:bg-canvas">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
                      {m.i}
                    </span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{m.n}</p>
                      <p className="text-xs text-muted-foreground">{m.r}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl border-2 border-navy px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white">
              Invite member
            </button>
          </section>
        </aside>
      </div>
    </HostShell>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        defaultValue={value}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/40 focus:border-ring focus:ring-2"
      />
    </div>
  )
}

function Swatch({ color, name, border }: { color: string; name: string; border?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={cnBorder(border)}
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-muted-foreground">{name}</span>
    </div>
  )
}

function cnBorder(border?: boolean) {
  return `size-12 rounded-xl shadow-sm ${border ? "ring-1 ring-border" : ""}`
}
