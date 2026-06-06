import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IPollOption {
  id: string
  text: string
  isCorrect?: boolean
}

export interface IPoll extends Document {
  _id: mongoose.Types.ObjectId
  hostId: mongoose.Types.ObjectId
  title: string
  mode: 'quiz' | 'vote'
  question: string
  options: IPollOption[]
  // Quiz settings
  points?: number
  timerSeconds?: number
  // Vote settings
  anonymous?: boolean
  showResults?: 'after' | 'live' | 'end'
  status: 'draft' | 'live' | 'ended' | 'scheduled'
  roomCode?: string
  activeSessionId?: mongoose.Types.ObjectId
  totalParticipants: number
  createdAt: Date
  updatedAt: Date
}

const PollOptionSchema = new Schema<IPollOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false }
)

const PollSchema = new Schema<IPoll>(
  {
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    mode: { type: String, enum: ['quiz', 'vote'], required: true },
    question: { type: String, required: true },
    options: [PollOptionSchema],
    // Quiz
    points: { type: Number, default: 100 },
    timerSeconds: { type: Number, default: 20 },
    // Vote
    anonymous: { type: Boolean, default: false },
    showResults: {
      type: String,
      enum: ['after', 'live', 'end'],
      default: 'after',
    },
    status: {
      type: String,
      enum: ['draft', 'live', 'ended', 'scheduled'],
      default: 'draft',
    },
    roomCode: { type: String, index: true, sparse: true },
    activeSessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
    totalParticipants: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Poll: Model<IPoll> =
  mongoose.models.Poll ?? mongoose.model<IPoll>('Poll', PollSchema)

export default Poll
