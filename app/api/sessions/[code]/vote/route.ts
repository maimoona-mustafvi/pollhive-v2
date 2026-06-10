import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Poll from '@/models/Poll'
import Participant from '@/models/Participant'
import Vote from '@/models/Vote'
import { emitToRoom } from '@/lib/sse-emitter'
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

  try {
    const body = await req.json()
    const parsed = VoteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { participantId, optionId } = parsed.data

    await connectDB()

    const session = await Session.findOne({ roomCode: code, status: 'live' })
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or not active' },
        { status: 404 }
      )
    }

    const poll = await Poll.findById(session.pollId)
    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    // Verify participant belongs to this session
    const participant = await Participant.findOne({
      _id: participantId,
      sessionId: session._id,
    })
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
    }

    // Check for duplicate vote
    const existingVote = await Vote.findOne({
      sessionId: session._id,
      participantId: participant._id,
    })
    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted' },
        { status: 409 }
      )
    }

    // Determine correctness and scoring
    const selectedOption = poll.options.find((o) => o.id === optionId)
    if (!selectedOption) {
      return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
    }

    const isCorrect = poll.mode === 'quiz' ? Boolean(selectedOption.isCorrect) : false

    // Calculate time-based bonus (faster = more bonus points)
    let timeBonus = 0
    let pointsEarned = 0

    if (poll.mode === 'quiz' && isCorrect) {
      const basePoints = poll.points ?? 100
      const timerSeconds = poll.timerSeconds ?? 20

      if (session.timerStartedAt) {
        const elapsed = (Date.now() - session.timerStartedAt.getTime()) / 1000
        const timeRatio = Math.max(0, 1 - elapsed / timerSeconds)
        timeBonus = Math.round(basePoints * 0.5 * timeRatio)
      }

      pointsEarned = basePoints + timeBonus
    }

    // Save vote
    await Vote.create({
      sessionId: session._id,
      participantId: participant._id,
      optionId,
      isCorrect,
      answeredAt: new Date(),
    })

    // Update participant score
    if (pointsEarned > 0) {
      await Participant.findByIdAndUpdate(participant._id, {
        $inc: { score: pointsEarned },
        $push: {
          answers: {
            optionId,
            answeredAt: new Date(),
            timeBonus,
            pointsEarned,
          },
        },
      })
    } else {
      await Participant.findByIdAndUpdate(participant._id, {
        $push: {
          answers: {
            optionId,
            answeredAt: new Date(),
            timeBonus: 0,
            pointsEarned: 0,
          },
        },
      })
    }

    // Compute live tally for all options
    const votes = await Vote.find({ sessionId: session._id })
    const tally: Record<string, number> = {}
    for (const option of poll.options) {
      tally[option.id] = 0
    }
    for (const vote of votes) {
      tally[vote.optionId] = (tally[vote.optionId] ?? 0) + 1
    }

    const totalVotes = votes.length

    // Broadcast live update to all room subscribers
    if (poll.showResults === 'live' || poll.mode === 'quiz') {
      emitToRoom(code, {
        type: 'vote_update',
        data: {
          tally,
          totalVotes,
          optionLabels: Object.fromEntries(
            poll.options.map((o) => [o.id, o.text])
          ),
        },
      })
    }

    // Get updated leaderboard for quiz mode
    let leaderboard = null
    if (poll.mode === 'quiz') {
      const topParticipants = await Participant.find({ sessionId: session._id })
        .sort({ score: -1 })
        .limit(10)
        .lean()

      leaderboard = topParticipants.map((p, i) => ({
        rank: i + 1,
        name: p.name,
        score: p.score,
      }))

      // Find this participant's rank
      const allParticipants = await Participant.find({ sessionId: session._id })
        .sort({ score: -1 })
        .lean()

      const myRank =
        allParticipants.findIndex((p) => p._id.toString() === participantId) + 1

      return NextResponse.json({
        success: true,
        isCorrect,
        pointsEarned,
        timeBonus,
        myScore: participant.score + pointsEarned,
        myRank,
        totalParticipants: allParticipants.length,
        tally,
        totalVotes,
        leaderboard,
      })
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      pointsEarned: 0,
      tally,
      totalVotes,
    })
  } catch (err) {
    console.error('[VOTE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
