import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Poll from '@/models/Poll'
import Vote from '@/models/Vote'
import Participant from '@/models/Participant'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  await connectDB()

  const session = await Session.findOne({ roomCode: code }).lean()
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const poll = await Poll.findById(session.pollId).lean()
  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  // Vote tally
  const votes = await Vote.find({ sessionId: session._id }).lean()
  const tally: Record<string, number> = {}
  for (const option of poll.options) {
    tally[option.id] = 0
  }
  for (const vote of votes) {
    tally[vote.optionId] = (tally[vote.optionId] ?? 0) + 1
  }

  // Leaderboard for quiz mode
  let leaderboard = null
  if (poll.mode === 'quiz') {
    const participants = await Participant.find({ sessionId: session._id })
      .sort({ score: -1 })
      .limit(20)
      .lean()

    leaderboard = participants.map((p, i) => ({
      rank: i + 1,
      name: p.name,
      score: p.score,
    }))
  }

  return NextResponse.json({
  tally,
  totalVotes: votes.length,
  participantCount: session.participantCount,
  leaderboard,
  options: poll.options,  
  sessionStatus: session.status,
  timerEndsAt: session.timerEndsAt,
})
}
