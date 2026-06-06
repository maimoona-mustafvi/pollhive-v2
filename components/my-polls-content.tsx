"use client"

import { useState } from "react"
import { PollCard } from "@/components/poll-card"
import { cn } from "@/lib/utils"

type PollStatus = "live" | "scheduled" | "ended" | "draft"

interface Poll {
  id: string
  title: string
  mode: "quiz" | "vote"
  roomCode: string
  status: PollStatus
  participants: number
  questions: number
  updated: string
}

const FILTERS: { key: "all" | PollStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "scheduled", label: "Scheduled" },
  { key: "ended", label: "Ended" },
  { key: "draft", label: "Drafts" },
]

export function MyPollsContent({ polls }: { polls: Poll[] }) {
  const [filter, setFilter] = useState<"all" | PollStatus>("all")
  const filtered = filter === "all" ? polls : polls.filter((p) => p.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count =
            f.key === "all" ? polls.length : polls.filter((p) => p.status === f.key).length
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === f.key
                  ? "bg-navy text-white"
                  : "bg-card text-muted-foreground ring-1 ring-border/60 hover:text-navy"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  filter === f.key ? "bg-white/20 text-white" : "bg-canvas text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-12 text-center shadow-sm ring-1 ring-border/60">
          <p className="text-sm text-muted-foreground">No polls in this category yet.</p>
        </div>
      )}
    </div>
  )
}
