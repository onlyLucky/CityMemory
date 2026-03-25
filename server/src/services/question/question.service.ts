import QuestionBank from '../../models/mysql/QuestionBank';
import { ERROR_CODES, AppError } from '../../constants/error';
import { RandomQuestionResult, AnswerResult } from '../../types/question';

export class QuestionService {
  async getRandomQuestions(
    count: number = 5,
    region?: string,
    difficulty?: number,
  ): Promise<RandomQuestionResult[]> {
    const where: any = { status: 1 };
    
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const questions = await QuestionBank.findAll({
      where,
      order: [['id', 'ASC']],
    });

    const shuffled = this.shuffleArray(questions).slice(0, count);

    return shuffled.map((q) => ({
      questionId: String(q.id),
      questionType: q.questionType,
      questionContent: q.questionText,
      cityId: String(q.levelId),
      cityName: '',
      provinceId: undefined,
      provinceName: undefined,
      options: [
        { key: 'A', value: q.optionA },
        { key: 'B', value: q.optionB },
        ...(q.optionC ? [{ key: 'C', value: q.optionC }] : []),
        ...(q.optionD ? [{ key: 'D', value: q.optionD }] : []),
      ],
    }));
  }

  async submitRandomAnswer(
    questionId: string,
    userAnswer: string,
    timeSpent: number,
  ): Promise<AnswerResult> {
    const question = await QuestionBank.findByPk(parseInt(questionId, 10));
    
    if (!question) {
      throw new AppError(ERROR_CODES.QUESTION_NOT_FOUND, '题目不存在');
    }

    const isCorrect = userAnswer.toUpperCase() === question.correctAnswer.toUpperCase();

    return {
      questionId,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation,
    };
  }

  async getQuestion(questionId: number) {
    const question = await QuestionBank.findByPk(questionId);
    if (!question) {
      throw new AppError(ERROR_CODES.QUESTION_NOT_FOUND, '题目不存在');
    }

    return {
      id: question.id,
      levelId: question.levelId,
      questionType: question.questionType,
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      imageUrl: question.imageUrl,
      audioUrl: question.audioUrl,
      difficulty: question.difficulty,
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export default new QuestionService();
