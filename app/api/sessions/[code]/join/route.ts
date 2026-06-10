import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Participant from '@/models/Participant'
import Poll from '@/models/Poll'
import { emitToRoom } from '@/lib/socket'  // ← CHANGED: from sse-emitter to socket
import { z } from 'zod'

const JoinSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name too long')
    .trim(),
})

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params

  try {
    const body = await req.json()
    const parsed = JoinSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    await connectDB()

    console.log(`[JOIN_SESSION] Attempting to join room: ${code}`)

    const session = await Session.findOne({
      roomCode: code,
      status: { $ne: 'ended' },
    })

    if (!session) {
      console.log(`[JOIN_SESSION] Session not found for code: ${code}`)
      return NextResponse.json(
        { error: 'Room not found or session has ended' },
        { status: 404 }
      )
    }

    console.log(`[JOIN_SESSION] Found session: ${session._id}, status: ${session.status}`)

    // Check if name already exists in this session
    const existingParticipant = await Participant.findOne({
      sessionId: session._id,
      name: parsed.data.name,
    })

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Name already taken in this session' },
        { status: 409 }
      )
    }

    // Create participant
    const participant = await Participant.create({
      sessionId: session._id,
      name: parsed.data.name,
      score: 0,
    })

    // Increment participant count
    const updatedSession = await Session.findByIdAndUpdate(
      session._id,
      { $inc: { participantCount: 1 } },
      { new: true }
    )

    // Update poll total participants
    await Poll.findByIdAndUpdate(session.pollId, {
      $inc: { totalParticipants: 1 },
    })

    console.log(`[JOIN_SESSION] Created participant: ${participant._id}`)

    // Notify everyone in the room that someone joined
    emitToRoom(code, 'participant_joined', {  // ← CHANGED: proper event format
      participantCount: updatedSession?.participantCount || session.participantCount + 1,
      participantName: parsed.data.name,
    })

    return NextResponse.json({
      participant: {
        id: participant._id.toString(),
        name: participant.name,
        sessionId: session._id.toString(),
      },
      sessionStatus: session.status,
    })
  } catch (err) {
    console.error('[JOIN_SESSION]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}