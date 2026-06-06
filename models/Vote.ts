import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IVote extends Document {
  _id: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  participantId: mongoose.Types.ObjectId
  optionId: string
  isCorrect: boolean
  answeredAt: Date
  createdAt: Date
}

const VoteSchema = new Schema<IVote>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    participantId: {
      type: Schema.Types.ObjectId,
      ref: 'Participant',
      required: true,
    },
    optionId: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
    answeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Prevent duplicate votes per participant
VoteSchema.index({ sessionId: 1, participantId: 1 }, { unique: true })

const Vote: Model<IVote> =
  mongoose.models.Vote ?? mongoose.model<IVote>('Vote', VoteSchema)

export default Vote
