// app/api/sessions/[code]/vote/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Session from '@/models/Session'
import Participant from '@/models/Participant'
import { publishVoteEvent } from '@/lib/kafka'   // NEW
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

  // Just publish to Kafka — processing happens in consumer
  await publishVoteEvent({
    roomCode: code,
    sessionId: session._id.toString(),
    participantId,
    optionId,
  })

  // Return optimistic response immediately
  return NextResponse.json({ success: true, queued: true })
}