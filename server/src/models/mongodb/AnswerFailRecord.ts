import mongoose, { Document, Schema } from 'mongoose';

export interface AnswerFailRecordDocument extends Document {
  userId: number;
  levelId: number;
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  failCount: number;
  lastFailTime: Date;
  createTime: Date;
  updateTime: Date;
}

const AnswerFailRecordSchema = new Schema(
  {
    userId: { type: Number, required: true, index: true },
    levelId: { type: Number, required: true },
    questionId: { type: Number, required: true },
    userAnswer: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    failCount: { type: Number, default: 1 },
    lastFailTime: { type: Date, default: Date.now },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
  },
  {
    collection: 'answer_fail_record',
    timestamps: {
      createdAt: 'createTime',
      updatedAt: 'updateTime',
    },
  },
);

AnswerFailRecordSchema.index({ userId: 1, questionId: 1 }, { unique: true });
AnswerFailRecordSchema.index({ userId: 1, levelId: 1 });

export const AnswerFailRecord = mongoose.model<AnswerFailRecordDocument>(
  'AnswerFailRecord',
  AnswerFailRecordSchema,
);
