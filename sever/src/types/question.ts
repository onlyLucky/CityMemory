export interface IQuestionInfo {
  id: string;
  questionType: number;
  questionContent: string;
  questionImage?: string;
  options: Array<{
    key: string;
    value: string;
  }>;
  difficulty: number;
  region: string;
}

export interface IQuestionDetail extends IQuestionInfo {
  correctAnswer: string;
  status?: number;
  usedCount?: number;
  correctRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRandomQuestionParams {
  region?: string;
  difficulty?: number;
  count?: number;
}

export interface IRandomAnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  currentScore: number;
  totalQuestions: number;
  completedQuestions: number;
}
