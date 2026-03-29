/**
 * 答题相关 API 接口
 */

import type { ApiResponse, PageResult } from '@/types'
import type {
  Question,
  SubmitAnswerParams,
  AnswerResult,
  RandomQuestionParams
} from '@/types/question'
import { QuestionType, Difficulty } from '@/constants/enums'

// ==========================================
// 虚拟数据
// ==========================================

const mockQuestions: Question[] = [
  {
    question_id: 101,
    question_type: QuestionType.CITY_TO_PROVINCE,
    question_content: '以下城市属于哪个省份？深圳',
    options: [
      { key: 'A', value: '广东省' },
      { key: 'B', value: '福建省' },
      { key: 'C', value: '海南省' },
      { key: 'D', value: '广西省' }
    ],
    correct_answer: 'A',
    difficulty: Difficulty.EASY,
    province: '广东省',
    knowledge_point: '深圳是广东省的副省级城市'
  },
  {
    question_id: 102,
    question_type: QuestionType.CITY_TO_COUNTRY,
    question_content: '东京是哪个国家的首都？',
    options: [
      { key: 'A', value: '韩国' },
      { key: 'B', value: '日本' },
      { key: 'C', value: '中国' },
      { key: 'D', value: '泰国' }
    ],
    correct_answer: 'B',
    difficulty: Difficulty.EASY,
    country: '日本',
    knowledge_point: '东京是日本的首都，也是世界最大的都市圈之一'
  },
  {
    question_id: 103,
    question_type: QuestionType.ANCIENT_TO_MODERN,
    question_content: '古代"金陵"是现在的哪个城市？',
    options: [
      { key: 'A', value: '北京' },
      { key: 'B', value: '西安' },
      { key: 'C', value: '南京' },
      { key: 'D', value: '杭州' }
    ],
    correct_answer: 'C',
    difficulty: Difficulty.NORMAL,
    knowledge_point: '金陵是南京的古称，六朝古都'
  },
  {
    question_id: 104,
    question_type: QuestionType.FLAG_TO_COUNTRY,
    question_content: '星条旗是哪个国家的国旗？',
    question_image: 'https://example.com/flags/usa.png',
    options: [
      { key: 'A', value: '英国' },
      { key: 'B', value: '法国' },
      { key: 'C', value: '美国' },
      { key: 'D', value: '加拿大' }
    ],
    correct_answer: 'C',
    difficulty: Difficulty.EASY,
    country: '美国',
    knowledge_point: '美国国旗称为星条旗，50颗星代表50个州'
  },
  {
    question_id: 105,
    question_type: QuestionType.CITY_TO_PROVINCE,
    question_content: '以下城市属于哪个省份？杭州',
    options: [
      { key: 'A', value: '江苏省' },
      { key: 'B', value: '浙江省' },
      { key: 'C', value: '安徽省' },
      { key: 'D', value: '福建省' }
    ],
    correct_answer: 'B',
    difficulty: Difficulty.EASY,
    province: '浙江省',
    knowledge_point: '杭州是浙江省省会，素有"人间天堂"美誉'
  },
  {
    question_id: 106,
    question_type: QuestionType.CITY_TO_COUNTRY,
    question_content: '悉尼是哪个国家的城市？',
    options: [
      { key: 'A', value: '新西兰' },
      { key: 'B', value: '英国' },
      { key: 'C', value: '澳大利亚' },
      { key: 'D', value: '加拿大' }
    ],
    correct_answer: 'C',
    difficulty: Difficulty.EASY,
    country: '澳大利亚',
    knowledge_point: '悉尼是澳大利亚最大的城市'
  },
  {
    question_id: 107,
    question_type: QuestionType.ANCIENT_TO_MODERN,
    question_content: '古代"汴京"是现在的哪个城市？',
    options: [
      { key: 'A', value: '洛阳' },
      { key: 'B', value: '开封' },
      { key: 'C', value: '郑州' },
      { key: 'D', value: '安阳' }
    ],
    correct_answer: 'B',
    difficulty: Difficulty.HARD,
    knowledge_point: '汴京即开封，北宋都城'
  },
  {
    question_id: 108,
    question_type: QuestionType.CITY_TO_PROVINCE,
    question_content: '以下城市属于哪个省份？武汉',
    options: [
      { key: 'A', value: '湖南省' },
      { key: 'B', value: '湖北省' },
      { key: 'C', value: '河南省' },
      { key: 'D', value: '江西省' }
    ],
    correct_answer: 'B',
    difficulty: Difficulty.EASY,
    province: '湖北省',
    knowledge_point: '武汉是湖北省省会，九省通衢'
  },
  {
    question_id: 109,
    question_type: QuestionType.CITY_TO_COUNTRY,
    question_content: '莫斯科是哪个国家的首都？',
    options: [
      { key: 'A', value: '乌克兰' },
      { key: 'B', value: '白俄罗斯' },
      { key: 'C', value: '俄罗斯' },
      { key: 'D', value: '波兰' }
    ],
    correct_answer: 'C',
    difficulty: Difficulty.EASY,
    country: '俄罗斯',
    knowledge_point: '莫斯科是俄罗斯的首都和最大城市'
  },
  {
    question_id: 110,
    question_type: QuestionType.FLAG_TO_COUNTRY,
    question_content: '枫叶旗是哪个国家的国旗？',
    options: [
      { key: 'A', value: '美国' },
      { key: 'B', value: '加拿大' },
      { key: 'C', value: '澳大利亚' },
      { key: 'D', value: '新西兰' }
    ],
    correct_answer: 'B',
    difficulty: Difficulty.NORMAL,
    country: '加拿大',
    knowledge_point: '加拿大国旗中央有红色枫叶图案'
  }
]

// ==========================================
// API 接口实现
// ==========================================

/**
 * 获取题目列表
 * @param params 查询参数
 * @returns 题目列表
 */
export function getQuestions(params?: {
  question_type?: QuestionType
  difficulty?: Difficulty
  page?: number
  pageSize?: number
}): Promise<ApiResponse<PageResult<Question>>> {
  const page = params?.page || 1
  const pageSize = params?.pageSize || 10

  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredQuestions = [...mockQuestions]

      if (params?.question_type !== undefined) {
        filteredQuestions = filteredQuestions.filter(
          (q) => q.question_type === params.question_type
        )
      }

      if (params?.difficulty !== undefined) {
        filteredQuestions = filteredQuestions.filter(
          (q) => q.difficulty === params.difficulty
        )
      }

      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedList = filteredQuestions.slice(startIndex, endIndex)

      resolve({
        code: 0,
        message: '获取成功',
        data: {
          list: paginatedList,
          total: filteredQuestions.length,
          page,
          pageSize,
          totalPages: Math.ceil(filteredQuestions.length / pageSize)
        }
      })
    }, 200)
  })
}

/**
 * 提交答案
 * @param data 答题数据
 * @returns 答题结果
 */
export function submitAnswer(data: SubmitAnswerParams): Promise<ApiResponse<AnswerResult>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const question = mockQuestions.find((q) => q.question_id === data.question_id)

      if (!question) {
        resolve({
          code: 404,
          message: '题目不存在',
          data: {
            is_correct: false,
            correct_answer: '',
            score: 0,
            combo: 0
          }
        })
        return
      }

      const isCorrect = data.answer === question.correct_answer
      const baseScore = isCorrect ? 100 : 0
      const comboBonus = isCorrect ? Math.floor(Math.random() * 5) : 0

      resolve({
        code: 0,
        message: isCorrect ? '回答正确！' : '回答错误',
        data: {
          is_correct: isCorrect,
          correct_answer: question.correct_answer,
          score: baseScore + comboBonus * 10,
          combo: isCorrect ? comboBonus + 1 : 0,
          knowledge_point: question.knowledge_point
        }
      })
    }, 150)
  })
}

/**
 * 获取随机模式题目
 * @param params 随机题目参数
 * @returns 随机题目列表
 */
export function getRandomQuestions(params?: RandomQuestionParams): Promise<ApiResponse<Question[]>> {
  const count = params?.count || 10

  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredQuestions = [...mockQuestions]

      if (params?.question_type !== undefined) {
        filteredQuestions = filteredQuestions.filter(
          (q) => q.question_type === params.question_type
        )
      }

      if (params?.difficulty !== undefined) {
        filteredQuestions = filteredQuestions.filter(
          (q) => q.difficulty === params.difficulty
        )
      }

      // 随机打乱顺序
      const shuffled = filteredQuestions.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(count, shuffled.length))

      resolve({
        code: 0,
        message: '获取成功',
        data: selected
      })
    }, 200)
  })
}
