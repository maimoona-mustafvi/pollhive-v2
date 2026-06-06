import Session from '@/models/Session'
import { connectDB } from './mongodb'

/**
 * Generate a unique 6-digit room code.
 * Like a lottery — keep drawing until we get one that's not taken.
 */
export async function generateUniqueRoomCode(): Promise<string> {
  await connectDB()

  let attempts = 0
  while (attempts < 20) {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const existing = await Session.findOne({ roomCode: code, status: { $ne: 'ended' } })
    if (!existing) return code
    attempts++
  }

  throw new Error('Could not generate a unique room code. Please try again.')
}

export function formatRoomCode(code: string): string {
  return code.replace(/(\d{3})(\d{3})/, '$1 $2')
}
