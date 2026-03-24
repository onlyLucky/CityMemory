export interface ILevelInfo {
  id: string;
  levelName: string;
  province: string;
  levelOrder: number;
  questionCount: number;
  difficulty: number;
  status: number;
  userStars?: number;
  isUnlocked?: boolean;
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILevelDetail extends ILevelInfo {
  userProgress?: {
    completedQuestions: number;
    totalQuestions: number;
    currentQuestion: number;
  };
}

export interface IStartLevelResult {
  levelId: string;
  questions: IQuestionInfo[];
}

export interface IAnswer {
  questionId: string;
  answer: string;
}

export interface IAnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  blood: number;
  stars?: number;
  isLevelCompleted: boolean;
  nextQuestion?: IQuestionInfo;
}

export interface ICompleteLevelParams {
  stars: number;
  blood: number;
  answers: IAnswer[];
}

export interface ICompleteLevelResult {
  levelId: string;
  stars: number;
  totalStars: number;
  unlockedLevel?: string;
  rewards: {
    stars: number;
    tickets: number;
  };
}
