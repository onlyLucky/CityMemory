import { QUESTION_TYPES, PROVINCES } from '@/constants/config'
import type { Question } from '@/types'

class QuestionGenerator {
  private usedIds = new Set<string>()

  generate(count: number, region: string, types: number[] = [1, 2, 3]): Question[] {
    const questions: Question[] = []

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const question = this.generateByType(type, region)
      if (question) {
        questions.push(question)
      }
    }

    return questions
  }

  private generateByType(type: number, region: string): Question | null {
    switch (type) {
      case QUESTION_TYPES.CITY_TO_PROVINCE:
        return this.generateCityToProvince(region)
      case QUESTION_TYPES.CITY_TO_COUNTRY:
        return this.generateCityToCountry(region)
      case QUESTION_TYPES.ANCIENT_TO_MODERN:
        return this.generateAncientToModern(region)
      case QUESTION_TYPES.FLAG_TO_COUNTRY:
        return this.generateFlagToCountry(region)
      default:
        return null
    }
  }

  private generateCityToProvince(region: string): Question {
    const cities = [
      { name: '苏州市', province: '江苏省' },
      { name: '杭州市', province: '浙江省' },
      { name: '南京市', province: '江苏省' },
      { name: '武汉市', province: '湖北省' },
      { name: '成都市', province: '四川省' },
      { name: '西安市', province: '陕西省' },
      { name: '广州市', province: '广东省' },
      { name: '深圳市', province: '广东省' }
    ]

    const target = cities[Math.floor(Math.random() * cities.length)]
    const options = this.generateOptions(target.province, PROVINCES.filter(p => p !== target.province))

    return {
      id: `q_${Date.now()}_${Math.random()}`,
      questionType: QUESTION_TYPES.CITY_TO_PROVINCE,
      questionContent: `${target.name}属于哪个省份？`,
      options,
      correctAnswer: options.find(o => o.value === target.province)?.key || 'A',
      difficulty: 1,
      region
    }
  }

  private generateCityToCountry(region: string): Question {
    const cities = [
      { name: '东京', country: '日本' },
      { name: '首尔', country: '韩国' },
      { name: '曼谷', country: '泰国' },
      { name: '新加坡', country: '新加坡' },
      { name: '巴黎', country: '法国' },
      { name: '伦敦', country: '英国' },
      { name: '纽约', country: '美国' },
      { name: '悉尼', country: '澳大利亚' }
    ]

    const target = cities[Math.floor(Math.random() * cities.length)]
    const countries = ['日本', '韩国', '泰国', '新加坡', '法国', '英国', '美国', '澳大利亚']
    const options = this.generateOptions(target.country, countries.filter(c => c !== target.country))

    return {
      id: `q_${Date.now()}_${Math.random()}`,
      questionType: QUESTION_TYPES.CITY_TO_COUNTRY,
      questionContent: `${target.name}属于哪个国家？`,
      options,
      correctAnswer: options.find(o => o.value === target.country)?.key || 'A',
      difficulty: 2,
      region
    }
  }

  private generateAncientToModern(region: string): Question {
    const ancientCities = [
      { ancient: '长安', modern: '西安' },
      { ancient: '金陵', modern: '南京' },
      { ancient: '临安', modern: '杭州' },
      { ancient: '燕京', modern: '北京' },
      { ancient: '汴梁', modern: '开封' },
      { ancient: '姑苏', modern: '苏州' },
      { ancient: '洛阳', modern: '洛阳' },
      { ancient: '扬州', modern: '扬州' }
    ]

    const target = ancientCities[Math.floor(Math.random() * ancientCities.length)]
    const modernCities = ['西安', '南京', '杭州', '北京', '开封', '苏州', '洛阳', '扬州']
    const options = this.generateOptions(target.modern, modernCities.filter(c => c !== target.modern))

    return {
      id: `q_${Date.now()}_${Math.random()}`,
      questionType: QUESTION_TYPES.ANCIENT_TO_MODERN,
      questionContent: `${target.ancient}是现在的哪个城市？`,
      options,
      correctAnswer: options.find(o => o.value === target.modern)?.key || 'A',
      difficulty: 2,
      region
    }
  }

  private generateFlagToCountry(region: string): Question {
    const flags = [
      { country: '日本', flag: '🇯🇵' },
      { country: '韩国', flag: '🇰🇷' },
      { country: '中国', flag: '🇨🇳' },
      { country: '美国', flag: '🇺🇸' },
      { country: '英国', flag: '🇬🇧' },
      { country: '法国', flag: '🇫🇷' },
      { country: '德国', flag: '🇩🇪' },
      { country: '意大利', flag: '🇮🇹' }
    ]

    const target = flags[Math.floor(Math.random() * flags.length)]
    const countries = ['日本', '韩国', '中国', '美国', '英国', '法国', '德国', '意大利']
    const options = this.generateOptions(target.country, countries.filter(c => c !== target.country))

    return {
      id: `q_${Date.now()}_${Math.random()}`,
      questionType: QUESTION_TYPES.FLAG_TO_COUNTRY,
      questionContent: `${target.flag} 是哪个国家的国旗？`,
      options,
      correctAnswer: options.find(o => o.value === target.country)?.key || 'A',
      difficulty: 2,
      region
    }
  }

  private generateOptions(correct: string, distractors: string[]) {
    const keys = ['A', 'B', 'C', 'D']
    const shuffled = [...distractors].sort(() => Math.random() - 0.5).slice(0, 3)
    const allOptions = [...shuffled, correct].sort(() => Math.random() - 0.5)

    return allOptions.map((value, index) => ({
      key: keys[index],
      value
    }))
  }
}

const questionGenerator = new QuestionGenerator()

export default questionGenerator
