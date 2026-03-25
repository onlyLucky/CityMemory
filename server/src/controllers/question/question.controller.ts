import { Context } from 'koa';
import QuestionService from '../../services/question/question.service';
import { success } from '../../utils/response';

class QuestionController {
  async getRandomQuestions(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      levelId: number;
      count?: number;
    };
    const questions = await QuestionService.getRandomQuestions(userId, data.levelId, data.count);
    success(ctx, questions);
  }

  async submitAnswer(ctx: Context) {
    const userId = parseInt(ctx.user!.userId);
    const data = ctx.validatedData as {
      sessionId: string;
      questionId: number;
      answer: string;
      timeSpent: number;
    };
    const result = await QuestionService.submitAnswer(
      userId,
      data.sessionId,
      data.questionId,
      data.answer,
      data.timeSpent,
    );
    success(ctx, result);
  }
}

export default new QuestionController();
