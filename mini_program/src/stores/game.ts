/**
 * 游戏状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question, AnswerResult } from '@/types/question'
import { Difficulty } from '@/constants/enums'

/** 答题记录接口 */
export interface AnswerRecord {
  /** 题目ID */
  questionId: number
  /** 用户答案 */
  userAnswer: string
  /** 正确答案 */
  correctAnswer: string
  /** 是否正确 */
  isCorrect: boolean
  /** 答题用时（秒） */
  timeUsed: number
  /** 获得分数 */
  score: number
}

/** 游戏模式类型 */
export type GameMode = 'adventure' | 'random'

/** 道具效果接口 */
export interface ItemEffect {
  /** 是否有护盾 */
  hasShield: boolean
  /** 排除的选项 */
  excludedOptions: string[]
}

export const useGameStore = defineStore('game', () => {
  // ==========================================
  // 状态
  // ==========================================

  /** 当前关卡 */
  const currentLevel = ref<number>(1)

  /** 题目列表 */
  const questions = ref<Question[]>([])

  /** 当前题目索引 */
  const currentQuestionIndex = ref<number>(0)

  /** 答题记录 */
  const answers = ref<AnswerRecord[]>([])

  /** 血量（随机模式） */
  const health = ref<number>(3)

  /** 答对数量 */
  const correctCount = ref<number>(0)

  /** 开始时间 */
  const startTime = ref<number>(0)

  /** 游戏模式 */
  const gameMode = ref<GameMode>('adventure')

  /** 难度系数 */
  const difficulty = ref<Difficulty>(Difficulty.NORMAL)

  /** 道具效果 */
  const itemEffect = ref<ItemEffect>({
    hasShield: false,
    excludedOptions: []
  })

  /** 游戏是否结束 */
  const isGameOver = ref<boolean>(false)

  // ==========================================
  // 计算属性
  // ==========================================

  /** 游戏是否进行中 */
  const isGameActive = computed(() => {
    return questions.value.length > 0 && !isGameOver.value
  })

  /** 当前题目 */
  const currentQuestion = computed(() => {
    if (questions.value.length === 0 || currentQuestionIndex.value >= questions.value.length) {
      return null
    }
    return questions.value[currentQuestionIndex.value]
  })

  /** 正确率 */
  const accuracy = computed(() => {
    if (answers.value.length === 0) return 0
    const correct = answers.value.filter(a => a.isCorrect).length
    return Math.round((correct / answers.value.length) * 100)
  })

  /** 平均答题时间 */
  const avgTime = computed(() => {
    if (answers.value.length === 0) return 0
    const totalTime = answers.value.reduce((sum, a) => sum + a.timeUsed, 0)
    return Math.round(totalTime / answers.value.length)
  })

  /** 总得分 */
  const totalScore = computed(() => {
    return answers.value.reduce((sum, a) => sum + a.score, 0)
  })

  /** 当前题目序号（从1开始） */
  const currentQuestionNumber = computed(() => currentQuestionIndex.value + 1)

  /** 题目总数 */
  const totalQuestions = computed(() => questions.value.length)

  // ==========================================
  // 方法
  // ==========================================

  /**
   * 开始游戏
   * @param level 关卡ID
   * @param questionList 题目列表
   * @param mode 游戏模式
   * @param diff 难度系数
   */
  const startGame = (
    level: number,
    questionList: Question[],
    mode: GameMode = 'adventure',
    diff: Difficulty = Difficulty.NORMAL
  ) => {
    // 重置状态
    currentLevel.value = level
    questions.value = questionList
    currentQuestionIndex.value = 0
    answers.value = []
    health.value = mode === 'random' ? 3 : 999 // 冒险模式不限制血量
    correctCount.value = 0
    startTime.value = Date.now()
    gameMode.value = mode
    difficulty.value = diff
    isGameOver.value = false
    itemEffect.value = {
      hasShield: false,
      excludedOptions: []
    }
  }

  /**
   * 提交答案
   * @param answer 用户答案
   * @param result 答题结果
   * @param timeUsed 答题用时
   */
  const submitAnswer = (
    answer: string,
    result: AnswerResult,
    timeUsed: number
  ) => {
    if (!currentQuestion.value) return

    // 记录答题
    const record: AnswerRecord = {
      questionId: currentQuestion.value.question_id,
      userAnswer: answer,
      correctAnswer: result.correct_answer,
      isCorrect: result.is_correct,
      timeUsed,
      score: result.score
    }
    answers.value.push(record)

    // 更新答对数量
    if (result.is_correct) {
      correctCount.value++
    } else {
      // 答错处理
      if (gameMode.value === 'random') {
        // 检查是否有护盾
        if (itemEffect.value.hasShield) {
          itemEffect.value.hasShield = false
        } else {
          health.value--
          // 检查游戏是否结束
          if (health.value <= 0) {
            isGameOver.value = true
          }
        }
      }
    }

    // 清除排除选项效果
    itemEffect.value.excludedOptions = []
  }

  /**
   * 下一题
   */
  const nextQuestion = () => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      // 清除道具效果
      itemEffect.value.excludedOptions = []
    } else {
      // 所有问题已回答完毕
      isGameOver.value = true
    }
  }

  /**
   * 结束游戏
   */
  const endGame = () => {
    isGameOver.value = true
  }

  /**
   * 重置游戏
   */
  const resetGame = () => {
    currentLevel.value = 1
    questions.value = []
    currentQuestionIndex.value = 0
    answers.value = []
    health.value = 3
    correctCount.value = 0
    startTime.value = 0
    gameMode.value = 'adventure'
    difficulty.value = Difficulty.NORMAL
    isGameOver.value = false
    itemEffect.value = {
      hasShield: false,
      excludedOptions: []
    }
  }

  /**
   * 使用道具
   * @param itemType 道具类型
   * @param params 道具参数
   * @returns 是否使用成功
   */
  const useItem = (
    itemType: 'blood' | 'shield' | 'exclude' | 'skip'
  ): boolean => {
    switch (itemType) {
      case 'blood':
        // 使用血瓶
        if (gameMode.value === 'random' && health.value < 3) {
          health.value++
          return true
        }
        return false

      case 'shield':
        // 使用护盾
        itemEffect.value.hasShield = true
        return true

      case 'exclude':
        // 排除选项
        if (currentQuestion.value && currentQuestion.value.options.length > 2) {
          // 随机排除一个错误选项
          const wrongOptions = currentQuestion.value.options.filter(
            opt => opt.key !== currentQuestion.value!.correct_answer
          )
          if (wrongOptions.length > 0) {
            const randomIndex = Math.floor(Math.random() * wrongOptions.length)
            itemEffect.value.excludedOptions.push(wrongOptions[randomIndex].key)
            return true
          }
        }
        return false

      case 'skip':
        // 跳过当前题目
        if (currentQuestion.value && isGameActive.value) {
          // 记录为跳过（不计入正确或错误）
          const record: AnswerRecord = {
            questionId: currentQuestion.value.question_id,
            userAnswer: '',
            correctAnswer: currentQuestion.value.correct_answer,
            isCorrect: false,
            timeUsed: 0,
            score: 0
          }
          answers.value.push(record)
          nextQuestion()
          return true
        }
        return false

      default:
        return false
    }
  }

  return {
    // 状态
    currentLevel,
    questions,
    currentQuestionIndex,
    answers,
    health,
    correctCount,
    startTime,
    gameMode,
    difficulty,
    itemEffect,
    isGameOver,
    // 计算属性
    isGameActive,
    currentQuestion,
    accuracy,
    avgTime,
    totalScore,
    currentQuestionNumber,
    totalQuestions,
    // 方法
    startGame,
    submitAnswer,
    nextQuestion,
    endGame,
    resetGame,
    useItem
  }
})
