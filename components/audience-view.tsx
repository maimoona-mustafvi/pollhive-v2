"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Hexagon, ArrowRight, Loader2, Check, Trophy, Timer, X } from "lucide-react"

type Stage = "join" | "lobby" | "question" | "result" | "ended"

interface PollOption {
  id: string
  text: string
  isCorrect?: boolean
}

interface SessionData {
  id: string
  roomCode: string
  status: string
  timerSeconds?: number
}

interface PollData {
  title: string
  mode: "quiz" | "vote"
  question: string
  options: PollOption[]
  timerSeconds?: number
  showResults?: string
}

interface VoteResult {
  isCorrect: boolean
  pointsEarned: number
  myScore: number
  myRank: number
  totalParticipants: number
  tally: Record<string, number>
  totalVotes: number
}

const SWATCHES = ["bg-blue", "bg-navy", "bg-lime", "bg-[#2456b8]"]
const TEXT = ["text-white", "text-white", "text-navy", "text-white"]

export function AudienceView() {
  const [stage, setStage] = useState<Stage>("join")
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [pollData, setPollData] = useState<PollData | null>(null)
  const [participantId, setParticipantId] = useState<string | null>(null)

  const [picked, setPicked] = useState<string | null>(null)
  const [voteResult, setVoteResult] = useState<VoteResult | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [timerEndsAt, setTimerEndsAt] = useState<Date | null>(null)

  const sseRef = useRef<EventSource | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Use a ref to track stage inside SSE callbacks to avoid stale closures
  const stageRef = useRef<Stage>("join")

  useEffect(() => {
    stageRef.current = stage
  }, [stage])

  useEffect(() => {
    return () => {
      sseRef.current?.close()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!timerEndsAt) return
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((timerEndsAt.getTime() - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }, 500)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerEndsAt])

  function connectSSE(roomCode: string) {
    if (sseRef.current) sseRef.current.close()

    const es = new EventSource(`/api/sessions/${roomCode}/sse`)
    sseRef.current = es

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        handleSSEEvent(payload)
      } catch {
        // ignore parse errors
      }
    }

    es.onerror = () => {
      // Use stageRef to avoid stale closure
      setTimeout(() => {
        if (stageRef.current !== "ended") connectSSE(roomCode)
      }, 3000)
    }
  }

  function handleSSEEvent(payload: { type: string; data: Record<string, unknown> }) {
    switch (payload.type) {
      case "session_started": {
        const d = payload.data as {
          question: string
          options: PollOption[]
          mode: string
          timerSeconds: number
          timerEndsAt: string
        }
        setPollData((prev) =>
          prev
            ? { ...prev, question: d.question, options: d.options }
            : prev
        )
        if (d.timerEndsAt) {
          setTimerEndsAt(new Date(d.timerEndsAt))
          setTimeLeft(d.timerSeconds)
        }
        setPicked(null)
        setVoteResult(null)
        setStage("question")
        break
      }
      case "session_ended":
        setStage("ended")
        sseRef.current?.close()
        break
      case "vote_update":
        if (voteResult && payload.data.tally) {
          setVoteResult((prev) =>
            prev
              ? {
                  ...prev,
                  tally: payload.data.tally as Record<string, number>,
                  totalVotes: payload.data.totalVotes as number,
                }
              : prev
          )
        }
        break
    }
  }

  async function handleJoin() {
    if (code.length < 6 || !name.trim()) return
    setError(null)
    setLoading(true)

    try {
      // 1. Validate the room exists and get poll/session data
      const sessionRes = await fetch(`/api/sessions/${code}`)
      if (!sessionRes.ok) {
        const d = await sessionRes.json()
        setError(d.error ?? "Room not found. Check the code and try again.")
        return
      }
      const { session, poll } = await sessionRes.json()

      // 2. Join the session
      const joinRes = await fetch(`/api/sessions/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      const joinData = await joinRes.json()

      if (!joinRes.ok) {
        setError(joinData.error ?? "Failed to join session.")
        return
      }

      setSessionData(session)
      setPollData(poll)
      setParticipantId(joinData.participant.id)

      // 3. Connect SSE for live updates
      connectSSE(code)

      // 4. If the session is already live, jump straight to the question stage
      //    instead of waiting in the lobby for a session_started event that
      //    will never come (it already fired before we joined).
      const alreadyLive =
        joinData.sessionStatus === "live" || session.status === "live"

      if (alreadyLive) {
        // Fetch current results to get the timer info
        const resultsRes = await fetch(`/api/sessions/${code}/results`)
        if (resultsRes.ok) {
          const results = await resultsRes.json()
          if (results.timerEndsAt) {
            const endsAt = new Date(results.timerEndsAt)
            // Only start timer if there's still time left
            if (endsAt.getTime() > Date.now()) {
              setTimerEndsAt(endsAt)
              setTimeLeft(Math.ceil((endsAt.getTime() - Date.now()) / 1000))
            }
          }
        }
        setStage("question")
      } else {
        setStage("lobby")
      }
    } catch (err) {
      console.error('[JOIN] Exception:', err)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleVote(optionId: string) {
    if (picked || !participantId) return
    setPicked(optionId)

    try {
      const res = await fetch(`/api/sessions/${code}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, optionId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Failed to submit vote.")
        setPicked(null)
        return
      }

      setVoteResult({
        isCorrect: data.isCorrect,
        pointsEarned: data.pointsEarned,
        myScore: data.myScore ?? 0,
        myRank: data.myRank ?? 1,
        totalParticipants: data.totalParticipants ?? 1,
        tally: data.tally ?? {},
        totalVotes: data.totalVotes ?? 1,
      })

      setStage("result")
    } catch {
      setError("Network error submitting vote.")
      setPicked(null)
    }
  }

  const options = pollData?.options ?? []
  const totalVotes = voteResult?.totalVotes ?? 1

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

        {/* ── JOIN ── */}
        {stage === "join" && (
          <div className="flex flex-1 flex-col justify-center">
            <div className="rounded-3xl bg-white p-6 shadow-xl">
              <h1 className="text-balance text-center text-xl font-bold text-navy">
                Join a live session
              </h1>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Enter the 6-digit room code from the host.
              </p>

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <X className="mt-0.5 size-4 shrink-0" />
                  {error}
                </div>
              )}

              <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Room code
              </label>
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  setError(null)
                }}
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
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />

              <button
                disabled={code.length < 6 || !name.trim() || loading}
                onClick={handleJoin}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-primary-foreground transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    Join session
                    <ArrowRight className="size-5" />
                  </>
                )}
              </button>
            </div>
            <p className="mt-5 text-center text-xs text-white/50">
              By joining you agree to PollHive&apos;s terms.
            </p>
          </div>
        )}

        {/* ── LOBBY ── */}
        {stage === "lobby" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-lime">
              <Loader2 className="size-9 animate-spin text-navy" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white">
              You&apos;re in, {name}!
            </h1>
            <p className="mt-2 text-balance text-white/70">
              Waiting for the host to start. Keep this screen open.
            </p>
            <div className="mt-5 rounded-full bg-white/10 px-4 py-2 font-mono text-sm tracking-widest text-lime">
              ROOM {code}
            </div>
            {pollData && (
              <div className="mt-4 rounded-2xl bg-white/10 px-5 py-3 text-center">
                <p className="text-xs text-white/60">Poll</p>
                <p className="text-sm font-semibold text-white">{pollData.title}</p>
              </div>
            )}
          </div>
        )}

        {/* ── QUESTION ── */}
        {stage === "question" && pollData && (
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between pt-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-medium">
                <Trophy className="size-3.5 text-lime" />
                {pollData.mode === "quiz" ? "Quiz" : "Vote"}
              </span>
              {timeLeft !== null && timeLeft > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold",
                    timeLeft <= 5 ? "bg-destructive text-white" : "bg-lime text-navy"
                  )}
                >
                  <Timer className="size-3.5" />
                  {timeLeft}s
                </span>
              )}
            </div>

            <div className="mt-5 rounded-3xl bg-white p-6 shadow-xl">
              <p className="text-balance text-lg font-bold leading-snug text-navy">
                {pollData.question}
              </p>
            </div>

            {error && (
              <div className="mt-3 rounded-xl bg-destructive/20 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}

            <div className="mt-4 grid flex-1 grid-cols-2 gap-3 content-start">
              {options.map((o, i) => (
                <button
                  key={o.id}
                  onClick={() => handleVote(o.id)}
                  disabled={!!picked}
                  className={cn(
                    "flex min-h-[112px] flex-col items-start justify-between rounded-2xl p-4 text-left font-semibold shadow-md transition-all active:scale-95",
                    SWATCHES[i % SWATCHES.length],
                    TEXT[i % TEXT.length],
                    picked && picked !== o.id && "opacity-40",
                    picked === o.id && "ring-4 ring-white",
                    picked && "cursor-not-allowed"
                  )}
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/25 text-sm">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-base">{o.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {stage === "result" && pollData && voteResult && (
          <div className="flex flex-1 flex-col">
            <div className="mt-2 rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-center gap-2 text-center">
                {pollData.mode === "quiz" ? (
                  voteResult.isCorrect ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-1.5 text-sm font-bold text-navy">
                      <Check className="size-4" /> Correct! +{voteResult.pointsEarned} pts
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-1.5 text-sm font-bold text-destructive-foreground">
                      Not quite —{" "}
                      {options.find((o) => o.isCorrect)?.text ?? "wrong answer"}
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-1.5 text-sm font-bold text-white">
                    <Check className="size-4" /> Vote recorded!
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm font-semibold text-navy">Live results</p>
              <div className="mt-3 space-y-3">
                {options.map((o) => {
                  const votes = voteResult.tally[o.id] ?? 0
                  const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
                  return (
                    <div key={o.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={cn(
                            "font-medium",
                            o.isCorrect ? "text-navy font-semibold" : "text-foreground"
                          )}
                        >
                          {o.text}{" "}
                          {o.isCorrect && (
                            <Check className="ml-1 inline size-3.5 text-blue" />
                          )}
                        </span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-canvas">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            o.isCorrect ? "bg-lime" : "bg-blue"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {pollData.mode === "quiz" && (
              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-center text-white">
                <p className="text-xs uppercase tracking-wider text-white/60">Your rank</p>
                <p className="mt-1 text-3xl font-bold text-lime">
                  #{voteResult.myRank}
                </p>
                <p className="text-sm text-white/70">
                  of {voteResult.totalParticipants} players · {voteResult.myScore} pts
                </p>
              </div>
            )}

            <div className="mt-4 rounded-2xl bg-white/10 p-4 text-center text-white/60 text-sm">
              <Loader2 className="mx-auto size-5 animate-spin mb-2 opacity-50" />
              Waiting for the host to continue…
            </div>
          </div>
        )}

        {/* ── ENDED ── */}
        {stage === "ended" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-lime">
              <Trophy className="size-9 text-navy" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-white">Session ended!</h1>
            <p className="mt-2 text-balance text-white/70">
              Thanks for participating, {name}! The host has ended the session.
            </p>
            {voteResult && pollData?.mode === "quiz" && (
              <div className="mt-6 rounded-2xl bg-white/10 p-5 text-center text-white">
                <p className="text-xs uppercase tracking-wider text-white/60">Final rank</p>
                <p className="mt-1 text-4xl font-bold text-lime">#{voteResult.myRank}</p>
                <p className="text-sm text-white/70">
                  {voteResult.myScore} total points
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setStage("join")
                setCode("")
                setName("")
                setPicked(null)
                setVoteResult(null)
                setParticipantId(null)
                setSessionData(null)
                setPollData(null)
                setError(null)
                sseRef.current?.close()
              }}
              className="mt-8 rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Join another session
            </button>
          </div>
        )}
      </div>
    </main>
  )
}