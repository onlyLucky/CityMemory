/**
 * 题目生成器
 * 支持生成4种题型：城市猜省份、城市猜国家、古称猜今名、国旗猜国家
 */

import { QuestionType, Difficulty } from '../constants/enums'
import type { Question, QuestionOption } from '../types/question'
import { shuffle, randomInt } from './index'

/** 城市数据接口 */
interface CityData {
  name: string
  province: string
  country: string
  region: string
}

/** 国家数据接口 */
interface CountryData {
  name: string
  region: string
  flag?: string
}

/** 古称数据接口 */
interface AncientNameData {
  ancient: string
  modern: string
  province?: string
  country?: string
}

/** 虚拟城市数据 */
const CITIES: CityData[] = [
  // 中国城市
  { name: '北京', province: '北京市', country: '中国', region: '亚洲' },
  { name: '上海', province: '上海市', country: '中国', region: '亚洲' },
  { name: '广州', province: '广东省', country: '中国', region: '亚洲' },
  { name: '深圳', province: '广东省', country: '中国', region: '亚洲' },
  { name: '杭州', province: '浙江省', country: '中国', region: '亚洲' },
  { name: '南京', province: '江苏省', country: '中国', region: '亚洲' },
  { name: '成都', province: '四川省', country: '中国', region: '亚洲' },
  { name: '武汉', province: '湖北省', country: '中国', region: '亚洲' },
  { name: '西安', province: '陕西省', country: '中国', region: '亚洲' },
  { name: '重庆', province: '重庆市', country: '中国', region: '亚洲' },
  { name: '天津', province: '天津市', country: '中国', region: '亚洲' },
  { name: '苏州', province: '江苏省', country: '中国', region: '亚洲' },
  { name: '长沙', province: '湖南省', country: '中国', region: '亚洲' },
  { name: '郑州', province: '河南省', country: '中国', region: '亚洲' },
  { name: '青岛', province: '山东省', country: '中国', region: '亚洲' },
  { name: '大连', province: '辽宁省', country: '中国', region: '亚洲' },
  { name: '厦门', province: '福建省', country: '中国', region: '亚洲' },
  { name: '昆明', province: '云南省', country: '中国', region: '亚洲' },
  { name: '哈尔滨', province: '黑龙江省', country: '中国', region: '亚洲' },
  { name: '沈阳', province: '辽宁省', country: '中国', region: '亚洲' },
  // 日本城市
  { name: '东京', province: '东京都', country: '日本', region: '亚洲' },
  { name: '大阪', province: '大阪府', country: '日本', region: '亚洲' },
  { name: '京都', province: '京都府', country: '日本', region: '亚洲' },
  { name: '横滨', province: '神奈川县', country: '日本', region: '亚洲' },
  // 韩国城市
  { name: '首尔', province: '首尔特别市', country: '韩国', region: '亚洲' },
  { name: '釜山', province: '釜山广域市', country: '韩国', region: '亚洲' },
  // 泰国城市
  { name: '曼谷', province: '曼谷直辖市', country: '泰国', region: '亚洲' },
  { name: '清迈', province: '清迈府', country: '泰国', region: '亚洲' },
  // 欧洲城市
  { name: '巴黎', province: '法兰西岛大区', country: '法国', region: '欧洲' },
  { name: '伦敦', province: '英格兰', country: '英国', region: '欧洲' },
  { name: '柏林', province: '柏林州', country: '德国', region: '欧洲' },
  { name: '罗马', province: '拉齐奥大区', country: '意大利', region: '欧洲' },
  { name: '马德里', province: '马德里自治区', country: '西班牙', region: '欧洲' },
  { name: '阿姆斯特丹', province: '北荷兰省', country: '荷兰', region: '欧洲' },
  { name: '维也纳', province: '维也纳州', country: '奥地利', region: '欧洲' },
  { name: '布拉格', province: '布拉格直辖市', country: '捷克', region: '欧洲' },
  // 美洲城市
  { name: '纽约', province: '纽约州', country: '美国', region: '美洲' },
  { name: '洛杉矶', province: '加利福尼亚州', country: '美国', region: '美洲' },
  { name: '芝加哥', province: '伊利诺伊州', country: '美国', region: '美洲' },
  { name: '多伦多', province: '安大略省', country: '加拿大', region: '美洲' },
  { name: '温哥华', province: '不列颠哥伦比亚省', country: '加拿大', region: '美洲' },
  { name: '墨西哥城', province: '墨西哥联邦区', country: '墨西哥', region: '美洲' },
  { name: '里约热内卢', province: '里约热内卢州', country: '巴西', region: '美洲' },
  { name: '布宜诺斯艾利斯', province: '布宜诺斯艾利斯省', country: '阿根廷', region: '美洲' },
  // 非洲城市
  { name: '开罗', province: '开罗省', country: '埃及', region: '非洲' },
  { name: '开普敦', province: '西开普省', country: '南非', region: '非洲' },
  { name: '内罗毕', province: '内罗毕省', country: '肯尼亚', region: '非洲' },
  // 中东城市
  { name: '迪拜', province: '迪拜酋长国', country: '阿联酋', region: '中东' },
  { name: '伊斯坦布尔', province: '伊斯坦布尔省', country: '土耳其', region: '中东' },
  { name: '耶路撒冷', province: '耶路撒冷区', country: '以色列', region: '中东' },
]

/** 虚拟国家数据 */
const COUNTRIES: CountryData[] = [
  // 亚洲国家
  { name: '中国', region: '亚洲', flag: '🇨🇳' },
  { name: '日本', region: '亚洲', flag: '🇯🇵' },
  { name: '韩国', region: '亚洲', flag: '🇰🇷' },
  { name: '泰国', region: '亚洲', flag: '🇹🇭' },
  { name: '越南', region: '亚洲', flag: '🇻🇳' },
  { name: '新加坡', region: '亚洲', flag: '🇸🇬' },
  { name: '马来西亚', region: '亚洲', flag: '🇲🇾' },
  { name: '印度尼西亚', region: '亚洲', flag: '🇮🇩' },
  { name: '菲律宾', region: '亚洲', flag: '🇵🇭' },
  { name: '印度', region: '亚洲', flag: '🇮🇳' },
  // 欧洲国家
  { name: '法国', region: '欧洲', flag: '🇫🇷' },
  { name: '英国', region: '欧洲', flag: '🇬🇧' },
  { name: '德国', region: '欧洲', flag: '🇩🇪' },
  { name: '意大利', region: '欧洲', flag: '🇮🇹' },
  { name: '西班牙', region: '欧洲', flag: '🇪🇸' },
  { name: '荷兰', region: '欧洲', flag: '🇳🇱' },
  { name: '瑞士', region: '欧洲', flag: '🇨🇭' },
  { name: '奥地利', region: '欧洲', flag: '🇦🇹' },
  { name: '希腊', region: '欧洲', flag: '🇬🇷' },
  { name: '葡萄牙', region: '欧洲', flag: '🇵🇹' },
  // 美洲国家
  { name: '美国', region: '美洲', flag: '🇺🇸' },
  { name: '加拿大', region: '美洲', flag: '🇨🇦' },
  { name: '墨西哥', region: '美洲', flag: '🇲🇽' },
  { name: '巴西', region: '美洲', flag: '🇧🇷' },
  { name: '阿根廷', region: '美洲', flag: '🇦🇷' },
  { name: '智利', region: '美洲', flag: '🇨🇱' },
  { name: '哥伦比亚', region: '美洲', flag: '🇨🇴' },
  { name: '秘鲁', region: '美洲', flag: '🇵🇪' },
  // 非洲国家
  { name: '埃及', region: '非洲', flag: '🇪🇬' },
  { name: '南非', region: '非洲', flag: '🇿🇦' },
  { name: '肯尼亚', region: '非洲', flag: '🇰🇪' },
  { name: '摩洛哥', region: '非洲', flag: '🇲🇦' },
  { name: '尼日利亚', region: '非洲', flag: '🇳🇬' },
  // 中东国家
  { name: '阿联酋', region: '中东', flag: '🇦🇪' },
  { name: '沙特阿拉伯', region: '中东', flag: '🇸🇦' },
  { name: '以色列', region: '中东', flag: '🇮🇱' },
  { name: '土耳其', region: '中东', flag: '🇹🇷' },
  { name: '伊朗', region: '中东', flag: '🇮🇷' },
]

/** 古称数据 */
const ANCIENT_NAMES: AncientNameData[] = [
  // 中国古称
  { ancient: '长安', modern: '西安', province: '陕西省', country: '中国' },
  { ancient: '金陵', modern: '南京', province: '江苏省', country: '中国' },
  { ancient: '临安', modern: '杭州', province: '浙江省', country: '中国' },
  { ancient: '汴京', modern: '开封', province: '河南省', country: '中国' },
  { ancient: '燕京', modern: '北京', province: '北京市', country: '中国' },
  { ancient: '蓉城', modern: '成都', province: '四川省', country: '中国' },
  { ancient: '江城', modern: '武汉', province: '湖北省', country: '中国' },
  { ancient: '羊城', modern: '广州', province: '广东省', country: '中国' },
  { ancient: '山城', modern: '重庆', province: '重庆市', country: '中国' },
  { ancient: '姑苏', modern: '苏州', province: '江苏省', country: '中国' },
  { ancient: '庐州', modern: '合肥', province: '安徽省', country: '中国' },
  { ancient: '豫章', modern: '南昌', province: '江西省', country: '中国' },
  { ancient: '潭州', modern: '长沙', province: '湖南省', country: '中国' },
  { ancient: '晋阳', modern: '太原', province: '山西省', country: '中国' },
  { ancient: '盛京', modern: '沈阳', province: '辽宁省', country: '中国' },
  // 外国古称
  { ancient: '江户', modern: '东京', country: '日本' },
  { ancient: '君士坦丁堡', modern: '伊斯坦布尔', country: '土耳其' },
  { ancient: '拜占庭', modern: '伊斯坦布尔', country: '土耳其' },
  { ancient: '圣彼得堡', modern: '列宁格勒', country: '俄罗斯' },
  { ancient: '仰光', modern: '内比都', country: '缅甸' },
  { ancient: '汉城', modern: '首尔', country: '韩国' },
]

/** 题目生成参数 */
export interface QuestionGeneratorParams {
  /** 题目类型 */
  questionType: QuestionType
  /** 难度等级 */
  difficulty?: Difficulty
  /** 区域筛选 */
  region?: string
  /** 省份筛选 */
  province?: string
  /** 国家筛选 */
  country?: string
}

/**
 * 题目生成器类
 */
class QuestionGenerator {
  private questionIdCounter: number = 1

  /**
   * 生成题目
   */
  generate(params: QuestionGeneratorParams): Question {
    const { questionType, difficulty = Difficulty.NORMAL, region, province, country } = params

    switch (questionType) {
      case QuestionType.CITY_TO_PROVINCE:
        return this.generateCityToProvince(difficulty, region, province, country)
      case QuestionType.CITY_TO_COUNTRY:
        return this.generateCityToCountry(difficulty, region, country)
      case QuestionType.ANCIENT_TO_MODERN:
        return this.generateAncientToModern(difficulty, country)
      case QuestionType.FLAG_TO_COUNTRY:
        return this.generateFlagToCountry(difficulty, region)
      default:
        throw new Error('未知的题目类型')
    }
  }

  /**
   * 批量生成题目
   */
  generateBatch(params: QuestionGeneratorParams, count: number): Question[] {
    const questions: Question[] = []
    for (let i = 0; i < count; i++) {
      questions.push(this.generate(params))
    }
    return questions
  }

  /**
   * 生成城市猜省份题目
   */
  private generateCityToProvince(
    difficulty: Difficulty,
    region?: string,
    province?: string,
    country?: string
  ): Question {
    // 筛选城市
    let filteredCities = [...CITIES]
    if (region) {
      filteredCities = filteredCities.filter(c => c.region === region)
    }
    if (province) {
      filteredCities = filteredCities.filter(c => c.province === province)
    }
    if (country) {
      filteredCities = filteredCities.filter(c => c.country === country)
    }

    if (filteredCities.length === 0) {
      throw new Error('没有符合条件的城市数据')
    }

    // 随机选择一个城市
    const city = filteredCities[randomInt(0, filteredCities.length - 1)]

    // 生成干扰项（同区域或同国家的省份）
    const distractors = this.generateProvinceDistractors(city, difficulty)

    // 构建选项
    const options = this.buildOptions(city.province, distractors)

    return {
      question_id: this.questionIdCounter++,
      question_type: QuestionType.CITY_TO_PROVINCE,
      question_content: `"${city.name}"属于哪个省份？`,
      options,
      correct_answer: city.province,
      difficulty,
      category: city.country,
      province: city.province,
      country: city.country,
      knowledge_point: `${city.name}是${city.country}${city.province}的城市`,
    }
  }

  /**
   * 生成城市猜国家题目
   */
  private generateCityToCountry(
    difficulty: Difficulty,
    region?: string,
    country?: string
  ): Question {
    // 筛选城市
    let filteredCities = [...CITIES]
    if (region) {
      filteredCities = filteredCities.filter(c => c.region === region)
    }
    if (country) {
      filteredCities = filteredCities.filter(c => c.country === country)
    }

    if (filteredCities.length === 0) {
      throw new Error('没有符合条件的城市数据')
    }

    // 随机选择一个城市
    const city = filteredCities[randomInt(0, filteredCities.length - 1)]

    // 生成干扰项（同区域的国家）
    const distractors = this.generateCountryDistractors(city, difficulty)

    // 构建选项
    const options = this.buildOptions(city.country, distractors)

    return {
      question_id: this.questionIdCounter++,
      question_type: QuestionType.CITY_TO_COUNTRY,
      question_content: `"${city.name}"属于哪个国家？`,
      options,
      correct_answer: city.country,
      difficulty,
      category: city.region,
      country: city.country,
      knowledge_point: `${city.name}是${city.country}的城市`,
    }
  }

  /**
   * 生成古称猜今名题目
   */
  private generateAncientToModern(
    difficulty: Difficulty,
    country?: string
  ): Question {
    // 筛选古称数据
    let filteredNames = [...ANCIENT_NAMES]
    if (country) {
      filteredNames = filteredNames.filter(n => n.country === country)
    }

    if (filteredNames.length === 0) {
      throw new Error('没有符合条件的古称数据')
    }

    // 随机选择一条数据
    const ancientName = filteredNames[randomInt(0, filteredNames.length - 1)]

    // 生成干扰项（其他现代城市名）
    const distractors = this.generateModernNameDistractors(ancientName, difficulty)

    // 构建选项
    const options = this.buildOptions(ancientName.modern, distractors)

    return {
      question_id: this.questionIdCounter++,
      question_type: QuestionType.ANCIENT_TO_MODERN,
      question_content: `古称"${ancientName.ancient}"是现在的哪个城市？`,
      options,
      correct_answer: ancientName.modern,
      difficulty,
      category: ancientName.country,
      province: ancientName.province,
      country: ancientName.country,
      knowledge_point: `${ancientName.ancient}是${ancientName.modern}的古称`,
    }
  }

  /**
   * 生成国旗猜国家题目
   */
  private generateFlagToCountry(
    difficulty: Difficulty,
    region?: string
  ): Question {
    // 筛选国家
    let filteredCountries = [...COUNTRIES]
    if (region) {
      filteredCountries = filteredCountries.filter(c => c.region === region)
    }

    if (filteredCountries.length === 0) {
      throw new Error('没有符合条件的国家数据')
    }

    // 随机选择一个国家
    const country = filteredCountries[randomInt(0, filteredCountries.length - 1)]

    // 生成干扰项（同区域的国家）
    const distractors = this.generateFlagDistractors(country, difficulty)

    // 构建选项
    const options = this.buildOptions(country.name, distractors)

    return {
      question_id: this.questionIdCounter++,
      question_type: QuestionType.FLAG_TO_COUNTRY,
      question_content: '这个国旗是哪个国家的？',
      question_image: country.flag,
      options,
      correct_answer: country.name,
      difficulty,
      category: country.region,
      country: country.name,
      knowledge_point: `${country.flag}是${country.name}的国旗`,
    }
  }

  /**
   * 生成省份干扰项
   */
  private generateProvinceDistractors(city: CityData, difficulty: Difficulty): string[] {
    // 获取同区域或同国家的其他省份
    const sameRegionProvinces = [...new Set(
      CITIES
        .filter(c => c.region === city.region && c.province !== city.province)
        .map(c => c.province)
    )]

    const sameCountryProvinces = [...new Set(
      CITIES
        .filter(c => c.country === city.country && c.province !== city.province)
        .map(c => c.province)
    )]

    // 根据难度选择干扰项来源
    let distractorPool = difficulty === Difficulty.EASY
      ? sameCountryProvinces
      : sameRegionProvinces

    // 如果干扰项不足，补充其他省份
    if (distractorPool.length < 3) {
      const allProvinces = [...new Set(CITIES.map(c => c.province))]
        .filter(p => p !== city.province)
      distractorPool = [...new Set([...distractorPool, ...allProvinces])]
    }

    // 打乱并选择3个干扰项
    return shuffle(distractorPool).slice(0, 3)
  }

  /**
   * 生成国家干扰项
   */
  private generateCountryDistractors(city: CityData, difficulty: Difficulty): string[] {
    // 获取同区域的其他国家
    const sameRegionCountries = [...new Set(
      CITIES
        .filter(c => c.region === city.region && c.country !== city.country)
        .map(c => c.country)
    )]

    const allCountries = [...new Set(CITIES.map(c => c.country))]
      .filter(c => c !== city.country)

    // 根据难度选择干扰项来源
    const distractorPool = difficulty === Difficulty.EASY
      ? sameRegionCountries.length >= 3 ? sameRegionCountries : allCountries
      : allCountries

    // 打乱并选择3个干扰项
    return shuffle(distractorPool).slice(0, 3)
  }

  /**
   * 生成现代城市名干扰项
   */
  private generateModernNameDistractors(ancientName: AncientNameData, difficulty: Difficulty): string[] {
    // 获取其他现代城市名
    const otherModernNames = ANCIENT_NAMES
      .filter(n => n.modern !== ancientName.modern)
      .map(n => n.modern)

    // 补充其他城市名
    const cityNames = CITIES
      .filter(c => c.name !== ancientName.modern)
      .map(c => c.name)

    const distractorPool = [...new Set([...otherModernNames, ...cityNames])]

    // 打乱并选择3个干扰项
    return shuffle(distractorPool).slice(0, 3)
  }

  /**
   * 生成国旗干扰项
   */
  private generateFlagDistractors(country: CountryData, difficulty: Difficulty): string[] {
    // 获取同区域的其他国家
    const sameRegionCountries = COUNTRIES
      .filter(c => c.region === country.region && c.name !== country.name)
      .map(c => c.name)

    const allCountries = COUNTRIES
      .filter(c => c.name !== country.name)
      .map(c => c.name)

    // 根据难度选择干扰项来源
    const distractorPool = difficulty === Difficulty.EASY
      ? sameRegionCountries.length >= 3 ? sameRegionCountries : allCountries
      : allCountries

    // 打乱并选择3个干扰项
    return shuffle(distractorPool).slice(0, 3)
  }

  /**
   * 构建选项
   */
  private buildOptions(correctAnswer: string, distractors: string[]): QuestionOption[] {
    // 合并正确答案和干扰项
    const allAnswers = [correctAnswer, ...distractors]
    
    // 打乱顺序
    const shuffled = shuffle(allAnswers)
    
    // 构建选项
    const keys = ['A', 'B', 'C', 'D']
    return shuffled.map((answer, index) => ({
      key: keys[index],
      value: answer,
    }))
  }

  /**
   * 重置题目ID计数器
   */
  resetCounter(): void {
    this.questionIdCounter = 1
  }
}

/** 导出题目生成器实例 */
export const questionGenerator = new QuestionGenerator()

/** 导出题目生成器类 */
export default QuestionGenerator
