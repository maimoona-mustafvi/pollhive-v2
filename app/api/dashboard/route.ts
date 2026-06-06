import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Poll from '@/models/Poll'
import Session from '@/models/Session'
import Participant from '@/models/Participant'

export async function GET() {
  const authSession = await getSession()
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const [activePolls, allPolls, todaySessions] = await Promise.all([
    Poll.countDocuments({ hostId: authSession.userId, status: 'live' }),
    Poll.find({ hostId: authSession.userId }).select('totalParticipants status').lean(),
    Session.find({
      hostId: authSession.userId,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
      .select('_id')
      .lean(),
  ])

  const totalVotes = allPolls.reduce((sum, p) => sum + (p.totalParticipants ?? 0), 0)

  // Count participants who joined today
  const todaySessionIds = todaySessions.map((s) => s._id)
  const participantsToday = await Participant.countDocuments({
    sessionId: { $in: todaySessionIds },
  })

  return NextResponse.json({
    activePolls,
    totalVotes,
    participantsToday,
  })
}
