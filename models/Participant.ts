import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IParticipant extends Document {
  _id: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  name: string
  score: number
  rank?: number
  answers: {
    optionId: string
    answeredAt: Date
    timeBonus: number
    pointsEarned: number
  }[]
  createdAt: Date
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    score: { type: Number, default: 0 },
    rank: { type: Number },
    answers: [
      {
        optionId: { type: String, required: true },
        answeredAt: { type: Date, default: Date.now },
        timeBonus: { type: Number, default: 0 },
        pointsEarned: { type: Number, default: 0 },
        _id: false,
      },
    ],
  },
  { timestamps: true }
)

const Participant: Model<IParticipant> =
  mongoose.models.Participant ??
  mongoose.model<IParticipant>('Participant', ParticipantSchema)

export default Participant
