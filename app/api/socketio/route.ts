export async function GET() {
  return new Response('Socket.io is mounted at /api/socketio', { status: 200 })
}