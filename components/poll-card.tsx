"use client"

import { useState } from "react"
import type { Poll } from "@/lib/polls"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Copy, MoreHorizontal, Trophy, Users, Vote, Rocket, Trash2, X } from "lucide-react"

const STATUS_STYLES: Record<Poll["status"], { label: string; dot: string; text: string; bg: string }> = {
  live: { label: "Live", dot: "bg-lime", text: "text-navy", bg: "bg-lime" },
  scheduled: { label: "Scheduled", dot: "bg-blue", text: "text-blue", bg: "bg-blue/10" },
  ended: { label: "Ended", dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted" },
  draft: { label: "Draft", dot: "bg-muted-foreground/60", text: "text-muted-foreground", bg: "bg-muted" },
}

export function PollCard({ poll, onDelete }: { poll: Poll; onDelete?: (id: string) => void }) {
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [relaunching, setRelaunching] = useState(false)
  const router = useRouter()
  const status = STATUS_STYLES[poll.status]
  const isQuiz = poll.mode === "quiz"

  const copyCode = () => {
    navigator.clipboard?.writeText(poll.roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function handleDelete() {
    if (!confirm("Delete this poll? This cannot be undone.")) return
    setDeleting(true)
    setMenuOpen(false)
    try {
      const res = await fetch(`/api/polls/${poll.id}`, { method: "DELETE" })
      if (res.ok) {
        onDelete?.(poll.id)
      }
    } catch {}
    setDeleting(false)
  }

  async function handleRelaunch() {
    setRelaunching(true)
    setMenuOpen(false)
    try {
      const res = await fetch("/api/sessions/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId: poll.id }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`/host/${data.session.roomCode}`)
        router.refresh()
      }
    } catch {}
    setRelaunching(false)
  }

  return (
    <div className="group relative flex flex-col rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            isQuiz ? "bg-navy/10 text-navy" : "bg-blue/10 text-blue",
          )}
        >
          {isQuiz ? <Trophy className="size-3.5" /> : <Vote className="size-3.5" />}
          {isQuiz ? "Quiz" : "Vote"}
        </span>

        {poll.status === "live" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-navy">
            <span className="size-1.5 animate-pulse rounded-full bg-navy" />
            Live
          </span>
        ) : (
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", status.bg, status.text)}>
            <span className={cn("size-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-pretty text-base font-semibold leading-snug text-foreground">{poll.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {poll.questions} {poll.questions === 1 ? "question" : "questions"} · {poll.updated}
      </p>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Room code</p>
          <p className="font-mono text-lg font-bold tracking-[0.2em] text-navy">
            {poll.roomCode || "——"}
          </p>
        </div>
        {poll.roomCode && (
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:brightness-105"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Users className="size-4 text-muted-foreground" />
          {poll.participants.toLocaleString()}
          <span className="text-muted-foreground">joined</span>
        </span>

        {poll.status === "live" ? (
          <Link
            href={`/host/${poll.roomCode}`}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-blue transition-colors hover:bg-canvas"
          >
            Manage →
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              disabled={deleting || relaunching}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-canvas hover:text-navy disabled:opacity-50"
            >
              <MoreHorizontal className="size-4.5" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-9 z-20 min-w-[160px] rounded-xl border border-border bg-card p-1 shadow-lg">
                  <button
                    onClick={handleRelaunch}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-canvas"
                  >
                    <Rocket className="size-4 text-blue" />
                    {relaunching ? "Launching…" : "Relaunch"}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}