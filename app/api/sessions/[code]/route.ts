import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Poll from '@/models/Poll'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  await connectDB()

  console.log(`[SESSION_LOOKUP] Looking up session for code: ${code}`)

  const session = await Session.findOne({
    roomCode: code,
    status: { $ne: 'ended' },
  }).lean()

  if (!session) {
    console.log(`[SESSION_LOOKUP] Session not found for code: ${code}`)
    return NextResponse.json(
      { error: 'Room not found or session has ended' },
      { status: 404 }
    )
  }

  console.log(`[SESSION_LOOKUP] Found session: ${session._id}, status: ${session.status}`)

  const poll = await Poll.findById(session.pollId).lean()
  if (!poll) {
    console.log(`[SESSION_LOOKUP] Poll not found for session`)
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  return NextResponse.json({
  session: {
    id: session._id.toString(),
    roomCode: session.roomCode,
    status: session.status,
    currentQuestionIndex: session.currentQuestionIndex,
    participantCount: session.participantCount, // ← add this
  },
  poll: {
    id: poll._id.toString(),
    title: poll.title,
    mode: poll.mode,
    question: poll.question,
    options: poll.options.map((o) => ({
      id: o.id,
      text: o.text,
    })),
    timerSeconds: poll.timerSeconds,
    anonymous: poll.anonymous,
    showResults: poll.showResults,
  },
})
}
