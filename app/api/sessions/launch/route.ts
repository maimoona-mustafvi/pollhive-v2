import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Poll from '@/models/Poll'
import Session from '@/models/Session'
import { generateUniqueRoomCode } from '@/lib/room-code'
import { z } from 'zod'

const LaunchSchema = z.object({
  pollId: z.string().min(1, 'Poll ID is required'),
})

export async function POST(req: NextRequest) {
  const authSession = await getSession()
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = LaunchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    await connectDB()

    // Verify the poll belongs to this host
    const poll = await Poll.findOne({
      _id: parsed.data.pollId,
      hostId: authSession.userId,
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    // End any existing live session for this poll
    if (poll.activeSessionId) {
      await Session.findByIdAndUpdate(poll.activeSessionId, { status: 'ended' })
    }

    const roomCode = await generateUniqueRoomCode()

    const session = await Session.create({
      pollId: poll._id,
      hostId: authSession.userId,
      roomCode,
      status: 'waiting',
      currentQuestionIndex: 0,
    })

    // Update poll status and link to session
    await Poll.findByIdAndUpdate(poll._id, {
      status: 'live',
      roomCode,
      activeSessionId: session._id,
    })

    return NextResponse.json({
      session: {
        id: session._id.toString(),
        roomCode: session.roomCode,
        status: session.status,
      },
    })
  } catch (err) {
    console.error('[LAUNCH_SESSION]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
