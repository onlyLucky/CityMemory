export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export const QUESTION_TYPES = {
  CITY_TO_PROVINCE: 1,
  CITY_TO_COUNTRY: 2,
  ANCIENT_TO_MODERN: 3,
  FLAG_TO_COUNTRY: 4
} as const

export const REGION_THEMES = {
  ASIA: '亚洲',
  MIDDLE_EAST: '中东',
  EUROPE: '欧洲',
  AFRICA: '非洲',
  AMERICAS: '美洲'
} as const

export const TICKET_CONFIG = {
  ADVENTURE_MAX: 30,
  ADVENTURE_RECOVER_TIME: 600,
  RANDOM_MAX: 3
} as const

export const STAR_CONFIG = {
  MAX_STARS: 5,
  PERFECT_STARS: 6,
  TIME_BONUS_THRESHOLD: 5
} as const

export const PROVINCES = [
  '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
  '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
  '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
  '海南省', '重庆市', '四川省', '贵州省', '云南省',
  '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
  '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区', '台湾省'
] as const
