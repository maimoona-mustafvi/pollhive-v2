import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Participant from '@/models/Participant'
import Poll from '@/models/Poll'
import Vote from '@/models/Vote'
import { emitToRoom } from '@/lib/socket'
import { z } from 'zod'

const VoteSchema = z.object({
  participantId: z.string().min(1),
  optionId: z.string().min(1),
})

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  const body = await req.json()
  const parsed = VoteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { participantId, optionId } = parsed.data

  await connectDB()

  const session = await Session.findOne({ roomCode: code, status: 'live' })
  if (!session) {
    return NextResponse.json({ error: 'Session not found or not active' }, { status: 404 })
  }

  const participant = await Participant.findOne({ _id: participantId, sessionId: session._id })
  if (!participant) {
    return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
  }

  // Prevent duplicate votes
  const existing = await Vote.findOne({ sessionId: session._id, participantId })
  if (existing) {
    return NextResponse.json({ error: 'Already voted' }, { status: 409 })
  }

  const poll = await Poll.findById(session.pollId)
  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  const selectedOption = poll.options.find((o) => o.id === optionId)
  if (!selectedOption) {
    return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
  }

  const isCorrect = poll.mode === 'quiz' ? Boolean(selectedOption.isCorrect) : false
  let pointsEarned = 0

  if (poll.mode === 'quiz' && isCorrect) {
    const basePoints = poll.points ?? 100
    const timerSeconds = poll.timerSeconds ?? 20
    if (session.timerStartedAt) {
      const elapsed = (Date.now() - session.timerStartedAt.getTime()) / 1000
      const timeRatio = Math.max(0, 1 - elapsed / timerSeconds)
      const timeBonus = Math.round(basePoints * 0.5 * timeRatio)
      pointsEarned = basePoints + timeBonus
    } else {
      pointsEarned = poll.points ?? 100
    }
  }

  // Save vote
  await Vote.create({
    sessionId: session._id,
    participantId,
    optionId,
    isCorrect,
    answeredAt: new Date(),
  })

  // Update participant score
  await Participant.findByIdAndUpdate(participantId, {
    $inc: { score: pointsEarned },
    $push: { answers: { optionId, answeredAt: new Date(), pointsEarned } },
  })

  // Recompute tally
  const votes = await Vote.find({ sessionId: session._id })
  const tally: Record<string, number> = {}
  for (const o of poll.options) tally[o.id] = 0
  for (const v of votes) tally[v.optionId] = (tally[v.optionId] ?? 0) + 1

  // Broadcast updated tally to everyone in the room
  emitToRoom(code, 'vote_update', {
    tally,
    totalVotes: votes.length,
  })

  // Get updated participant for rank
  const updatedParticipant = await Participant.findById(participantId)
  const allParticipants = await Participant.find({ sessionId: session._id }).sort({ score: -1 })
  const myRank = allParticipants.findIndex((p) => p._id.toString() === participantId) + 1

  return NextResponse.json({
    success: true,
    isCorrect,
    pointsEarned,
    myScore: updatedParticipant?.score ?? 0,
    myRank,
    totalParticipants: allParticipants.length,
    tally,
    totalVotes: votes.length,
  })
}