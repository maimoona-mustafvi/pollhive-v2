"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Trophy, Timer, Vote, CheckCircle2, Copy, Check, Rocket, RefreshCw } from "lucide-react"

type Mode = "quiz" | "vote" | null

export function CreatePollWizard() {
  const [mode, setMode] = useState<Mode>("quiz")
  const [correct, setCorrect] = useState(0)
  const [seconds, setSeconds] = useState(20)
  const [points, setPoints] = useState(100)
  const [anonymous, setAnonymous] = useState(true)
  const [showResults, setShowResults] = useState("after")
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    setRoomCode(code)
    setCopied(false)
  }

  const copyCode = () => {
    if (!roomCode) return
    navigator.clipboard?.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {/* Mode selector */}
        <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Choose a mode</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ModeCard
              active={mode === "quiz"}
              onClick={() => setMode("quiz")}
              title="Quiz Mode"
              desc="Timed questions with correct answers and a live leaderboard."
              primaryIcon={Trophy}
              secondaryIcon={Timer}
            />
            <ModeCard
              active={mode === "vote"}
              onClick={() => setMode("vote")}
              title="Vote Mode"
              desc="Gather opinions instantly. No right or wrong answers."
              primaryIcon={Vote}
            />
          </div>
        </div>

        {/* Question form */}
        {mode && (
          <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60">
            <h2 className="text-base font-semibold text-navy">
              {mode === "quiz" ? "Question details" : "Your poll question"}
            </h2>

            <label className="mt-5 block text-sm font-medium text-foreground" htmlFor="q">
              Question
            </label>
            <textarea
              id="q"
              rows={3}
              placeholder={mode === "quiz" ? "e.g. Which year was the company founded?" : "e.g. Which logo direction do you prefer?"}
              className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring/40 placeholder:text-muted-foreground focus:border-ring focus:ring-2"
            />

            <p className="mt-6 text-sm font-medium text-foreground">
              {mode === "quiz" ? "Answer options (mark the correct one)" : "Options"}
            </p>
            <div className="mt-3 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  {mode === "quiz" ? (
                    <button
                      type="button"
                      onClick={() => setCorrect(i)}
                      aria-label={`Mark option ${i + 1} correct`}
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        correct === i ? "border-lime bg-lime text-navy" : "border-input text-transparent hover:border-blue",
                      )}
                    >
                      <CheckCircle2 className="size-4" />
                    </button>
                  ) : (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-canvas text-xs font-semibold text-navy">
                      {String.fromCharCode(65 + i)}
                    </span>
                  )}
                  <input
                    placeholder={`Option ${i + 1}`}
                    className={cn(
                      "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/40 placeholder:text-muted-foreground focus:border-ring focus:ring-2",
                      mode === "quiz" && correct === i && "border-lime/70 bg-lime/10",
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Mode-specific controls */}
            {mode === "quiz" ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="points">
                    Points per question
                  </label>
                  <input
                    id="points"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/40 focus:border-ring focus:ring-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground" htmlFor="timer">
                      Countdown timer
                    </label>
                    <span className="rounded-md bg-navy/10 px-2 py-0.5 text-xs font-semibold text-navy">{seconds}s</span>
                  </div>
                  <input
                    id="timer"
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={seconds}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                    className="mt-3.5 w-full accent-[var(--blue)]"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Anonymous voting</p>
                    <p className="text-xs text-muted-foreground">Hide voter identities</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={anonymous}
                    onClick={() => setAnonymous((a) => !a)}
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                      anonymous ? "bg-primary" : "bg-input",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                        anonymous ? "translate-x-5" : "translate-x-0.5",
                      )}
                    />
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="results">
                    Show results
                  </label>
                  <select
                    id="results"
                    value={showResults}
                    onChange={(e) => setShowResults(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring/40 focus:border-ring focus:ring-2"
                  >
                    <option value="after">After voting</option>
                    <option value="live">Live as votes arrive</option>
                    <option value="end">Only when poll ends</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Launch panel */}
      <aside className="lg:sticky lg:top-6 lg:h-fit">
        <div className="rounded-2xl bg-navy p-6 text-white shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">Launch session</h3>
          <p className="mt-2 text-sm text-white/75">
            Generate a room code and share it. Audiences join at pollhive.app/join.
          </p>

          <div className="mt-5 rounded-xl bg-white/10 p-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">Room code</p>
            <p className="mt-1 font-mono text-3xl font-bold tracking-[0.3em] text-lime">
              {roomCode ?? "––––––"}
            </p>
          </div>

          {!roomCode ? (
            <button
              onClick={generateCode}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-105"
            >
              <RefreshCw className="size-4" />
              Generate Room Code
            </button>
          ) : (
            <div className="mt-4 space-y-3">
              <button
                onClick={copyCode}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime py-3 text-sm font-semibold text-navy transition-colors hover:brightness-105">
                <Rocket className="size-4" />
                Launch Poll
              </button>
            </div>
          )}

          <button
            onClick={generateCode}
            className={cn("mt-3 w-full text-center text-xs text-white/50 hover:text-white", !roomCode && "hidden")}
          >
            Regenerate code
          </button>
        </div>
      </aside>
    </div>
  )
}

function ModeCard({
  active,
  onClick,
  title,
  desc,
  primaryIcon: Primary,
  secondaryIcon: Secondary,
}: {
  active: boolean
  onClick: () => void
  title: string
  desc: string
  primaryIcon: React.ElementType
  secondaryIcon?: React.ElementType
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start rounded-2xl border-2 p-5 text-left transition-all",
        active ? "border-blue bg-blue/5 shadow-sm" : "border-border bg-card hover:border-blue/40",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-xl transition-colors",
            active ? "bg-navy text-lime" : "bg-canvas text-navy",
          )}
        >
          <Primary className="size-6" />
        </span>
        {Secondary && (
          <span className="flex size-9 items-center justify-center rounded-lg bg-canvas text-blue">
            <Secondary className="size-5" />
          </span>
        )}
      </div>
      <p className="mt-4 text-base font-semibold text-navy">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      <span
        className={cn(
          "absolute right-4 top-4 flex size-5 items-center justify-center rounded-full border-2 transition-colors",
          active ? "border-blue bg-blue" : "border-input",
        )}
      >
        {active && <Check className="size-3 text-white" />}
      </span>
    </button>
  )
}
