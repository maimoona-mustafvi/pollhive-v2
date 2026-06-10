import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Poll from '@/models/Poll'
import { emitToRoom } from '@/lib/socket'

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

  const poll = await Poll.findById(session.pollId)
  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  // Set timer timestamps when going live
  const now = new Date()
  const timerSeconds = poll.timerSeconds ?? 20
  const timerEndsAt = new Date(now.getTime() + timerSeconds * 1000)

  await Session.findByIdAndUpdate(session._id, {
    status: 'live',
    timerStartedAt: now,
    timerEndsAt,
  })

  // Notify all clients that session started
  emitToRoom(code, 'session_started', {
    question: poll.question,
    options: poll.options.map((o) => ({ id: o.id, text: o.text })),
    mode: poll.mode,
    timerSeconds,
    timerEndsAt: timerEndsAt.toISOString(),
  })

  return NextResponse.json({
    success: true,
    status: 'live',
    message: 'Session started successfully',
  })
}