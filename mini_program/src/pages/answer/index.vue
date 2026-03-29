<template>
  <view class="answer-page">
    <!-- 顶部导航栏 -->
    <nav-bar
      title="答题挑战"
      :show-back="true"
      @back="handleBack"
    >
      <template #right>
        <view class="progress-indicator">
          <text class="progress-text">{{ gameStore.currentQuestionNumber }}/{{ gameStore.totalQuestions }}</text>
        </view>
      </template>
    </nav-bar>

    <!-- 占位区域 -->
    <view class="nav-placeholder"></view>

    <!-- 题目卡片 -->
    <view class="question-container" v-if="gameStore.currentQuestion">
      <question-card
        :question="gameStore.currentQuestion"
        :show-answer="showAnswer"
        :selected-option="selectedOption"
        @select="handleSelectOption"
      />
    </view>

    <!-- 底部道具栏 -->
    <view class="toolbar">
      <view class="toolbar-content">
        <!-- 排除道具 -->
        <view
          class="tool-item"
          :class="{ disabled: isUsedExclude || showAnswer }"
          @tap="handleExclude"
        >
          <view class="tool-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
            </svg>
          </view>
          <text class="tool-text">排除</text>
        </view>

        <!-- 跳过道具 -->
        <view
          class="tool-item"
          :class="{ disabled: showAnswer }"
          @tap="handleSkip"
        >
          <view class="tool-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </view>
          <text class="tool-text">跳过</text>
        </view>
      </view>
    </view>

    <!-- 二次确认弹窗 -->
    <view v-if="showConfirmModal" class="modal-mask" @tap="showConfirmModal = false">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">确认退出</text>
        </view>
        <view class="modal-body">
          <text class="modal-text">退出后当前答题进度将不会保存，确定要退出吗？</text>
        </view>
        <view class="modal-footer">
          <button class="modal-btn modal-btn--cancel" @tap="showConfirmModal = false">
            <text class="btn-text">继续答题</text>
          </button>
          <button class="modal-btn modal-btn--confirm" @tap="confirmExit">
            <text class="btn-text">确认退出</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import NavBar from '@/components/nav-bar/index.vue'
import QuestionCard from '@/components/question-card/index.vue'
import { QUESTION_CONFIG, GAME_CONFIG } from '@/constants/config'

/**
 * 答题页面
 * 显示题目、选项，支持道具使用，即时反馈答题结果
 */

// ==========================================
// Store
// ==========================================

const gameStore = useGameStore()

// ==========================================
// 状态
// ==========================================

/** 当前选中的选项 */
const selectedOption = ref<string>('')

/** 是否显示答案 */
const showAnswer = ref(false)

/** 是否已使用排除道具 */
const isUsedExclude = ref(false)

/** 是否显示确认弹窗 */
const showConfirmModal = ref(false)

/** 答题开始时间 */
const questionStartTime = ref<number>(0)

/** 自动跳转定时器 */
const autoNextTimer = ref<number | null>(null)

/** 是否是最后一题 */
const isLastQuestion = computed(() => {
  return gameStore.currentQuestionIndex === gameStore.questions.length - 1
})

// ==========================================
// 方法
// ==========================================

/**
 * 选择选项
 */
const handleSelectOption = (optionKey: string) => {
  if (showAnswer.value) return

  selectedOption.value = optionKey
}

/**
 * 提交答案
 */
const submitAnswer = () => {
  if (!selectedOption.value || !gameStore.currentQuestion) return

  // 计算答题用时
  const timeUsed = Math.floor((Date.now() - questionStartTime.value) / 1000)

  // 判断是否正确
  const isCorrect = selectedOption.value === gameStore.currentQuestion.correct_answer

  // 构建答题结果
  const result = {
    is_correct: isCorrect,
    correct_answer: gameStore.currentQuestion.correct_answer,
    score: isCorrect ? GAME_CONFIG.BASE_SCORE_PER_QUESTION : 0,
    combo: 0,
    knowledge_point: gameStore.currentQuestion.knowledge_point
  }

  // 提交到store
  gameStore.submitAnswer(selectedOption.value, result, timeUsed)

  // 显示答案
  showAnswer.value = true

  // 1秒后自动进入下一题
  autoNextTimer.value = setTimeout(() => {
    goToNext()
  }, 1000) as unknown as number
}

/**
 * 进入下一题或结果页
 */
const goToNext = () => {
  if (isLastQuestion.value) {
    // 最后一题，跳转结果页
    uni.redirectTo({ url: '/pages/answer-result/index' })
  } else {
    // 进入下一题
    gameStore.nextQuestion()
    resetQuestion()
  }
}

/**
 * 重置题目状态
 */
const resetQuestion = () => {
  selectedOption.value = ''
  showAnswer.value = false
  isUsedExclude.value = false
  questionStartTime.value = Date.now()

  // 清除定时器
  if (autoNextTimer.value) {
    clearTimeout(autoNextTimer.value)
    autoNextTimer.value = null
  }
}

/**
 * 使用排除道具
 */
const handleExclude = () => {
  if (isUsedExclude.value || showAnswer.value) return

  if (!gameStore.currentQuestion) return

  // 获取错误选项
  const wrongOptions = gameStore.currentQuestion.options.filter(
    opt => opt.key !== gameStore.currentQuestion!.correct_answer
  )

  if (wrongOptions.length > 0) {
    // 随机排除一个错误选项
    const randomIndex = Math.floor(Math.random() * wrongOptions.length)
    const excludedKey = wrongOptions[randomIndex].key

    // 更新store中的排除选项
    gameStore.itemEffect.excludedOptions = [excludedKey]
    isUsedExclude.value = true

    uni.showToast({
      title: `已排除选项 ${excludedKey}`,
      icon: 'none'
    })
  }
}

/**
 * 使用跳过道具
 */
const handleSkip = () => {
  if (showAnswer.value) return

  uni.showModal({
    title: '跳过题目',
    content: '确定要跳过当前题目吗？',
    success: (res) => {
      if (res.confirm) {
        // 使用跳过道具
        gameStore.useItem('skip')

        uni.showToast({
          title: '已跳过',
          icon: 'none'
        })

        // 进入下一题
        setTimeout(() => {
          goToNext()
        }, 500)
      }
    }
  })
}

/**
 * 处理返回按钮点击
 */
const handleBack = () => {
  showConfirmModal.value = true
}

/**
 * 确认退出
 */
const confirmExit = () => {
  // 重置游戏状态
  gameStore.resetGame()
  // 返回上一页或首页
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/home/index' })
  }
}

// ==========================================
// 监听选项变化，自动提交
// ==========================================

// 监听选中选项变化，自动提交答案
watch(selectedOption, (newVal) => {
  if (newVal && !showAnswer.value) {
    submitAnswer()
  }
})

// ==========================================
// 生命周期
// ==========================================

onMounted(() => {
  // 初始化题目
  questionStartTime.value = Date.now()

  // 如果没有题目，生成模拟数据（实际应从API获取）
  if (gameStore.questions.length === 0) {
    // 这里可以调用API获取题目
    // 暂时使用模拟数据
    initMockData()
  }
})

onUnmounted(() => {
  // 清除定时器
  if (autoNextTimer.value) {
    clearTimeout(autoNextTimer.value)
  }
})

/**
 * 初始化模拟数据（开发用）
 */
const initMockData = () => {
  const mockQuestions = Array.from({ length: QUESTION_CONFIG.QUESTION_COUNT }, (_, i) => ({
    question_id: i + 1,
    question_type: 1,
    question_content: `这是第 ${i + 1} 道题目，请问以下哪个选项是正确的？`,
    options: [
      { key: 'A', value: '选项A内容' },
      { key: 'B', value: '选项B内容' },
      { key: 'C', value: '选项C内容' },
      { key: 'D', value: '选项D内容' }
    ],
    correct_answer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
    difficulty: 2,
    knowledge_point: '这是知识点解释'
  }))

  gameStore.startGame(1, mockQuestions as any, 'adventure')
}
</script>

<style lang="scss" scoped>
.answer-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  display: flex;
  flex-direction: column;
}

.nav-placeholder {
  height: 88rpx;
  padding-top: $safe-area-inset-top;
}

.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-white;
}

.question-container {
  flex: 1;
  padding: $spacing-page;
  overflow-y: auto;
}

.toolbar {
  padding: $spacing-page;
  padding-bottom: calc($spacing-page + $safe-area-inset-bottom);
  background-color: $color-bg-card;
  border-top: 1rpx solid $color-border-light;
}

.toolbar-content {
  display: flex;
  justify-content: center;
  gap: $spacing-element-lg;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-element $spacing-element-lg;
  border-radius: $border-radius-base;
  background-color: $color-bg-page;
  transition: all $transition-base;

  &:active:not(.disabled) {
    transform: scale(0.95);
    background-color: rgba($color-primary, 0.1);
  }

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.tool-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-text-sm;

  svg {
    width: 100%;
    height: 100%;
    color: $color-primary;
  }
}

.tool-text {
  font-size: $font-size-sm;
  color: $color-text-primary;
}

// 弹窗样式
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-bg-mask;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-index-modal;
}

.modal-content {
  width: 80%;
  max-width: 600rpx;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  overflow: hidden;
}

.modal-header {
  padding: $spacing-page;
  text-align: center;
  border-bottom: 1rpx solid $color-border-light;
}

.modal-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.modal-body {
  padding: $spacing-page;
}

.modal-text {
  font-size: $font-size-base;
  color: $color-text-secondary;
  line-height: $line-height-normal;
  text-align: center;
}

.modal-footer {
  display: flex;
  border-top: 1rpx solid $color-border-light;
}

.modal-btn {
  flex: 1;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0;
  background-color: transparent;

  &::after {
    display: none;
  }

  &--cancel {
    border-right: 1rpx solid $color-border-light;

    .btn-text {
      color: $color-text-secondary;
    }
  }

  &--confirm {
    .btn-text {
      color: $color-primary;
    }
  }
}

.btn-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
}
</style>
