// lib/socket.ts
import { Server as SocketIOServer } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { Server as HTTPServer } from 'http'

declare global {
  var _io: SocketIOServer | undefined
  var _pubClient: ReturnType<typeof createClient> | undefined
  var _subClient: ReturnType<typeof createClient> | undefined
}

export async function initSocket(httpServer: HTTPServer): Promise<SocketIOServer> {
  if (global._io) return global._io

  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    path: '/api/socketio',
  })

  // Redis adapter so all server instances share the same socket rooms
  const pubClient = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' })
  const subClient = pubClient.duplicate()

  await Promise.all([pubClient.connect(), subClient.connect()])

  io.adapter(createAdapter(pubClient, subClient))

  global._io = io
  global._pubClient = pubClient
  global._subClient = subClient

  io.on('connection', (socket) => {
    socket.on('join_room', (roomCode: string) => {
      socket.join(roomCode)
    })

    socket.on('leave_room', (roomCode: string) => {
      socket.leave(roomCode)
    })
  })

  return io
}

export function getIO(): SocketIOServer {
  if (!global._io) throw new Error('Socket.io not initialized')
  return global._io
}

export function emitToRoom(roomCode: string, event: string, data: unknown): void {
  getIO().to(roomCode).emit(event, data)
}