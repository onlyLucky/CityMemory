import { STAR_CONFIG } from '@/constants/config'

class StarCalculator {
  calculate(correctCount: number, totalCount: number, averageTime: number): number {
    const correctRate = correctCount / totalCount
    let baseStars = 0

    if (correctRate >= 1) {
      baseStars = 5
    } else if (correctRate >= 0.9) {
      baseStars = 4.5
    } else if (correctRate >= 0.8) {
      baseStars = 4
    } else if (correctRate >= 0.7) {
      baseStars = 3.5
    } else if (correctRate >= 0.6) {
      baseStars = 3
    } else if (correctRate >= 0.5) {
      baseStars = 2.5
    } else if (correctRate >= 0.4) {
      baseStars = 2
    } else if (correctRate >= 0.3) {
      baseStars = 1.5
    } else if (correctRate >= 0.2) {
      baseStars = 1
    } else {
      baseStars = 0.5
    }

    let timeBonus = 0
    if (averageTime <= STAR_CONFIG.TIME_BONUS_THRESHOLD) {
      timeBonus = 1
    } else if (averageTime <= 10) {
      timeBonus = 0.5
    }

    const finalStars = Math.min(baseStars + timeBonus, STAR_CONFIG.PERFECT_STARS)
    return Math.round(finalStars * 2) / 2
  }
}

const starCalculator = new StarCalculator()

export default starCalculator
