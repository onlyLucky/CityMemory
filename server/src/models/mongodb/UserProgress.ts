import mongoose, { Document, Schema } from 'mongoose';

export interface LevelProgressData {
  levelId: number;
  status: number;
  stars: number;
  bestTime: number;
  attempts: number;
  correctCount: number;
  wrongCount: number;
  lastPlayTime: Date;
}

export interface UserProgressDocument extends Document {
  userId: number;
  levelProgress: Map<string, LevelProgressData>;
  totalStars: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  createTime: Date;
  updateTime: Date;
}

const LevelProgressSchema = new Schema(
  {
    levelId: { type: Number, required: true },
    status: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    bestTime: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    lastPlayTime: { type: Date, default: null },
  },
  { _id: false },
);

const UserProgressSchema = new Schema(
  {
    userId: { type: Number, required: true, unique: true },
    levelProgress: { type: Map, of: LevelProgressSchema, default: {} },
    totalStars: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalWrong: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
  },
  {
    collection: 'user_progress',
    timestamps: {
      createdAt: 'createTime',
      updatedAt: 'updateTime',
    },
  },
);

UserProgressSchema.pre('save', function (next) {
  this.updateTime = new Date();
  if (this.totalCorrect + this.totalWrong > 0) {
    this.accuracy = Math.round((this.totalCorrect / (this.totalCorrect + this.totalWrong)) * 100);
  }
  next();
});

export const UserProgress = mongoose.model<UserProgressDocument>('UserProgress', UserProgressSchema);
