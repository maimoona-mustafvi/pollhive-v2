"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Hexagon, Users, Play, Square, Trophy, BarChart3, Copy, Check, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { io, Socket } from 'socket.io-client'

interface Participant {
  rank: number
  name: string
  score: number
}

interface ResultsData {
  tally: Record<string, number>
  totalVotes: number
  participantCount: number
  leaderboard: Participant[] | null
  options: { id: string; text: string; isCorrect?: boolean }[]
  sessionStatus: string
}

export default function HostSessionPage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<"waiting" | "live" | "ended">("waiting")
  const [participantCount, setParticipantCount] = useState(0)
  const [results, setResults] = useState<ResultsData | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pollTitle, setPollTitle] = useState("")
  const [pollMode, setPollMode] = useState<"quiz" | "vote">("vote")

  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const socketRef  = useRef<Socket | null>(null)
  const statusRef  = useRef<"waiting" | "live" | "ended">("waiting")

  // Keep ref in sync so closures always see latest status
  useEffect(() => { statusRef.current = status }, [status])

  // ── fetch results (called on demand and on interval when live) ──
  const fetchResults = useCallback(async (c: string) => {
    try {
      const res = await fetch(`/api/sessions/${c}/results`)
      if (!res.ok) return
      const data: ResultsData = await res.json()
      setResults(data)
      setParticipantCount(data.participantCount ?? 0)
      if (data.sessionStatus && data.sessionStatus !== statusRef.current) {
        setStatus(data.sessionStatus as "waiting" | "live" | "ended")
      }
    } catch { /* swallow */ }
  }, [])

  // ── start / stop polling based on status ──
  const startPolling = useCallback((c: string) => {
    if (pollRef.current) clearInterval(pollRef.current)
    // Only poll when live — no need to hammer the DB while waiting
    pollRef.current = setInterval(() => fetchResults(c), 2500)
  }, [fetchResults])

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }, [])

  // ── Socket.IO ──
  const connectSocket = useCallback((c: string) => {
    if (socketRef.current) socketRef.current.disconnect()

    const socket = io({ path: '/api/socketio', reconnectionDelayMax: 5000 })
    socketRef.current = socket

    socket.on('connect', () => socket.emit('join_room', c))

    socket.on('participant_joined', (data: { participantCount: number }) => {
      // Use socket event directly — no need to wait for next poll cycle
      setParticipantCount(data.participantCount)
    })

    socket.on('vote_update', () => {
      // Trigger an immediate results fetch so chart updates right away
      fetchResults(c)
    })

    socket.on('session_ended', () => {
      setStatus('ended')
      stopPolling()
    })
  }, [fetchResults, stopPolling])

  // ── bootstrap ──
  useEffect(() => {
    params.then(({ code: c }) => {
      setCode(c)
      loadSession(c)
      connectSocket(c)
    })
    return () => {
      stopPolling()
      socketRef.current?.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  // ── start polling only when live ──
  useEffect(() => {
    if (status === 'live' && code) startPolling(code)
    if (status !== 'live') stopPolling()
  }, [status, code, startPolling, stopPolling])

  async function loadSession(c: string) {
    try {
      const res = await fetch(`/api/sessions/${c}`)
      if (!res.ok) return
      const data = await res.json()
      const s = data.session.status as "waiting" | "live" | "ended"
      setStatus(s)
      setParticipantCount(data.session.participantCount ?? 0)
      setPollTitle(data.poll?.title ?? "")
      setPollMode(data.poll?.mode ?? "vote")
      if (s === 'live') fetchResults(c) // load current results immediately
    } catch { /* swallow */ }
  }

  async function handleStart() {
    setLoading(true)
    try {
      const res = await fetch(`/api/sessions/${code}/advance`, { method: "POST" })
      const data = await res.json()
      if (res.ok) setStatus(data.status === "ended" ? "ended" : "live")
    } catch { /* swallow */ }
    finally { setLoading(false) }
  }

  async function handleEnd() {
    setLoading(true)
    try {
      const res = await fetch(`/api/sessions/${code}/end`, { method: "POST" })
      if (res.ok) {
        setStatus("ended")
        fetchResults(code) // grab final leaderboard
      }
    } catch { /* swallow */ }
    finally { setLoading(false) }
  }

  const copyCode = () => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const totalVotes = results?.totalVotes ?? 0

  return (
    <div className="min-h-screen bg-canvas">
      <header className="bg-navy px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-lime">
              <Hexagon className="size-4 text-navy" strokeWidth={2.5} />
            </div>
            <span className="text-white font-semibold">PollHive</span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          status === "live"  ? "bg-lime text-navy" :
          status === "ended" ? "bg-white/20 text-white" :
                               "bg-white/10 text-white/70"
        }`}>
          <span className={`size-1.5 rounded-full ${status === "live" ? "animate-pulse bg-navy" : "bg-current"}`} />
          {status === "waiting" ? "Waiting" : status === "live" ? "Live" : "Ended"}
        </span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {pollTitle && (
          <div>
            <h1 className="text-2xl font-semibold text-navy">{pollTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1 capitalize">{pollMode} mode</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
            <div className="flex size-10 items-center justify-center rounded-xl bg-canvas text-navy">
              <Users className="size-5" />
            </div>
            <p className="mt-4 text-3xl font-bold text-navy">{participantCount}</p>
            <p className="mt-1 text-sm font-medium text-foreground">Participants</p>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
            <div className="flex size-10 items-center justify-center rounded-xl bg-canvas text-navy">
              <BarChart3 className="size-5" />
            </div>
            <p className="mt-4 text-3xl font-bold text-navy">{totalVotes}</p>
            <p className="mt-1 text-sm font-medium text-foreground">Votes cast</p>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Room code</p>
              <button onClick={copyCode} className="flex items-center gap-1 text-xs text-blue hover:underline">
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-2 font-mono text-3xl font-bold tracking-[0.2em] text-navy">{code}</p>
            <p className="mt-1 text-xs text-muted-foreground">Share at pollhive.app/join</p>
          </div>
        </div>

        <div className="flex gap-3">
          {status === "waiting" && (
            <button
              onClick={handleStart}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-105 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
              Start Session
            </button>
          )}
          {status === "live" && (
            <button
              onClick={handleEnd}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-destructive px-6 py-3 text-sm font-semibold text-destructive-foreground transition-colors hover:brightness-105 disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Square className="size-4" />}
              End Session
            </button>
          )}
          {status === "ended" && (
            <Link href="/dashboard" className="flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:brightness-105">
              Back to Dashboard
            </Link>
          )}
        </div>

        {results && results.options && results.options.length > 0 && (
          <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60">
            <h2 className="text-base font-semibold text-navy mb-4">Live Results</h2>
            <div className="space-y-3">
              {results.options.map((o) => {
                const votes = results.tally?.[o.id] ?? 0
                const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
                return (
                  <div key={o.id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className={`font-medium ${o.isCorrect ? "text-navy font-semibold" : "text-foreground"}`}>
                        {o.text} {o.isCorrect && <span className="text-xs text-blue ml-1">✓ correct</span>}
                      </span>
                      <span className="text-muted-foreground">{votes} votes · {pct}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-canvas">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${o.isCorrect ? "bg-lime" : "bg-blue"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {results?.leaderboard && results.leaderboard.length > 0 && (
          <div className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="size-5 text-navy" />
              <h2 className="text-base font-semibold text-navy">Leaderboard</h2>
            </div>
            <div className="space-y-2">
              {results.leaderboard.slice(0, 10).map((p) => (
                <div key={p.rank} className="flex items-center justify-between rounded-xl bg-canvas px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                      p.rank === 1 ? "bg-lime text-navy" :
                      p.rank === 2 ? "bg-blue/20 text-blue" :
                      p.rank === 3 ? "bg-navy/10 text-navy" :
                                     "bg-white text-muted-foreground"
                    }`}>
                      {p.rank}
                    </span>
                    <span className="text-sm font-medium text-foreground">{p.name}</span>
                  </div>
                  <span className="text-sm font-bold text-navy">{p.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}