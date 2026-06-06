import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'
import { z } from 'zod'

const SignupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = SignupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { fullName, email, password } = parsed.data

    await connectDB()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const user = await User.create({
      fullName,
      email,
      password,
      orgName: `${fullName.split(' ')[0]}'s Workspace`,
    })

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      orgName: user.orgName,
    })

    const response = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          orgName: user.orgName,
        },
      },
      { status: 201 }
    )

    // Set session cookie using NextResponse API (correct way for route handlers)
    response.cookies.set('pollhive_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (err) {
    console.error('[SIGNUP]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
