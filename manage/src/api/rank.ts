import type { RankItem, RankQuery, RankResult } from '@/types/rank'

const mockRankItems: RankItem[] = Array.from({ length: 100 }, (_, i) => ({
  rank: i + 1,
  userId: `U${String(i + 1).padStart(3, '0')}`,
  nickname: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'][i % 8] + (i > 7 ? i : ''),
  avatar: `https://cube.elemecdn.com/${i % 10}/${i % 10}/${i % 10}03b0d39583f48206768a7534e55bcpng`,
  province: ['北京', '上海', '广东', '江苏', '浙江', '四川', '湖北', '湖南'][i % 8],
  value: Math.floor(1000 - i * 10 + Math.random() * 50),
  levelCount: Math.floor(50 - i * 0.3 + Math.random() * 5),
  createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
}))

export const rankApi = {
  getList(params: RankQuery) {
    return new Promise<RankResult>((resolve) => {
      setTimeout(() => {
        let filteredList = [...mockRankItems]

        if (params.province) {
          filteredList = filteredList.filter(r => r.province === params.province)
        }

        const start = (params.page - 1) * params.pageSize
        const end = start + params.pageSize
        const list = filteredList.slice(start, end)

        resolve({
          list,
          total: filteredList.length,
          page: params.page,
          pageSize: params.pageSize,
          myRank: {
            rank: 5,
            value: 800
          }
        })
      }, 500)
    })
  }
}
