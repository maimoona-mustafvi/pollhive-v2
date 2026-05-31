import Link from "next/link"
import { Hexagon, PlusCircle, LogIn, ArrowRight, Trophy, BarChart3, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-navy">
            <Hexagon className="size-5 text-lime" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-navy">
            Poll<span className="text-blue">Hive</span>
          </span>
        </div>
        <Link
          href="/login"
          className="rounded-full px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-white"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 pb-16 pt-6 lg:pt-14">
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-navy shadow-sm">
          <span className="size-2 rounded-full bg-lime" />
          Real-time polling for live audiences
        </div>
        <h1 className="mt-6 max-w-2xl text-balance text-center text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
          Run live quizzes and votes your audience can join in seconds
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-center text-base leading-relaxed text-muted-foreground">
          Host an interactive session or jump into one with a room code. No downloads, no friction — just instant
          participation.
        </p>

        {/* Two primary options */}
        <div className="mt-10 grid w-full max-w-3xl gap-5 sm:grid-cols-2">
          {/* Create Poll */}
          <Link
            href="/login"
            className="group relative flex flex-col rounded-3xl bg-navy p-7 text-white shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue">
              <PlusCircle className="size-6 text-white" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Create a poll</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/70">
              Sign in to build quizzes and votes, then manage everything from your dashboard.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-lime">
              Get started
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Join Poll */}
          <Link
            href="/join"
            className="group relative flex flex-col rounded-3xl border border-border bg-white p-7 shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-lime">
              <LogIn className="size-6 text-navy" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-navy">Join a poll</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Already have a room code? Enter it to join a live session — no account needed.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
              Enter room code
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* Feature row */}
        <div className="mt-14 grid w-full max-w-3xl gap-6 sm:grid-cols-3">
          {[
            { icon: Trophy, label: "Quiz mode", desc: "Timed questions with scoring" },
            { icon: BarChart3, label: "Live results", desc: "Watch votes update instantly" },
            { icon: Users, label: "No sign-up to join", desc: "Participants join with a code" },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center text-center">
              <f.icon className="size-6 text-blue" />
              <p className="mt-3 text-sm font-semibold text-navy">{f.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
