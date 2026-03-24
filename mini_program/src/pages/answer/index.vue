<template>
  <view class="answer-page">
    <view class="page-header">
      <view class="back-button" @tap="handleBack">
        <text>←</text>
      </view>
      <view class="progress-indicator">{{ gameStore.progress }}</view>
    </view>

    <view class="content-container">
      <QuestionCard
        v-if="gameStore.currentQuestion"
        :question="gameStore.currentQuestion"
        :progress="gameStore.progress"
        :show-answer="showAnswer"
        :disabled="showAnswer"
        @select="handleAnswerSelect"
      />

      <view v-if="showAnswer" class="result-message">
        <text v-if="lastAnswerCorrect" class="success-text">✓ 回答正确</text>
        <text v-else class="error-text">✗ 回答错误</text>
      </view>
    </view>

    <view class="action-bar">
      <view class="action-item" @tap="handleExcludeOption">
        <text class="action-icon">❌</text>
        <text class="action-text">排除</text>
      </view>
      <view class="action-item" @tap="handleSkipQuestion">
        <text class="action-icon">⏭️</text>
        <text class="action-text">跳过</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import QuestionCard from '@/components/question-card/index.vue'

const gameStore = useGameStore()
const userStore = useUserStore()

const showAnswer = ref(false)
const lastAnswerCorrect = ref(false)
const excludedOptions = ref<string[]>([])

onMounted(() => {
  console.log('答题页加载', gameStore.currentQuestion)
})

const handleBack = () => {
  uni.showModal({
    title: '确认退出',
    content: '退出后将视为放弃本次挑战，门票不会返还',
    success: (res) => {
      if (res.confirm) {
        gameStore.resetGame()
        uni.navigateBack()
      }
    }
  })
}

const handleAnswerSelect = async (option: string) => {
  if (!gameStore.currentQuestion) return

  showAnswer.value = true
  lastAnswerCorrect.value = option === gameStore.currentQuestion.correctAnswer

  const result = await gameStore.submitAnswer(gameStore.currentQuestion.id, option)

  setTimeout(() => {
    if (result?.isLevelCompleted || gameStore.isLastQuestion) {
      completeLevel()
    } else {
      gameStore.nextQuestion()
      resetForNextQuestion()
    }
  }, 1500)
}

const resetForNextQuestion = () => {
  showAnswer.value = false
  lastAnswerCorrect.value = false
  excludedOptions.value = []
}

const completeLevel = () => {
  gameStore.completeLevel().then((result) => {
    uni.redirectTo({
      url: `/pages/answer-result/index?stars=${result?.stars || 0}&success=${true}`
    })
  })
}

const handleExcludeOption = () => {
  if (showAnswer.value || !gameStore.currentQuestion) return

  const availableOptions = gameStore.currentQuestion.options.filter(
    opt => opt.key !== gameStore.currentQuestion?.correctAnswer && !excludedOptions.value.includes(opt.key)
  )

  if (availableOptions.length > 0) {
    const toExclude = availableOptions[Math.floor(Math.random() * availableOptions.length)]
    excludedOptions.value.push(toExclude.key)
    uni.showToast({
      title: `已排除选项 ${toExclude.key}`,
      icon: 'none'
    })
  } else {
    uni.showToast({
      title: '没有可排除的选项',
      icon: 'none'
    })
  }
}

const handleSkipQuestion = () => {
  if (showAnswer.value || !gameStore.currentQuestion) return

  uni.showModal({
    title: '确认跳过',
    content: '跳过当前题目将不计入错误',
    success: (res) => {
      if (res.confirm) {
        if (gameStore.isLastQuestion) {
          completeLevel()
        } else {
          gameStore.nextQuestion()
          resetForNextQuestion()
        }
      }
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.answer-page {
  width: 100%;
  min-height: 100vh;
  background: $background-color;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;
  background: $primary-color;
  color: #fff;
  position: relative;
}

.back-button {
  position: absolute;
  left: $spacing-lg;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: $font-size-lg;
  font-weight: bold;
}

.progress-indicator {
  font-size: $font-size-md;
  font-weight: 500;
}

.content-container {
  flex: 1;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.result-message {
  text-align: center;
  padding: $spacing-lg;
  margin-top: $spacing-lg;
  border-radius: $radius-md;
  font-size: $font-size-lg;
  font-weight: bold;
}

.success-text {
  color: $success-color;
  background: rgba(76, 175, 80, 0.1);
}

.error-text {
  color: $error-color;
  background: rgba(244, 67, 54, 0.1);
}

.action-bar {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: #fff;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.action-item {
  flex: 1;
  height: 96rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $background-color;
  border-radius: $radius-md;
  gap: $spacing-xs;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
    background: #e0e0e0;
  }
}

.action-icon {
  font-size: 40rpx;
}

.action-text {
  font-size: $font-size-sm;
  color: $text-primary;
}
</style>
