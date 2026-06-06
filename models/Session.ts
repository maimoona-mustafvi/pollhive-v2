import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId
  pollId: mongoose.Types.ObjectId
  hostId: mongoose.Types.ObjectId
  roomCode: string
  status: 'waiting' | 'live' | 'ended'
  currentQuestionIndex: number
  timerStartedAt?: Date
  timerEndsAt?: Date
  participantCount: number
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new Schema<ISession>(
  {
    pollId: {
      type: Schema.Types.ObjectId,
      ref: 'Poll',
      required: true,
      index: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    roomCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'live', 'ended'],
      default: 'waiting',
    },
    currentQuestionIndex: { type: Number, default: 0 },
    timerStartedAt: { type: Date },
    timerEndsAt: { type: Date },
    participantCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Session: Model<ISession> =
  mongoose.models.Session ?? mongoose.model<ISession>('Session', SessionSchema)

export default Session
