import mongoose, { Document, Schema } from 'mongoose';

export interface AnswerRecordData {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface GameRecordDocument extends Document {
  userId: number;
  levelId: number;
  sessionId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  stars: number;
  isCompleted: boolean;
  answers: AnswerRecordData[];
  createTime: Date;
}

const AnswerRecordSchema = new Schema(
  {
    questionId: { type: Number, required: true },
    userAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    timeSpent: { type: Number, required: true },
  },
  { _id: false },
);

const GameRecordSchema = new Schema(
  {
    userId: { type: Number, required: true, index: true },
    levelId: { type: Number, required: true, index: true },
    sessionId: { type: String, required: true, unique: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    wrongCount: { type: Number, required: true },
    stars: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    answers: { type: [AnswerRecordSchema], default: [] },
    createTime: { type: Date, default: Date.now },
  },
  {
    collection: 'game_record',
    timestamps: {
      createdAt: 'createTime',
    },
  },
);

GameRecordSchema.index({ userId: 1, levelId: 1, startTime: -1 });
GameRecordSchema.index({ userId: 1, startTime: -1 });

export const GameRecord = mongoose.model<GameRecordDocument>('GameRecord', GameRecordSchema);
