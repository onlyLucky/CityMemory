import mongoose, { Document, Schema } from 'mongoose';

export interface LevelSessionDocument extends Document {
  sessionId: string;
  userId: number;
  levelId: number;
  questions: number[];
  currentIndex: number;
  startTime: Date;
  endTime: Date | null;
  status: number;
  createTime: Date;
  updateTime: Date;
}

const LevelSessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    userId: { type: Number, required: true, index: true },
    levelId: { type: Number, required: true },
    questions: { type: [Number], required: true },
    currentIndex: { type: Number, default: 0 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null },
    status: { type: Number, default: 0 },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
  },
  {
    collection: 'level_session',
    timestamps: {
      createdAt: 'createTime',
      updatedAt: 'updateTime',
    },
  },
);

LevelSessionSchema.index({ userId: 1, levelId: 1, status: 1 });
LevelSessionSchema.index({ startTime: 1 }, { expireAfterSeconds: 7200 });

export const LevelSession = mongoose.model<LevelSessionDocument>('LevelSession', LevelSessionSchema);
