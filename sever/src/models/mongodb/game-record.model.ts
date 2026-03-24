import mongoose, { Schema, Document } from 'mongoose';

interface IGameRecord extends Document {
  userId: string;
  levelId: string;
  levelName: string;
  province: string;
  stars: number;
  blood: number;
  answers: Array<{
    questionId: string;
    answer: string;
    isCorrect: boolean;
    timeUsed: number;
  }>;
  completedAt: Date;
  createdAt: Date;
}

const GameRecordSchema = new Schema<IGameRecord>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    levelId: {
      type: String,
      required: true,
      index: true,
    },
    levelName: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      required: true,
    },
    blood: {
      type: Number,
      required: true,
    },
    answers: {
      type: [
        {
          questionId: String,
          answer: String,
          isCorrect: Boolean,
          timeUsed: Number,
        },
      ],
      default: [],
    },
    completedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

GameRecordSchema.index({ userId: 1, completedAt: -1 });
GameRecordSchema.index({ levelId: 1, completedAt: -1 });
GameRecordSchema.index({ province: 1, completedAt: -1 });

export const GameRecord = mongoose.model<IGameRecord>('GameRecord', GameRecordSchema);

export default GameRecord;
