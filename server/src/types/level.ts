export interface Level {
  id: number;
  levelNumber: number;
  regionId: number;
  regionType: number;
  regionName: string;
  difficulty: number;
  questionCount: number;
  starReward: number;
  unlockCondition: string;
  description: string;
  status: number;
  createTime: Date;
  updateTime: Date;
}

export interface LevelDetail extends Level {
  questions?: QuestionForGame[];
}

export interface LevelProgress {
  levelId: number;
  status: number;
  stars: number;
  bestTime: number;
  attempts: number;
  correctCount: number;
  wrongCount: number;
  lastPlayTime: Date;
}

export interface LevelSession {
  sessionId: string;
  userId: number;
  levelId: number;
  questions: number[];
  currentIndex: number;
  startTime: Date;
  endTime?: Date;
  status: number;
}

export interface StartLevelResult {
  sessionId: string;
  levelId: number;
  levelNumber: number;
  questionCount: number;
  questions: QuestionForGame[];
}

export interface EndLevelInput {
  sessionId: string;
  answers: AnswerInput[];
}

export interface EndLevelResult {
  sessionId: string;
  levelId: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  stars: number;
  duration: number;
  starReward: number;
}

export interface AnswerInput {
  questionId: number;
  answer: string;
  timeSpent: number;
}

export interface QuestionForGame {
  id: number;
  questionType: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  imageUrl?: string;
  audioUrl?: string;
}
