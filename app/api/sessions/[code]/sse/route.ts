import { NextRequest } from 'next/server'
import { subscribeToRoom, SSEPayload } from '@/lib/sse-emitter'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * SSE endpoint — think of it like a TV broadcast tower.
 * Clients (audience + host) tune in to a specific channel (room code).
 * When anything happens (vote, session start, end), we push the update.
 *
 * GET /api/sessions/[code]/sse
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection confirmation
      const connectMsg = `data: ${JSON.stringify({ type: 'connected', data: { roomCode: code } })}\n\n`
      controller.enqueue(encoder.encode(connectMsg))

      // Subscribe to room events
      const unsubscribe = subscribeToRoom(code, (payload: SSEPayload) => {
        try {
          const msg = `data: ${JSON.stringify(payload)}\n\n`
          controller.enqueue(encoder.encode(msg))
        } catch {
          // Client disconnected
        }
      })

      // Heartbeat every 25 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'))
        } catch {
          clearInterval(heartbeat)
        }
      }, 25000)

      // Cleanup on client disconnect
      req.signal.addEventListener('abort', () => {
        unsubscribe()
        clearInterval(heartbeat)
        try {
          controller.close()
        } catch {
          // Already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
}
