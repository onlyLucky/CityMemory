<template>
  <view class="random-answer-page">
    <!-- 顶部信息栏 -->
    <view class="answer-header">
      <view class="header-left">
        <view class="health-section">
          <text class="health-label">血量</text>
          <health-bar :health="currentHealth" :max-health="maxHealth" size="small" />
        </view>
      </view>
      <view class="header-center">
        <text class="correct-count">答对: {{ correctCount }}</text>
      </view>
      <view class="header-right">
        <view class="close-btn" @tap="handleClose">
          <text class="close-icon">&#10005;</text>
        </view>
      </view>
    </view>

    <!-- 题目区域 -->
    <view class="question-section" v-if="currentQuestion">
      <question-card
        :question="currentQuestion"
        :show-answer="showResult"
        :selected-option="selectedOption"
        :disabled="showResult"
        @select="handleSelectOption"
      />
    </view>

    <!-- 结果反馈 -->
    <view class="result-feedback" v-if="showResult">
      <view class="feedback-content" :class="{ correct: isCorrect, wrong: !isCorrect }">
        <text class="feedback-text">{{ isCorrect ? '回答正确！' : '回答错误' }}</text>
        <text class="feedback-answer" v-if="!isCorrect && currentQuestion">
          正确答案: {{ currentQuestion.correct_answer }}
        </text>
      </view>
    </view>

    <!-- 底部道具栏 -->
    <view class="items-bar">
      <view
        v-for="item in items"
        :key="item.type"
        class="item-btn"
        :class="{ disabled: item.count <= 0 }"
        @tap="handleUseItem(item.type)"
      >
        <text class="item-icon">{{ item.icon }}</text>
        <text class="item-count">{{ item.count }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useShopStore } from '@/stores/shop'
import { useUserStore } from '@/stores/user'
import { Difficulty } from '@/constants/enums'
import type { Question } from '@/types/question'
import healthBar from '@/components/health-bar/index.vue'
import questionCard from '@/components/question-card/index.vue'

// ==========================================
// 类型定义
// ==========================================

interface ChallengeParams {
  difficulty: Difficulty
  questionCount: number
  coinMultiplier: number
  initialHealth: number
  bloodPoolCount: number
}

interface ItemInfo {
  type: 'blood' | 'shield' | 'exclude' | 'skip'
  icon: string
  name: string
  count: number
}

// ==========================================
// 状态
// ==========================================

const gameStore = useGameStore()
const shopStore = useShopStore()
const userStore = useUserStore()

/** 挑战参数 */
const challengeParams = ref<ChallengeParams | null>(null)

/** 当前血量 */
const currentHealth = ref(10)

/** 最大血量 */
const maxHealth = ref(10)

/** 答对数量 */
const correctCount = ref(0)

/** 当前题目索引 */
const currentQuestionIndex = ref(0)

/** 题目列表 */
const questions = ref<Question[]>([])

/** 当前选中的选项 */
const selectedOption = ref('')

/** 是否显示结果 */
const showResult = ref(false)

/** 答题开始时间 */
const questionStartTime = ref(0)

/** 道具列表 */
const items = ref<ItemInfo[]>([
  { type: 'blood', icon: '\u2764\uFE0F', name: '血瓶', count: 0 },
  { type: 'shield', icon: '\u{1F6E1}\uFE0F', name: '护盾', count: 0 },
  { type: 'exclude', icon: '\u{1F4A3}', name: '排除', count: 0 },
  { type: 'skip', icon: '\u23E9', name: '跳过', count: 0 }
])

// ==========================================
// 计算属性
// ==========================================

/** 当前题目 */
const currentQuestion = computed(() => {
  if (questions.value.length === 0 || currentQuestionIndex.value >= questions.value.length) {
    return null
  }
  return questions.value[currentQuestionIndex.value]
})

/** 是否回答正确 */
const isCorrect = computed(() => {
  if (!currentQuestion.value || !selectedOption.value) return false
  return selectedOption.value === currentQuestion.value.correct_answer
})

// ==========================================
// 方法
// ==========================================

/**
 * 初始化挑战参数
 */
const initChallengeParams = () => {
  const params = uni.getStorageSync('random_challenge') as ChallengeParams
  if (params) {
    challengeParams.value = params
    currentHealth.value = params.initialHealth
    maxHealth.value = params.initialHealth
    gameStore.health = params.initialHealth
  }
}

/**
 * 初始化道具数量
 */
const initItems = () => {
  // 从商店获取用户道具数量
  // 这里使用模拟数据，实际应从 shopStore 获取
  items.value = [
    { type: 'blood', icon: '\u2764\uFE0F', name: '血瓶', count: shopStore.getUserItemQuantity(1) },
    { type: 'shield', icon: '\u{1F6E1}\uFE0F', name: '护盾', count: shopStore.getUserItemQuantity(2) },
    { type: 'exclude', icon: '\u{1F4A3}', name: '排除', count: shopStore.getUserItemQuantity(3) },
    { type: 'skip', icon: '\u23E9', name: '跳过', count: shopStore.getUserItemQuantity(4) }
  ]
}

/**
 * 加载题目
 */
const loadQuestions = async () => {
  if (!challengeParams.value) return

  // 模拟题目数据
  // 实际应该调用API获取题目
  const mockQuestions: Question[] = generateMockQuestions(
    challengeParams.value.questionCount,
    challengeParams.value.difficulty
  )
  questions.value = mockQuestions

  // 初始化游戏状态
  gameStore.startGame(
    0,
    mockQuestions,
    'random',
    challengeParams.value.difficulty
  )
}

/**
 * 生成模拟题目
 */
const generateMockQuestions = (count: number, difficulty: Difficulty): Question[] => {
  const cities = [
    { name: '成都', province: '四川省' },
    { name: '杭州', province: '浙江省' },
    { name: '广州', province: '广东省' },
    { name: '武汉', province: '湖北省' },
    { name: '西安', province: '陕西省' },
    { name: '南京', province: '江苏省' },
    { name: '重庆', province: '重庆市' },
    { name: '苏州', province: '江苏省' },
    { name: '长沙', province: '湖南省' },
    { name: '郑州', province: '河南省' }
  ]

  const result: Question[] = []
  for (let i = 0; i < count; i++) {
    const city = cities[i % cities.length]
    const wrongProvinces = cities
      .filter(c => c.province !== city.province)
      .map(c => c.province)
      .slice(0, 3)

    result.push({
      question_id: i + 1,
      question_type: 1,
      question_content: `${city.name}属于哪个省份？`,
      options: [
        { key: 'A', value: city.province },
        { key: 'B', value: wrongProvinces[0] },
        { key: 'C', value: wrongProvinces[1] },
        { key: 'D', value: wrongProvinces[2] }
      ],
      correct_answer: 'A',
      difficulty,
      province: city.province
    })
  }
  return result
}

/**
 * 处理选择选项
 */
const handleSelectOption = (optionKey: string) => {
  if (showResult.value) return

  selectedOption.value = optionKey
  questionStartTime.value = Date.now()

  // 显示结果
  showResult.value = true

  // 计算答题用时
  const timeUsed = Math.floor((Date.now() - questionStartTime.value) / 1000)

  if (isCorrect.value) {
    // 答对
    correctCount.value++
    gameStore.correctCount = correctCount.value

    // 延迟进入下一题
    setTimeout(() => {
      goToNextQuestion()
    }, 1000)
  } else {
    // 答错
    // 检查是否有护盾
    if (gameStore.itemEffect.hasShield) {
      gameStore.itemEffect.hasShield = false
      uni.showToast({ title: '护盾抵消', icon: 'none' })
    } else {
      currentHealth.value--
      gameStore.health = currentHealth.value

      // 检查血量
      if (currentHealth.value <= 0) {
        setTimeout(() => {
          handleGameOver()
        }, 1500)
        return
      }
    }

    // 延迟进入下一题
    setTimeout(() => {
      goToNextQuestion()
    }, 1500)
  }
}

/**
 * 进入下一题
 */
const goToNextQuestion = () => {
  // 检查是否还有题目
  if (currentQuestionIndex.value >= questions.value.length - 1) {
    // 所有题目答完
    handleGameOver()
    return
  }

  currentQuestionIndex.value++
  selectedOption.value = ''
  showResult.value = false
  questionStartTime.value = Date.now()
}

/**
 * 使用道具
 */
const handleUseItem = (itemType: 'blood' | 'shield' | 'exclude' | 'skip') => {
  const item = items.value.find(i => i.type === itemType)
  if (!item || item.count <= 0) return

  switch (itemType) {
    case 'blood':
      // 使用血瓶
      if (currentHealth.value < maxHealth.value) {
        currentHealth.value++
        gameStore.health = currentHealth.value
        item.count--
        uni.showToast({ title: '血量+1', icon: 'none' })
      }
      break

    case 'shield':
      // 使用护盾
      gameStore.itemEffect.hasShield = true
      item.count--
      uni.showToast({ title: '护盾已激活', icon: 'none' })
      break

    case 'exclude':
      // 排除选项
      if (currentQuestion.value && !showResult.value) {
        const wrongOptions = currentQuestion.value.options.filter(
          opt => opt.key !== currentQuestion.value!.correct_answer
        )
        if (wrongOptions.length > 0) {
          const excludeKey = wrongOptions[Math.floor(Math.random() * wrongOptions.length)].key
          gameStore.itemEffect.excludedOptions.push(excludeKey)
          item.count--
          uni.showToast({ title: '已排除一个错误选项', icon: 'none' })
        }
      }
      break

    case 'skip':
      // 跳过题目
      if (!showResult.value) {
        item.count--
        goToNextQuestion()
        uni.showToast({ title: '已跳过', icon: 'none' })
      }
      break
  }
}

/**
 * 游戏结束
 */
const handleGameOver = () => {
  // 保存结果到存储
  uni.setStorageSync('random_result', {
    correctCount: correctCount.value,
    totalQuestions: currentQuestionIndex.value + 1,
    coinMultiplier: challengeParams.value?.coinMultiplier || 1.0,
    difficulty: challengeParams.value?.difficulty
  })

  // 更新今日使用次数
  const today = new Date().toDateString()
  const savedDate = uni.getStorageSync('random_ticket_date')
  if (savedDate === today) {
    const count = uni.getStorageSync('random_ticket_count') || 0
    uni.setStorageSync('random_ticket_count', count + 1)
  }

  // 跳转结果页
  uni.redirectTo({ url: '/pages/random-result/index' })
}

/**
 * 关闭确认
 */
const handleClose = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出挑战吗？当前进度将不会保存。',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    }
  })
}

// ==========================================
// 生命周期
// ==========================================

onMounted(() => {
  initChallengeParams()
  initItems()
  loadQuestions()
  questionStartTime.value = Date.now()
})
</script>

<style lang="scss" scoped>
.random-answer-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  display: flex;
  flex-direction: column;
  padding-top: env(safe-area-inset-top);
}

// 顶部信息栏
.answer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-element $spacing-page;
  background-color: $color-bg-card;
  border-bottom: 1rpx solid $color-border-light;
}

.header-left {
  flex: 1;
}

.health-section {
  display: flex;
  align-items: center;
  gap: $spacing-text;
}

.health-label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.correct-count {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-primary;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-page;
  border-radius: $border-radius-round;
}

.close-icon {
  font-size: $font-size-base;
  color: $color-text-secondary;
}

// 题目区域
.question-section {
  flex: 1;
  padding: $spacing-page;
  overflow-y: auto;
}

// 结果反馈
.result-feedback {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: $z-index-modal;
}

.feedback-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-page-lg;
  background-color: $color-bg-card;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-xl;
  min-width: 300rpx;

  &.correct {
    border: 4rpx solid $color-success;
  }

  &.wrong {
    border: 4rpx solid $color-error;
  }
}

.feedback-text {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-text;
}

.feedback-content.correct .feedback-text {
  color: $color-success;
}

.feedback-content.wrong .feedback-text {
  color: $color-error;
}

.feedback-answer {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

// 底部道具栏
.items-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-element-lg;
  padding: $spacing-element $spacing-page;
  padding-bottom: calc($spacing-element + env(safe-area-inset-bottom));
  background-color: $color-bg-card;
  border-top: 1rpx solid $color-border-light;
}

.item-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-text-sm;
  padding: $spacing-element;
  border-radius: $border-radius-base;
  transition: all $transition-fast;

  &:active {
    transform: scale(0.95);
    background-color: $color-bg-page;
  }

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.item-icon {
  font-size: 48rpx;
}

.item-count {
  font-size: $font-size-xs;
  color: $color-text-secondary;
  background-color: $color-bg-page;
  padding: 4rpx 12rpx;
  border-radius: $border-radius-sm;
}
</style>
