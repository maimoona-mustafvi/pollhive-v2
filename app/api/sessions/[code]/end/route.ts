import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Poll from '@/models/Poll'
import Participant from '@/models/Participant'
import { emitToRoom } from '@/lib/sse-emitter'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params
  const authSession = await getSession()
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const session = await Session.findOne({
    roomCode: code,
    hostId: authSession.userId,
  })

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Compute final leaderboard
  const participants = await Participant.find({ sessionId: session._id })
    .sort({ score: -1 })
    .lean()

  const leaderboard = participants.map((p, i) => ({
    rank: i + 1,
    name: p.name,
    score: p.score,
  }))

  // End session
  await Session.findByIdAndUpdate(session._id, { status: 'ended' })
  await Poll.findByIdAndUpdate(session.pollId, {
    status: 'ended',
    totalParticipants: participants.length,
  })

  // Notify all clients
  emitToRoom(code, {
    type: 'session_ended',
    data: { leaderboard, message: 'The session has ended' },
  })

  return NextResponse.json({ success: true, leaderboard })
}
