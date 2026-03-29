/**
 * 关卡相关 API 接口
 */

import type { ApiResponse, PageResult } from '@/types'
import type {
  Level,
  LevelDetail,
  UserLevel,
  StartLevelResult,
  SubmitLevelParams,
  SubmitLevelResult,
  LevelProgress
} from '@/types/level'
import { LevelStatus, RegionTheme, Difficulty } from '@/constants/enums'
import type { Question, QuestionOption } from '@/types/question'
import { QuestionType } from '@/constants/enums'

// ==========================================
// 虚拟数据
// ==========================================

const mockQuestions: Question[] = [
  {
    question_id: 1,
    question_type: QuestionType.CITY_TO_PROVINCE,
    question_content: '以下城市属于哪个省份？广州',
    options: [
      { key: 'A', value: '广东省' },
      { key: 'B', value: '广西省' },
      { key: 'C', value: '福建省' },
      { key: 'D', value: '湖南省' }
    ],
    correct_answer: 'A',
    difficulty: Difficulty.EASY,
    province: '广东省',
    knowledge_point: '广东省省会是广州市'
  },
  {
    question_id: 2,
    question_type: QuestionType.CITY_TO_COUNTRY,
    question_content: '巴黎是哪个国家的首都？',
    options: [
      { key: 'A', value: '英国' },
      { key: 'B', value: '德国' },
      { key: 'C', value: '法国' },
      { key: 'D', value: '意大利' }
    ],
    correct_answer: 'C',
    difficulty: Difficulty.EASY,
    country: '法国',
    knowledge_point: '巴黎是法国的首都和最大城市'
  },
  {
    question_id: 3,
    question_type: QuestionType.ANCIENT_TO_MODERN,
    question_content: '古代"长安"是现在的哪个城市？',
    options: [
      { key: 'A', value: '洛阳' },
      { key: 'B', value: '西安' },
      { key: 'C', value: '开封' },
      { key: 'D', value: '南京' }
    ],
    correct_answer: 'B',
    difficulty: Difficulty.NORMAL,
    knowledge_point: '长安是西安的古称，十三朝古都'
  },
  {
    question_id: 4,
    question_type: QuestionType.FLAG_TO_COUNTRY,
    question_content: '红白蓝三色旗是哪个国家的国旗？',
    question_image: 'https://example.com/flags/france.png',
    options: [
      { key: 'A', value: '荷兰' },
      { key: 'B', value: '俄罗斯' },
      { key: 'C', value: '法国' },
      { key: 'D', value: '意大利' }
    ],
    correct_answer: 'C',
    difficulty: Difficulty.NORMAL,
    country: '法国',
    knowledge_point: '法国国旗为蓝白红三色旗'
  },
  {
    question_id: 5,
    question_type: QuestionType.CITY_TO_PROVINCE,
    question_content: '以下城市属于哪个省份？成都',
    options: [
      { key: 'A', value: '云南省' },
      { key: 'B', value: '贵州省' },
      { key: 'C', value: '四川省' },
      { key: 'D', value: '重庆市' }
    ],
    correct_answer: 'C',
    difficulty: Difficulty.EASY,
    province: '四川省',
    knowledge_point: '成都是四川省省会'
  }
]

const mockLevels: Level[] = [
  {
    level_id: 1,
    level_name: '华南初探',
    level_type: 'region',
    region: '华南地区',
    region_theme: RegionTheme.ASIA,
    difficulty: Difficulty.EASY,
    question_count: 10,
    status: LevelStatus.COMPLETED,
    description: '探索华南地区的城市地理知识',
    icon: '/static/icons/level_1.png',
    sort_order: 1
  },
  {
    level_id: 2,
    level_name: '华东漫步',
    level_type: 'region',
    region: '华东地区',
    region_theme: RegionTheme.ASIA,
    difficulty: Difficulty.EASY,
    question_count: 12,
    status: LevelStatus.UNLOCKED,
    description: '漫步华东，领略江南水乡',
    icon: '/static/icons/level_2.png',
    sort_order: 2
  },
  {
    level_id: 3,
    level_name: '华北之旅',
    level_type: 'region',
    region: '华北地区',
    region_theme: RegionTheme.ASIA,
    difficulty: Difficulty.NORMAL,
    question_count: 15,
    status: LevelStatus.LOCKED,
    unlock_condition: '通关"华东漫步"',
    description: '踏上华北大地，感受古都风韵',
    icon: '/static/icons/level_3.png',
    sort_order: 3
  },
  {
    level_id: 4,
    level_name: '欧洲风情',
    level_type: 'region',
    region: '欧洲',
    region_theme: RegionTheme.EUROPE,
    difficulty: Difficulty.NORMAL,
    question_count: 15,
    status: LevelStatus.LOCKED,
    unlock_condition: '通关"华北之旅"',
    description: '穿越欧洲，探索西方文明',
    icon: '/static/icons/level_4.png',
    sort_order: 4
  },
  {
    level_id: 5,
    level_name: '非洲探险',
    level_type: 'region',
    region: '非洲',
    region_theme: RegionTheme.AFRICA,
    difficulty: Difficulty.HARD,
    question_count: 20,
    status: LevelStatus.LOCKED,
    unlock_condition: '通关"欧洲风情"',
    description: '深入非洲大陆，发现神秘文明',
    icon: '/static/icons/level_5.png',
    sort_order: 5
  }
]

const mockUserLevels: UserLevel[] = [
  {
    user_id: 10001,
    level_id: 1,
    status: LevelStatus.COMPLETED,
    stars: 3,
    attempt_count: 2,
    completed_at: '2024-03-15 16:30:00',
    highest_score: 950
  },
  {
    user_id: 10001,
    level_id: 2,
    status: LevelStatus.UNLOCKED,
    stars: 0,
    attempt_count: 0
  }
]

// ==========================================
// API 接口实现
// ==========================================

/**
 * 获取关卡列表
 * @param params 分页参数
 * @returns 关卡列表
 */
export function getLevelList(params?: {
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PageResult<Level>>> {
  const page = params?.page || 1
  const pageSize = params?.pageSize || 10

  return new Promise((resolve) => {
    setTimeout(() => {
      const list: Level[] = mockLevels.map((level) => {
        const userLevel = mockUserLevels.find((ul) => ul.level_id === level.level_id)
        return {
          ...level,
          status: userLevel?.status || level.status
        }
      })

      resolve({
        code: 0,
        message: '获取成功',
        data: {
          list,
          total: mockLevels.length,
          page,
          pageSize,
          totalPages: Math.ceil(mockLevels.length / pageSize)
        }
      })
    }, 200)
  })
}

/**
 * 获取关卡详情
 * @param levelId 关卡ID
 * @returns 关卡详情
 */
export function getLevelDetail(levelId: number): Promise<ApiResponse<LevelDetail>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const level = mockLevels.find((l) => l.level_id === levelId)
      if (!level) {
        reject({
          code: 404,
          message: '关卡不存在',
          data: null
        })
        return
      }

      const userLevel = mockUserLevels.find((ul) => ul.level_id === levelId)
      const prerequisiteLevel = mockLevels.find((l) => l.level_id === levelId - 1)

      const detail: LevelDetail = {
        ...level,
        user_progress: userLevel,
        is_unlocked: level.status !== LevelStatus.LOCKED,
        prerequisite_level_id: prerequisiteLevel?.level_id
      }

      resolve({
        code: 0,
        message: '获取成功',
        data: detail
      })
    }, 200)
  })
}

/**
 * 开始闯关
 * @param levelId 关卡ID
 * @returns 开始闯关结果
 */
export function startLevel(levelId: number): Promise<ApiResponse<StartLevelResult>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const level = mockLevels.find((l) => l.level_id === levelId)
      if (!level) {
        reject({
          code: 404,
          message: '关卡不存在',
          data: null
        })
        return
      }

      if (level.status === LevelStatus.LOCKED) {
        reject({
          code: 403,
          message: '关卡未解锁',
          data: null
        })
        return
      }

      resolve({
        code: 0,
        message: '开始闯关',
        data: {
          session_id: 'session_' + Date.now() + '_' + levelId,
          level,
          questions: mockQuestions,
          health: 3,
          start_time: new Date().toISOString()
        }
      })
    }, 300)
  })
}

/**
 * 完成闯关
 * @param data 提交数据
 * @returns 完成结果
 */
export function finishLevel(data: SubmitLevelParams): Promise<ApiResponse<SubmitLevelResult>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const correctCount = data.answers.filter((a, index) => {
        const question = mockQuestions[index]
        return question && a.answer === question.correct_answer
      }).length

      const totalCount = mockQuestions.length
      const isPassed = correctCount >= Math.ceil(totalCount * 0.6)
      const stars = isPassed ? (correctCount >= totalCount ? 3 : correctCount >= totalCount - 1 ? 2 : 1) : 0
      const score = correctCount * 100
      const coinsEarned = isPassed ? correctCount * 10 : 0

      resolve({
        code: 0,
        message: isPassed ? '恭喜通关！' : '再接再厉！',
        data: {
          is_passed: isPassed,
          stars,
          score,
          correct_count: correctCount,
          total_count: totalCount,
          coins_earned: coinsEarned,
          answer_details: data.answers.map((answer, index) => {
            const question = mockQuestions[index]
            return {
              question_id: answer.question_id,
              question_content: question?.question_content || '',
              user_answer: answer.answer,
              correct_answer: question?.correct_answer || '',
              is_correct: answer.answer === question?.correct_answer,
              knowledge_point: question?.knowledge_point
            }
          })
        }
      })
    }, 300)
  })
}
