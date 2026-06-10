// lib/kafka.ts
import { Kafka, Producer, Consumer } from 'kafkajs'
import { connectDB } from './mongodb'
import Vote from '@/models/Vote'
import Participant from '@/models/Participant'
import Session from '@/models/Session'
import Poll from '@/models/Poll'
import { emitToRoom } from './socket'

declare global {
  var _kafkaProducer: Producer | undefined
}

const kafka = new Kafka({
  clientId: 'pollhive',
  brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
})

// ─── Producer ────────────────────────────────────────────────────────────────

export async function getKafkaProducer(): Promise<Producer> {
  if (global._kafkaProducer) return global._kafkaProducer

  const producer = kafka.producer()
  await producer.connect()
  global._kafkaProducer = producer
  return producer
}

export async function publishVoteEvent(payload: {
  roomCode: string
  sessionId: string
  participantId: string
  optionId: string
}) {
  const producer = await getKafkaProducer()
  await producer.send({
    topic: 'votes',
    messages: [
      {
        key: payload.roomCode,        // same room = same partition = ordered
        value: JSON.stringify(payload),
      },
    ],
  })
}

// ─── Consumer ────────────────────────────────────────────────────────────────

export async function initKafkaConsumer() {
  const consumer: Consumer = kafka.consumer({ groupId: 'vote-processor' })
  await consumer.connect()
  await consumer.subscribe({ topic: 'votes', fromBeginning: false })

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return

      const { roomCode, sessionId, participantId, optionId } =
        JSON.parse(message.value.toString())

      await connectDB()

      const session = await Session.findById(sessionId)
      const poll = await Poll.findById(session?.pollId)
      if (!session || !poll) return

      // Prevent duplicate votes (idempotency)
      const existing = await Vote.findOne({ sessionId, participantId })
      if (existing) return

      const selectedOption = poll.options.find((o) => o.id === optionId)
      if (!selectedOption) return

      const isCorrect = poll.mode === 'quiz' ? Boolean(selectedOption.isCorrect) : false
      let pointsEarned = 0

      if (poll.mode === 'quiz' && isCorrect) {
        const basePoints = poll.points ?? 100
        const timerSeconds = poll.timerSeconds ?? 20
        if (session.timerStartedAt) {
          const elapsed = (Date.now() - session.timerStartedAt.getTime()) / 1000
          const timeRatio = Math.max(0, 1 - elapsed / timerSeconds)
          const timeBonus = Math.round(basePoints * 0.5 * timeRatio)
          pointsEarned = basePoints + timeBonus
        }
      }

      // Save vote
      await Vote.create({ sessionId, participantId, optionId, isCorrect, answeredAt: new Date() })

      // Update participant score
      await Participant.findByIdAndUpdate(participantId, {
        $inc: { score: pointsEarned },
        $push: { answers: { optionId, answeredAt: new Date(), pointsEarned } },
      })

      // Recompute tally and broadcast via Socket.io
      const votes = await Vote.find({ sessionId })
      const tally: Record<string, number> = {}
      for (const o of poll.options) tally[o.id] = 0
      for (const v of votes) tally[v.optionId] = (tally[v.optionId] ?? 0) + 1

      emitToRoom(roomCode, 'vote_update', {
        tally,
        totalVotes: votes.length,
      })
    },
  })

  console.log('[Kafka] Consumer running on topic: votes')
}