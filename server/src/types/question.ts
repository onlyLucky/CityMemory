export interface Question {
  id: number;
  levelId: number;
  questionType: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  explanation?: string;
  imageUrl?: string;
  audioUrl?: string;
  difficulty: number;
  status: number;
  createTime: Date;
  updateTime: Date;
}

export interface QuestionDetail extends Question {
  level?: {
    id: number;
    levelNumber: number;
    regionName: string;
  };
}

export interface RandomQuestionInput {
  count?: number;
  region?: string;
  difficulty?: number;
}

export interface RandomQuestionResult {
  questionId: string;
  questionType: number;
  questionContent: string;
  cityId: string;
  cityName: string;
  provinceId?: string;
  provinceName?: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  key: string;
  value: string;
}

export interface AnswerResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface AnswerFailRecord {
  userId: number;
  levelId: number;
  questionId: number;
  questionType: number;
  questionContent: string;
  cityId: string;
  cityName: string;
  provinceId?: string;
  provinceName?: string;
  userAnswer: string;
  correctAnswer: string;
  options: QuestionOption[];
  timeSpent: number;
  failCount: number;
  lastFailTime: Date;
}
