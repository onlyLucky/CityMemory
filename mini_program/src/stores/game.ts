import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question, Level, AnswerResult } from '@/types'
import { levelApi } from '@/api'
import questionGenerator from '@/utils/question-generator'
import starCalculator from '@/utils/star-calculator'

export const useGameStore = defineStore('game', () => {
  const currentLevel = ref<Level | null>(null)
  const questions = ref<Question[]>([])
  const currentQuestionIndex = ref(0)
  const answers = ref<Array<{ questionId: string; answer: string; isCorrect: boolean }>>([])
  const startTime = ref(0)
  const blood = ref(10)
  const gameResult = ref<AnswerResult | null>(null)

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
  const progress = computed(() => `${currentQuestionIndex.value + 1}/${questions.value.length}`)
  const isLastQuestion = computed(() => currentQuestionIndex.value >= questions.value.length - 1)

  const startLevel = async (level: Level) => {
    currentLevel.value = level
    
    try {
      const result = await levelApi.startLevel(level.id)
      questions.value = result.questions
    } catch (error) {
      questions.value = questionGenerator.generate(10, level.province)
    }
    
    currentQuestionIndex.value = 0
    answers.value = []
    startTime.value = Date.now()
    blood.value = 10
    gameResult.value = null
  }

  const submitAnswer = async (questionId: string, answer: string) => {
    const question = questions.value.find(q => q.id === questionId)
    if (!question) return null

    const isCorrect = question.correctAnswer === answer
    answers.value.push({ questionId, answer, isCorrect })

    if (!isCorrect) {
      blood.value--
    }

    let result: AnswerResult | null = null

    try {
      if (currentLevel.value) {
        result = await levelApi.submitAnswer(currentLevel.value.id, questionId, answer)
      }
    } catch (error) {
      result = {
        isCorrect,
        correctAnswer: question.correctAnswer,
        blood: blood.value,
        stars: 0,
        isLevelCompleted: isLastQuestion.value || blood.value <= 0
      }
    }

    if (result) {
      gameResult.value = result
    }

    return result
  }

  const nextQuestion = () => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
    }
  }

  const completeLevel = async () => {
    if (!currentLevel.value) return null

    const correctCount = answers.value.filter(a => a.isCorrect).length
    const totalTime = Date.now() - startTime.value
    const averageTime = totalTime / questions.value.length
    const stars = starCalculator.calculate(correctCount, questions.value.length, averageTime)

    let result: any = null

    try {
      result = await levelApi.completeLevel(currentLevel.value.id, {
        stars,
        blood: blood.value,
        answers: answers.value
      })
    } catch (error) {
      result = {
        levelId: currentLevel.value.id,
        stars,
        totalStars: 0,
        unlockedLevel: null
      }
    }

    return result
  }

  const resetGame = () => {
    currentLevel.value = null
    questions.value = []
    currentQuestionIndex.value = 0
    answers.value = []
    startTime.value = 0
    blood.value = 10
    gameResult.value = null
  }

  return {
    currentLevel,
    questions,
    currentQuestionIndex,
    answers,
    startTime,
    blood,
    gameResult,
    currentQuestion,
    progress,
    isLastQuestion,
    startLevel,
    submitAnswer,
    nextQuestion,
    completeLevel,
    resetGame
  }
})
