<template>
  <view class="random-answer-page">
    <view class="page-header">
      <view class="back-button" @tap="handleBack">
        <text>←</text>
      </view>
      <view class="header-title">随机答题</view>
      <view class="score-display">得分: {{ score }}</view>
    </view>

    <view class="health-section">
      <HealthBar :current-health="blood" :max-health="maxBlood" />
    </view>

    <view class="content-container">
      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :progress="`${currentIndex + 1}/${totalQuestions}`"
        :show-answer="showAnswer"
        :disabled="showAnswer"
        @select="handleAnswerSelect"
      />

      <view v-if="showAnswer" class="result-message">
        <text v-if="lastAnswerCorrect" class="success-text">✓ 回答正确</text>
        <text v-else class="error-text">✗ 回答错误 -1血</text>
      </view>
    </view>

    <view class="action-bar">
      <view class="action-item" @tap="handleUseShield">
        <text class="action-icon">🛡️</text>
        <text class="action-text">护盾</text>
      </view>
      <view class="action-item" @tap="handleUsePotion">
        <text class="action-icon">💊</text>
        <text class="action-text">血瓶</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onLoad } from '@dcloudio/uni-app'
import { useGameStore } from '@/stores/game'
import { useUserStore } from '@/stores/user'
import QuestionCard from '@/components/question-card/index.vue'
import HealthBar from '@/components/health-bar/index.vue'
import questionGenerator from '@/utils/question-generator'

const gameStore = useGameStore()
const userStore = useUserStore()

const type = ref('simple')
const questions = ref<any[]>([])
const currentIndex = ref(0)
const score = ref(0)
const blood = ref(10)
const maxBlood = ref(10)
const showAnswer = ref(false)
const lastAnswerCorrect = ref(false)
const hasShield = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value])
const totalQuestions = computed(() => questions.value.length)

onLoad((options) => {
  type.value = options?.type || 'simple'
  initGame()
})

onMounted(() => {
  console.log('随机答题页加载')
})

const initGame = () => {
  const configMap: Record<string, { count: number; multiplier: number }> = {
    simple: { count: 10, multiplier: 1.0 },
    medium: { count: 15, multiplier: 1.5 },
    hard: { count: 20, multiplier: 2.0 }
  }

  const config = configMap[type.value] || configMap.simple
  questions.value = questionGenerator.generate(config.count, '江苏省', [1, 2, 3, 4])
  currentIndex.value = 0
  score.value = 0
  blood.value = 10
  showAnswer.value = false
  lastAnswerCorrect.value = false
  hasShield.value = false
}

const handleBack = () => {
  uni.showModal({
    title: '确认退出',
    content: '退出后将视为放弃本次挑战',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    }
  })
}

const handleAnswerSelect = async (option: string) => {
  if (!currentQuestion.value) return

  showAnswer.value = true
  const isCorrect = option === currentQuestion.value.correctAnswer
  lastAnswerCorrect.value = isCorrect

  if (isCorrect) {
    score.value += 10
  } else if (!hasShield.value) {
    blood.value--
  } else {
    hasShield.value = false
  }

  setTimeout(() => {
    if (blood.value <= 0 || currentIndex.value >= totalQuestions.value - 1) {
      endGame()
    } else {
      currentIndex.value++
      resetForNextQuestion()
    }
  }, 1500)
}

const resetForNextQuestion = () => {
  showAnswer.value = false
  lastAnswerCorrect.value = false
}

const endGame = () => {
  const stars = Math.ceil(score.value / 10)
  uni.redirectTo({
    url: `/pages/random-result/index?score=${score.value}&stars=${stars}&blood=${blood.value}`
  })
}

const handleUseShield = () => {
  if (hasShield.value) {
    uni.showToast({
      title: '已有护盾',
      icon: 'none'
    })
    return
  }

  uni.showModal({
    title: '使用护盾',
    content: '下次答错不扣血，消耗80金币',
    success: (res) => {
      if (res.confirm) {
        hasShield.value = true
        uni.showToast({
          title: '护盾已激活',
          icon: 'success'
        })
      }
    }
  })
}

const handleUsePotion = () => {
  if (blood.value >= maxBlood.value) {
    uni.showToast({
      title: '血量已满',
      icon: 'none'
    })
    return
  }

  uni.showModal({
    title: '使用血瓶',
    content: '恢复1点血量，消耗50金币',
    success: (res) => {
      if (res.confirm) {
        blood.value = Math.min(blood.value + 1, maxBlood.value)
        uni.showToast({
          title: '血量+1',
          icon: 'success'
        })
      }
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.random-answer-page {
  width: 100%;
  min-height: 100vh;
  background: $background-color;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  background: $primary-color;
  color: #fff;
}

.back-button {
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

.header-title {
  font-size: $font-size-md;
  font-weight: bold;
}

.score-display {
  font-size: $font-size-sm;
  opacity: 0.9;
}

.health-section {
  padding: $spacing-lg;
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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
