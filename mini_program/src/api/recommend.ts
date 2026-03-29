/**
 * 推荐相关 API 接口
 */

import type { ApiResponse } from '@/types'
import type { DailyRecommend, Question } from '@/types/question'
import { QuestionType, Difficulty } from '@/constants/enums'

// ==========================================
// 虚拟数据
// ==========================================

const mockRecommendQuestions: DailyRecommend[] = [
  {
    recommend_id: 1,
    question: {
      question_id: 201,
      question_type: QuestionType.CITY_TO_PROVINCE,
      question_content: '以下城市属于哪个省份？厦门',
      options: [
        { key: 'A', value: '广东省' },
        { key: 'B', value: '福建省' },
        { key: 'C', value: '浙江省' },
        { key: 'D', value: '江苏省' }
      ],
      correct_answer: 'B',
      difficulty: Difficulty.EASY,
      province: '福建省',
      knowledge_point: '厦门是福建省的副省级城市，经济特区'
    },
    recommend_date: '2024-03-20',
    reason: '热门城市，了解经济特区'
  },
  {
    recommend_id: 2,
    question: {
      question_id: 202,
      question_type: QuestionType.ANCIENT_TO_MODERN,
      question_content: '古代"姑苏"是现在的哪个城市？',
      options: [
        { key: 'A', value: '杭州' },
        { key: 'B', value: '苏州' },
        { key: 'C', value: '扬州' },
        { key: 'D', value: '常州' }
      ],
      correct_answer: 'B',
      difficulty: Difficulty.NORMAL,
      knowledge_point: '姑苏是苏州的古称，"姑苏城外寒山寺"'
    },
    recommend_date: '2024-03-20',
    reason: '诗词中的地理知识'
  },
  {
    recommend_id: 3,
    question: {
      question_id: 203,
      question_type: QuestionType.CITY_TO_COUNTRY,
      question_content: '开罗是哪个国家的首都？',
      options: [
        { key: 'A', value: '埃及' },
        { key: 'B', value: '摩洛哥' },
        { key: 'C', value: '利比亚' },
        { key: 'D', value: '苏丹' }
      ],
      correct_answer: 'A',
      difficulty: Difficulty.NORMAL,
      country: '埃及',
      knowledge_point: '开罗是埃及首都，非洲最大城市'
    },
    recommend_date: '2024-03-20',
    reason: '探索非洲文明'
  }
]

// 当前推荐索引
let currentRecommendIndex = 0

// ==========================================
// API 接口实现
// ==========================================

/**
 * 获取今日推荐
 * @returns 今日推荐题目
 */
export function getTodayRecommend(): Promise<ApiResponse<DailyRecommend>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 循环返回推荐题目
      const recommend = mockRecommendQuestions[currentRecommendIndex]
      currentRecommendIndex = (currentRecommendIndex + 1) % mockRecommendQuestions.length

      resolve({
        code: 0,
        message: '获取成功',
        data: {
          ...recommend,
          recommend_date: new Date().toISOString().split('T')[0]
        }
      })
    }, 200)
  })
}
