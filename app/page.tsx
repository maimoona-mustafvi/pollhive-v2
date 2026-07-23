import Link from "next/link"
import { Brain, Zap, BarChart3, CheckCircle2, ArrowRight, BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-navy">
            <Brain className="size-5 text-lime" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-navy">
            Auxilio<span className="text-lime">AI</span>
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
          AI-powered interview practice platform
        </div>
        <h1 className="mt-6 max-w-2xl text-balance text-center text-4xl font-semibold tracking-tight text-navy sm:text-5xl">
          Practice interviews with adaptive AI feedback
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-center text-base leading-relaxed text-muted-foreground">
          Upload your study material or choose from curated question banks. Get real-time scoring on semantic accuracy, answer depth, and response similarity. Master topics before your real interview.
        </p>

        {/* Two primary options */}
        <div className="mt-10 grid w-full max-w-3xl gap-5 sm:grid-cols-2">
          {/* Start Practice */}
          <Link
            href="/login"
            className="group relative flex flex-col rounded-3xl bg-navy p-7 text-white shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue">
              <Zap className="size-6 text-white" />
            </div>
            <h2 className="mt-5 text-xl font-semibold">Start practicing</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/70">
              Sign in to create sessions, upload materials, and track your progress with AI-powered insights.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-lime">
              Begin now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Browse Questions */}
          <Link
            href="/practice"
            className="group relative flex flex-col rounded-3xl border border-border bg-white p-7 shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-lime">
              <BookOpen className="size-6 text-navy" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-navy">Browse questions</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Explore curated question banks by role, company, and difficulty. No account needed to browse.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
              Explore
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* Feature row */}
        <div className="mt-14 grid w-full max-w-3xl gap-6 sm:grid-cols-3">
          {[
            { icon: Brain, label: "AI Feedback", desc: "Semantic, depth & similarity scoring" },
            { icon: BarChart3, label: "Track Progress", desc: "See improvement over time" },
            { icon: CheckCircle2, label: "Master Topics", desc: "Identify weak areas instantly" },
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
