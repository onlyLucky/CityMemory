/**
 * 题目相关类型定义
 */

import { QuestionType, Difficulty } from '../constants/enums'

/** 题目选项接口 */
export interface QuestionOption {
  /** 选项键 (A, B, C, D) */
  key: string
  /** 选项值 */
  value: string
}

/** 题目接口 */
export interface Question {
  /** 题目ID */
  question_id: number
  /** 题目类型 */
  question_type: QuestionType
  /** 题目内容 */
  question_content: string
  /** 题目图片URL */
  question_image?: string
  /** 选项列表 */
  options: QuestionOption[]
  /** 正确答案 */
  correct_answer: string
  /** 难度等级 */
  difficulty: Difficulty
  /** 分类 */
  category?: string
  /** 所属省份 */
  province?: string
  /** 所属国家 */
  country?: string
  /** 知识点 */
  knowledge_point?: string
}

/** 答题结果接口 */
export interface AnswerResult {
  /** 是否正确 */
  is_correct: boolean
  /** 正确答案 */
  correct_answer: string
  /** 获得分数 */
  score: number
  /** 当前连击数 */
  combo: number
  /** 知识点解释 */
  knowledge_point?: string
}

/** 提交答案参数 */
export interface SubmitAnswerParams {
  /** 题目ID */
  question_id: number
  /** 用户答案 */
  answer: string
  /** 关卡会话ID */
  session_id?: string
  /** 答题用时（秒） */
  time_used?: number
}

/** 随机题目请求参数 */
export interface RandomQuestionParams {
  /** 题目类型 */
  question_type?: QuestionType
  /** 难度等级 */
  difficulty?: Difficulty
  /** 题目数量 */
  count?: number
}

/** 每日推荐题目接口 */
export interface DailyRecommend {
  /** 推荐ID */
  recommend_id: number
  /** 题目信息 */
  question: Question
  /** 推荐日期 */
  recommend_date: string
  /** 推荐理由 */
  reason?: string
}

/** 题目统计接口 */
export interface QuestionStats {
  /** 总答题数 */
  total_answered: number
  /** 正确数 */
  correct_count: number
  /** 错误数 */
  wrong_count: number
  /** 正确率 */
  accuracy: number
  /** 各类型正确率 */
  type_accuracy: Record<string, number>
}
