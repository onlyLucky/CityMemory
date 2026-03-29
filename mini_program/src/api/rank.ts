/**
 * 排行榜相关 API 接口
 */

import type { ApiResponse, PageResult } from '@/types'
import type { RankItem, RankListParams, RankData } from '@/types/rank'
import { RankType } from '@/constants/enums'

// ==========================================
// 虚拟数据
// ==========================================

const mockRankItems: RankItem[] = [
  {
    rank: 1,
    user_id: 10086,
    nickname: '地理达人',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/1',
    total_stars: 520,
    level_count: 45,
    coins: 15800
  },
  {
    rank: 2,
    user_id: 10087,
    nickname: '旅行家小红',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/2',
    total_stars: 486,
    level_count: 42,
    coins: 12300
  },
  {
    rank: 3,
    user_id: 10088,
    nickname: '知识探索者',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/3',
    total_stars: 455,
    level_count: 40,
    coins: 10500
  },
  {
    rank: 4,
    user_id: 10089,
    nickname: '地图控',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/4',
    total_stars: 412,
    level_count: 38,
    coins: 9800
  },
  {
    rank: 5,
    user_id: 10090,
    nickname: '环球旅行者',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/5',
    total_stars: 398,
    level_count: 35,
    coins: 8500
  },
  {
    rank: 6,
    user_id: 10091,
    nickname: '城市猎人',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/6',
    total_stars: 375,
    level_count: 33,
    coins: 7200
  },
  {
    rank: 7,
    user_id: 10092,
    nickname: '地理学霸',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/7',
    total_stars: 350,
    level_count: 30,
    coins: 6500
  },
  {
    rank: 8,
    user_id: 10093,
    nickname: '世界公民',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/8',
    total_stars: 320,
    level_count: 28,
    coins: 5800
  },
  {
    rank: 9,
    user_id: 10094,
    nickname: '地理爱好者',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/9',
    total_stars: 295,
    level_count: 25,
    coins: 4500
  },
  {
    rank: 10,
    user_id: 10095,
    nickname: '小地图迷',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/10',
    total_stars: 280,
    level_count: 24,
    coins: 4200
  },
  {
    rank: 11,
    user_id: 10096,
    nickname: '行者无疆',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/11',
    total_stars: 265,
    level_count: 22,
    coins: 3800
  },
  {
    rank: 12,
    user_id: 10097,
    nickname: '地理小能手',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/12',
    total_stars: 250,
    level_count: 20,
    coins: 3500
  },
  {
    rank: 13,
    user_id: 10098,
    nickname: '探索者',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/13',
    total_stars: 230,
    level_count: 18,
    coins: 3000
  },
  {
    rank: 14,
    user_id: 10099,
    nickname: '旅行新手',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/14',
    total_stars: 200,
    level_count: 15,
    coins: 2500
  },
  {
    rank: 15,
    user_id: 10100,
    nickname: '地理萌新',
    avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/15',
    total_stars: 180,
    level_count: 13,
    coins: 2000
  }
]

// 当前用户排名
const mockMyRank: RankItem = {
  rank: 25,
  user_id: 10001,
  nickname: '旅行者小明',
  avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/xxx/132',
  total_stars: 156,
  level_count: 12,
  coins: 2580
}

// ==========================================
// API 接口实现
// ==========================================

/**
 * 获取星级排行
 * @param params 查询参数
 * @returns 排行榜数据
 */
export function getStarRank(params?: RankListParams): Promise<ApiResponse<RankData>> {
  const page = params?.page || 1
  const pageSize = params?.pageSize || 10

  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedList = mockRankItems.slice(startIndex, endIndex)

      resolve({
        code: 0,
        message: '获取成功',
        data: {
          list: paginatedList,
          my_rank: page === 1 ? mockMyRank : undefined,
          total: mockRankItems.length,
          update_time: new Date().toISOString()
        }
      })
    }, 200)
  })
}

/**
 * 获取关卡排行
 * @param params 查询参数
 * @returns 排行榜数据
 */
export function getLevelRank(params?: RankListParams): Promise<ApiResponse<RankData>> {
  const page = params?.page || 1
  const pageSize = params?.pageSize || 10

  return new Promise((resolve) => {
    setTimeout(() => {
      // 按关卡数排序
      const sortedByLevel = [...mockRankItems].sort((a, b) => b.level_count - a.level_count)
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedList = sortedByLevel.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        rank: startIndex + index + 1
      }))

      resolve({
        code: 0,
        message: '获取成功',
        data: {
          list: paginatedList,
          my_rank: {
            ...mockMyRank,
            rank: 28
          },
          total: sortedByLevel.length,
          update_time: new Date().toISOString()
        }
      })
    }, 200)
  })
}

/**
 * 获取我的排名
 * @returns 我的排名信息
 */
export function getMyRank(): Promise<ApiResponse<RankItem>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '获取成功',
        data: mockMyRank
      })
    }, 150)
  })
}
