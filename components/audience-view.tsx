"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Hexagon, ArrowRight, Loader2, Check, Trophy, Timer } from "lucide-react"

type Stage = "join" | "lobby" | "question" | "result"

const OPTIONS = [
  { id: "a", label: "1998", correct: false, votes: 24 },
  { id: "b", label: "2004", correct: true, votes: 61 },
  { id: "c", label: "2011", correct: false, votes: 12 },
  { id: "d", label: "2016", correct: false, votes: 7 },
]

const SWATCHES = ["bg-blue", "bg-navy", "bg-lime", "bg-[#2456b8]"]
const TEXT = ["text-white", "text-white", "text-navy", "text-white"]

export function AudienceView() {
  const [stage, setStage] = useState<Stage>("join")
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [picked, setPicked] = useState<string | null>(null)

  const totalVotes = OPTIONS.reduce((s, o) => s + o.votes, 0)

  return (
    <main className="flex min-h-screen flex-col items-center bg-navy px-5 py-8">
      <div className="flex w-full max-w-sm flex-1 flex-col">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 py-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-lime">
            <Hexagon className="size-4.5 text-navy" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold text-white">
            Poll<span className="text-lime">Hive</span>
          </span>
        </div>

        {stage === "join" && (
          <div className="flex flex-1 flex-col justify-center">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h1 className="text-balance text-center text-xl font-bold text-navy">Join a live session</h1>
              <p className="mt-1 text-center text-sm text-muted-foreground">Enter the 6-digit room code from the host.</p>

              <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Room code
              </label>
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="mt-2 w-full rounded-2xl border-2 border-input bg-canvas py-4 text-center font-mono text-3xl font-bold tracking-[0.4em] text-navy outline-none placeholder:text-muted-foreground/40 focus:border-blue"
              />

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sam"
                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-blue"
              />

              <button
                disabled={code.length < 6 || !name}
                onClick={() => setStage("lobby")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Join session
                <ArrowRight className="size-5" />
              </button>
            </div>
            <p className="mt-5 text-center text-xs text-white/50">By joining you agree to PollHive&apos;s terms.</p>
          </div>
        )}

        {stage === "lobby" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-lime">
              <Loader2 className="size-9 animate-spin text-navy" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white">You&apos;re in, {name}!</h1>
            <p className="mt-2 text-balance text-white/70">
              Waiting for the host to start. Keep this screen open.
            </p>
            <div className="mt-5 rounded-full bg-white/10 px-4 py-2 font-mono text-sm tracking-widest text-lime">
              ROOM {code}
            </div>
            <button
              onClick={() => setStage("question")}
              className="mt-8 rounded-full bg-white/10 px-5 py-2 text-xs font-medium text-white/60 hover:text-white"
            >
              (demo: simulate host start)
            </button>
          </div>
        )}

        {stage === "question" && (
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between pt-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-medium">
                <Trophy className="size-3.5 text-lime" />
                Question 3 of 12
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 font-semibold text-navy">
                <Timer className="size-3.5" />
                18s
              </span>
            </div>

            <div className="mt-5 rounded-3xl bg-white p-6 shadow-xl">
              <p className="text-balance text-lg font-bold leading-snug text-navy">
                Which year was the company founded?
              </p>
            </div>

            <div className="mt-4 grid flex-1 grid-cols-2 gap-3 content-start">
              {OPTIONS.map((o, i) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setPicked(o.id)
                    setTimeout(() => setStage("result"), 600)
                  }}
                  className={cn(
                    "flex min-h-[112px] flex-col items-start justify-between rounded-2xl p-4 text-left font-semibold shadow-md transition-all active:scale-95",
                    SWATCHES[i],
                    TEXT[i],
                    picked && picked !== o.id && "opacity-40",
                    picked === o.id && "ring-4 ring-white",
                  )}
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/25 text-sm">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-base">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "result" && (
          <div className="flex flex-1 flex-col">
            <div className="mt-2 rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-center gap-2 text-center">
                {picked === "b" ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-1.5 text-sm font-bold text-navy">
                    <Check className="size-4" /> Correct! +100 pts
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-1.5 text-sm font-bold text-destructive-foreground">
                    Not quite — answer was 2004
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm font-semibold text-navy">Live results</p>
              <div className="mt-3 space-y-3">
                {OPTIONS.map((o) => {
                  const pct = Math.round((o.votes / totalVotes) * 100)
                  return (
                    <div key={o.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className={cn("font-medium", o.correct ? "text-navy" : "text-foreground")}>
                          {o.label} {o.correct && <Check className="ml-1 inline size-3.5 text-blue" />}
                        </span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-canvas">
                        <div
                          className={cn("h-full rounded-full", o.correct ? "bg-lime" : "bg-blue")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-white/10 p-4 text-center text-white">
              <p className="text-xs uppercase tracking-wider text-white/60">Your rank</p>
              <p className="mt-1 text-3xl font-bold text-lime">#4</p>
              <p className="text-sm text-white/70">of 214 players · 380 pts</p>
            </div>

            <button
              onClick={() => {
                setPicked(null)
                setStage("question")
              }}
              className="mt-auto rounded-2xl bg-lime py-4 text-base font-semibold text-navy transition-all hover:brightness-105"
            >
              Next question
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
