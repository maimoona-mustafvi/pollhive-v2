import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Poll from '@/models/Poll'
import Participant from '@/models/Participant'
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

  // Update session status to live
  await Session.findByIdAndUpdate(session._id, { status: 'live' })

  // Get poll data to send to participants
  const poll = await Poll.findById(session.pollId)
  
  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  // Notify all clients that session started
  emitToRoom(code, 'session_started', { 
    question: poll.title,
    options: poll.options,
    mode: poll.mode
  })

  return NextResponse.json({ 
    success: true, 
    status: 'live',
    message: 'Session started successfully'
  })
}