import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Poll from '@/models/Poll'
import { emitToRoom } from '@/lib/sse-emitter'

// POST /api/sessions/[code]/advance — start session or move to next question
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const authSession = await getSession()
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { code } = await context.params
  await connectDB()

  const session = await Session.findOne({
    roomCode: code,
    hostId: authSession.userId,
  })

  if (!session) {
    return NextResponse.json(
      { error: 'Session not found or not authorized' },
      { status: 404 }
    )
  }

  const poll = await Poll.findById(session.pollId)
  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  const timerSeconds = poll.timerSeconds ?? 20
  const now = new Date()
  const timerEndsAt = new Date(now.getTime() + timerSeconds * 1000)

  if (session.status === 'waiting') {
    // Start the session
    await Session.findByIdAndUpdate(session._id, {
      status: 'live',
      timerStartedAt: now,
      timerEndsAt,
    })

    emitToRoom(code, {
      type: 'session_started',
      data: {
        question: poll.question,
        options: poll.options.map((o) => ({ id: o.id, text: o.text })),
        mode: poll.mode,
        timerSeconds,
        timerEndsAt: timerEndsAt.toISOString(),
      },
    })

    return NextResponse.json({ status: 'started', timerEndsAt })
  }

  // End the session if no more questions (single-question polls for now)
  // Future: multi-question support would track currentQuestionIndex
  await Session.findByIdAndUpdate(session._id, {
    status: 'ended',
  })

  await Poll.findByIdAndUpdate(poll._id, {
    status: 'ended',
  })

  emitToRoom(code, {
    type: 'session_ended',
    data: { message: 'The session has ended' },
  })

  return NextResponse.json({ status: 'ended' })
}
