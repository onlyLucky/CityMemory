import mongoose, { Schema, Document } from 'mongoose';

interface IUserProgress extends Document {
  userId: string;
  province: string;
  unlockedLevels: string[];
  currentLevel: string;
  levelStars: Record<string, number>;
  completedLevels: string[];
  attemptCount: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    province: {
      type: String,
      required: true,
      default: '',
    },
    unlockedLevels: {
      type: [String],
      default: [],
    },
    currentLevel: {
      type: String,
      default: '',
    },
    levelStars: {
      type: Map,
      of: Number,
      default: {},
    },
    completedLevels: {
      type: [String],
      default: [],
    },
    attemptCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

UserProgressSchema.index({ userId: 1 });
UserProgressSchema.index({ province: 1 });
UserProgressSchema.index({ unlockedLevels: 1 });

export const UserProgress = mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

export default UserProgress;
