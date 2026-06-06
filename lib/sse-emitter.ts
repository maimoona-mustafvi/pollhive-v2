import { EventEmitter } from 'events'

// Singleton pattern for the event emitter — like a radio tower
// All SSE clients tune in to their room's "channel"
declare global {
  // eslint-disable-next-line no-var
  var pollHiveEmitter: EventEmitter | undefined
}

const emitter: EventEmitter = global.pollHiveEmitter ?? new EventEmitter()
emitter.setMaxListeners(500) // allow many concurrent clients
global.pollHiveEmitter = emitter

export type SSEEventType =
  | 'vote_update'      // new vote came in, send updated tally
  | 'session_started'  // host started the session
  | 'session_ended'    // host ended the session
  | 'question_changed' // host moved to next question
  | 'leaderboard'      // updated leaderboard after question

export interface SSEPayload {
  type: SSEEventType
  data: Record<string, unknown>
}

export function emitToRoom(roomCode: string, payload: SSEPayload): void {
  emitter.emit(`room:${roomCode}`, payload)
}

export function subscribeToRoom(
  roomCode: string,
  handler: (payload: SSEPayload) => void
): () => void {
  const event = `room:${roomCode}`
  emitter.on(event, handler)
  // Return an unsubscribe function
  return () => emitter.off(event, handler)
}

export default emitter
