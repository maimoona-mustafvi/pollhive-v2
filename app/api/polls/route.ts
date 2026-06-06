import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Poll from '@/models/Poll'
import { z } from 'zod'

const PollOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  isCorrect: z.boolean().optional(),
})

const CreatePollSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  mode: z.enum(['quiz', 'vote']),
  question: z.string().min(1, 'Question is required').max(500),
  options: z
    .array(PollOptionSchema)
    .min(2, 'At least 2 options required')
    .max(4),
  points: z.number().min(10).max(1000).optional(),
  timerSeconds: z.number().min(5).max(120).optional(),
  anonymous: z.boolean().optional(),
  showResults: z.enum(['after', 'live', 'end']).optional(),
})

// GET /api/polls — list all polls for the current host
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  await connectDB()

  const query: Record<string, unknown> = { hostId: session.userId }
  if (status) query.status = status

  const polls = await Poll.find(query)
    .sort({ createdAt: -1 })
    .select('-__v')
    .lean()

  return NextResponse.json({ polls })
}

// POST /api/polls — create a new poll
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = CreatePollSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    await connectDB()

    const poll = await Poll.create({
      ...parsed.data,
      hostId: session.userId,
      status: 'draft',
    })

    return NextResponse.json({ poll }, { status: 201 })
  } catch (err) {
    console.error('[CREATE_POLL]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
