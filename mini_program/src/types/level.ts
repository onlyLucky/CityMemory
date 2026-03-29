/**
 * 关卡相关类型定义
 */

import { LevelStatus, RegionTheme, Difficulty } from '../constants/enums'

/** 关卡接口 */
export interface Level {
  /** 关卡ID */
  level_id: number
  /** 关卡名称 */
  level_name: string
  /** 关卡类型 */
  level_type: string
  /** 区域 */
  region: string
  /** 区域主题 */
  region_theme: RegionTheme
  /** 难度等级 */
  difficulty: Difficulty
  /** 题目数量 */
  question_count: number
  /** 解锁条件 */
  unlock_condition?: string
  /** 关卡状态 */
  status: LevelStatus
  /** 关卡描述 */
  description?: string
  /** 关卡图标 */
  icon?: string
  /** 排序 */
  sort_order: number
}

/** 用户关卡接口 */
export interface UserLevel {
  /** 用户ID */
  user_id: number
  /** 关卡ID */
  level_id: number
  /** 关卡状态 */
  status: LevelStatus
  /** 获得星数 */
  stars: number
  /** 尝试次数 */
  attempt_count: number
  /** 完成时间 */
  completed_at?: string
  /** 最高分 */
  highest_score?: number
}

/** 关卡详情接口 */
export interface LevelDetail extends Level {
  /** 用户关卡进度 */
  user_progress?: UserLevel
  /** 是否解锁 */
  is_unlocked: boolean
  /** 前置关卡ID */
  prerequisite_level_id?: number
}

/** 开始关卡参数 */
export interface StartLevelParams {
  /** 关卡ID */
  level_id: number
}

/** 开始关卡结果 */
export interface StartLevelResult {
  /** 会话ID */
  session_id: string
  /** 关卡信息 */
  level: Level
  /** 题目列表 */
  questions: Question[]
  /** 初始血量 */
  health: number
  /** 开始时间 */
  start_time: string
}

/** 提交关卡参数 */
export interface SubmitLevelParams {
  /** 会话ID */
  session_id: string
  /** 答题记录 */
  answers: LevelAnswer[]
}

/** 关卡答题记录 */
export interface LevelAnswer {
  /** 题目ID */
  question_id: number
  /** 用户答案 */
  answer: string
  /** 答题用时（秒） */
  time_used: number
}

/** 提交关卡结果 */
export interface SubmitLevelResult {
  /** 是否通关 */
  is_passed: boolean
  /** 获得星数 */
  stars: number
  /** 获得分数 */
  score: number
  /** 正确题数 */
  correct_count: number
  /** 总题数 */
  total_count: number
  /** 获得金币 */
  coins_earned: number
  /** 答题详情 */
  answer_details: AnswerDetail[]
}

/** 答题详情 */
export interface AnswerDetail {
  /** 题目ID */
  question_id: number
  /** 题目内容 */
  question_content: string
  /** 用户答案 */
  user_answer: string
  /** 正确答案 */
  correct_answer: string
  /** 是否正确 */
  is_correct: boolean
  /** 知识点 */
  knowledge_point?: string
}

/** 关卡进度接口 */
export interface LevelProgress {
  /** 关卡ID */
  level_id: number
  /** 关卡名称 */
  level_name: string
  /** 区域主题 */
  region_theme: RegionTheme
  /** 状态 */
  status: LevelStatus
  /** 星数 */
  stars: number
  /** 最大星数 */
  max_stars: number
}

// 引入Question类型避免循环依赖
import { Question } from './question'
