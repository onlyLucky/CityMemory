import { Context } from 'koa';
import { QuestionService } from '@/services/question/question.service';
import { success, error } from '@/utils/response';
import { logger } from '@/utils/logger';

export class QuestionController {
  private questionService: QuestionService;

  constructor() {
    this.questionService = new QuestionService();
  }

  getRandomQuestions = async (ctx: Context) => {
    try {
      const params = ctx.query;

      const questions = await this.questionService.getRandomQuestions(params as any);

      success(ctx, questions);
    } catch (err) {
      logger.error('获取随机题目失败', err);
      error(ctx, err);
    }
  };

  getQuestionDetail = async (ctx: Context) => {
    try {
      const { id } = ctx.params;

      const question = await this.questionService.getQuestionDetail(id);

      success(ctx, question);
    } catch (err) {
      logger.error('获取题目详情失败', err);
      error(ctx, err);
    }
  };

  validateAnswer = async (ctx: Context) => {
    try {
      const { questionId, answer } = ctx.request.body;

      const result = await this.questionService.validateAnswer(questionId, answer);

      success(ctx, result);
    } catch (err) {
      logger.error('验证答案失败', err);
      error(ctx, err);
    }
  };
}

export default QuestionController;
