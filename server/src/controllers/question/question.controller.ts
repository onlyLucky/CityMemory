import { Context } from 'koa';
import QuestionService from '../../services/question/question.service';
import { success } from '../../utils/response';

class QuestionController {
  async getRandomQuestions(ctx: Context) {
    const data = ctx.validatedData as {
      levelId?: number;
      count?: number;
      difficulty?: number;
    };
    const questions = await QuestionService.getRandomQuestions(
      data.count || 5,
      undefined,
      data.difficulty,
    );
    success(ctx, questions);
  }

  async submitAnswer(ctx: Context) {
    const data = ctx.validatedData as {
      questionId: string;
      answer: string;
      timeSpent: number;
    };
    const result = await QuestionService.submitRandomAnswer(
      data.questionId,
      data.answer,
      data.timeSpent,
    );
    success(ctx, result);
  }
}

export default new QuestionController();
