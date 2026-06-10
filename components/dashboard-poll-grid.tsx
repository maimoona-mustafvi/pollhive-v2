"use client"

import { useState } from "react"
import Link from "next/link"
import { PollCard } from "@/components/poll-card"

interface Poll {
  id: string
  title: string
  mode: "quiz" | "vote"
  roomCode: string
  status: "live" | "scheduled" | "ended" | "draft"
  participants: number
  questions: number
  updated: string
}

interface DashboardPollGridProps {
  polls: Poll[]
}

export function DashboardPollGrid({ polls: initialPolls }: DashboardPollGridProps) {
  const [polls, setPolls] = useState(initialPolls)

  const livePolls = polls.filter((p) => p.status === "live")
  const others = polls.filter((p) => p.status !== "live")

  function handleDelete(id: string) {
    setPolls((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <>
      {livePolls.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">Live now</h2>
            <span className="text-sm text-muted-foreground">
              {livePolls.length} session{livePolls.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {livePolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} onDelete={handleDelete} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">
            {livePolls.length > 0 ? "Recent polls" : "Your polls"}
          </h2>
          <Link href="/my-polls" className="text-sm font-medium text-blue hover:underline">
            View all
          </Link>
        </div>
        {others.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {others.map((poll) => (
              <PollCard key={poll.id} poll={poll} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-card p-12 text-center shadow-sm ring-1 ring-border/60">
            <p className="text-sm text-muted-foreground">
              No polls yet.{" "}
              <Link href="/create" className="font-medium text-blue hover:underline">
                Create your first poll →
              </Link>
            </p>
          </div>
        )}
      </section>
    </>
  )
}