<template>
  <view class="random-entry-page">
    <!-- 顶部导航栏 -->
    <nav-bar title="随机模式" :show-back="true" />

    <!-- 门票显示 -->
    <view class="ticket-section">
      <view class="ticket-card">
        <view class="ticket-icon">
          <text class="icon-emoji">&#127915;</text>
        </view>
        <view class="ticket-info">
          <text class="ticket-label">今日剩余次数</text>
          <text class="ticket-value">{{ usedTickets }}/3</text>
        </view>
      </view>
    </view>

    <!-- 标题 -->
    <view class="section-header">
      <text class="section-title">选择你的挑战：</text>
    </view>

    <!-- 随机选项卡片 -->
    <view class="options-section">
      <view
        v-for="(option, index) in displayOptions"
        :key="index"
        class="option-card"
        :class="{ active: selectedOption === index, disabled: !canSelect(option) }"
        @tap="handleSelectOption(index)"
      >
        <view class="option-icon">
          <text class="icon-emoji">{{ option.icon }}</text>
        </view>
        <view class="option-content">
          <text class="option-name">{{ option.name }}</text>
          <text class="option-desc">{{ option.desc }}</text>
        </view>
        <view v-if="selectedOption === index" class="option-check">
          <text class="check-icon">&#10003;</text>
        </view>
      </view>
    </view>

    <!-- 血池叠加提示 -->
    <view v-if="bloodPoolCount > 0" class="blood-pool-tip">
      <text class="tip-text">已选择血池 x{{ bloodPoolCount }}，初始血量+{{ bloodPoolCount * 3 }}</text>
    </view>

    <!-- 底部操作 -->
    <view class="entry-footer">
      <button
        v-if="hasTickets"
        class="btn-start"
        :disabled="selectedOption === null"
        @tap="handleStartChallenge"
      >
        <text class="btn-text">开始挑战</text>
      </button>
      <button v-else class="btn-disabled" disabled>
        <text class="btn-text">明日再来</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useGameStore } from '@/stores/game'
import { Difficulty } from '@/constants/enums'
import navBar from '@/components/nav-bar/index.vue'

// ==========================================
// 类型定义
// ==========================================

interface RandomOption {
  type: 'difficulty' | 'shop' | 'bloodPool'
  icon: string
  name: string
  desc: string
  difficulty?: Difficulty
  questionCount?: number
  coinMultiplier?: number
}

// ==========================================
// 状态
// ==========================================

const userStore = useUserStore()
const gameStore = useGameStore()

/** 已使用的门票次数 */
const usedTickets = ref(0)

/** 当前选中的选项索引 */
const selectedOption = ref<number | null>(null)

/** 血池叠加次数 */
const bloodPoolCount = ref(0)

/** 选项池 */
const optionPool: RandomOption[] = [
  {
    type: 'difficulty',
    icon: '\u{1F3AF}',
    name: '简单题目',
    desc: '10题 | 金币x1.0',
    difficulty: Difficulty.EASY,
    questionCount: 10,
    coinMultiplier: 1.0
  },
  {
    type: 'difficulty',
    icon: '\u{1F3AF}',
    name: '中等题目',
    desc: '15题 | 金币x1.5',
    difficulty: Difficulty.NORMAL,
    questionCount: 15,
    coinMultiplier: 1.5
  },
  {
    type: 'difficulty',
    icon: '\u{1F3AF}',
    name: '困难题目',
    desc: '20题 | 金币x2.0',
    difficulty: Difficulty.HARD,
    questionCount: 20,
    coinMultiplier: 2.0
  },
  {
    type: 'shop',
    icon: '\u{1F3EA}',
    name: '商店',
    desc: '购买道具'
  },
  {
    type: 'bloodPool',
    icon: '\u2764\uFE0F',
    name: '血池',
    desc: '初始血量+3'
  }
]

/** 显示的选项（从选项池随机生成3个） */
const displayOptions = ref<RandomOption[]>([])

// ==========================================
// 计算属性
// ==========================================

/** 是否还有门票 */
const hasTickets = computed(() => usedTickets.value < 3)

// ==========================================
// 方法
// ==========================================

/**
 * 从选项池随机生成选项
 */
const generateRandomOptions = () => {
  // 确保至少有一个难度选项
  const difficultyOptions = optionPool.filter(o => o.type === 'difficulty')
  const otherOptions = optionPool.filter(o => o.type !== 'difficulty')

  // 随机选择1-2个难度选项
  const shuffledDifficulty = [...difficultyOptions].sort(() => Math.random() - 0.5)
  const selectedDifficulty = shuffledDifficulty.slice(0, Math.random() > 0.5 ? 2 : 1)

  // 随机选择其他选项填补到3个
  const remainingCount = 3 - selectedDifficulty.length
  const shuffledOther = [...otherOptions].sort(() => Math.random() - 0.5)
  const selectedOther = shuffledOther.slice(0, remainingCount)

  // 合并并打乱顺序
  displayOptions.value = [...selectedDifficulty, ...selectedOther].sort(() => Math.random() - 0.5)
}

/**
 * 判断选项是否可选
 */
const canSelect = (option: RandomOption): boolean => {
  if (option.type === 'shop') return true
  return hasTickets.value
}

/**
 * 处理选项选择
 */
const handleSelectOption = (index: number) => {
  const option = displayOptions.value[index]

  // 商店选项直接跳转
  if (option.type === 'shop') {
    uni.navigateTo({ url: '/pages/shop/index' })
    return
  }

  // 血池选项叠加
  if (option.type === 'bloodPool') {
    bloodPoolCount.value++
    return
  }

  // 难度选项切换选中状态
  if (selectedOption.value === index) {
    selectedOption.value = null
  } else {
    selectedOption.value = index
  }
}

/**
 * 开始挑战
 */
const handleStartChallenge = () => {
  if (selectedOption.value === null) return

  const selectedOpt = displayOptions.value[selectedOption.value]
  if (selectedOpt.type !== 'difficulty') return

  // 计算初始血量（默认10，血池每个+3）
  const initialHealth = 10 + bloodPoolCount.value * 3

  // 初始化游戏状态
  gameStore.startGame(
    0, // 随机模式关卡ID为0
    [], // 题目列表将在答题页加载
    'random',
    selectedOpt.difficulty!
  )

  // 设置初始血量
  gameStore.health = initialHealth

  // 存储挑战参数
  uni.setStorageSync('random_challenge', {
    difficulty: selectedOpt.difficulty,
    questionCount: selectedOpt.questionCount,
    coinMultiplier: selectedOpt.coinMultiplier,
    initialHealth,
    bloodPoolCount: bloodPoolCount.value
  })

  // 跳转答题页
  uni.navigateTo({ url: '/pages/random-answer/index' })
}

/**
 * 初始化页面数据
 */
const initPageData = () => {
  // 获取今日已使用次数（从本地存储获取，每日重置）
  const today = new Date().toDateString()
  const savedDate = uni.getStorageSync('random_ticket_date')
  const savedCount = uni.getStorageSync('random_ticket_count') || 0

  if (savedDate === today) {
    usedTickets.value = savedCount
  } else {
    // 新的一天，重置次数
    usedTickets.value = 0
    uni.setStorageSync('random_ticket_date', today)
    uni.setStorageSync('random_ticket_count', 0)
  }

  // 生成随机选项
  generateRandomOptions()
}

// ==========================================
// 生命周期
// ==========================================

onMounted(() => {
  initPageData()
})
</script>

<style lang="scss" scoped>
.random-entry-page {
  min-height: 100vh;
  background-color: $color-bg-page;
  padding-top: calc(88rpx + env(safe-area-inset-top));
  padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
}

// 门票区域
.ticket-section {
  padding: $spacing-page;
}

.ticket-card {
  display: flex;
  align-items: center;
  padding: $spacing-element $spacing-page;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  box-shadow: $shadow-sm;
}

.ticket-icon {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($color-accent, 0.1);
  border-radius: $border-radius-base;
  margin-right: $spacing-element;
}

.icon-emoji {
  font-size: 48rpx;
}

.ticket-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-text-sm;
}

.ticket-label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.ticket-value {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $color-accent;
}

// 标题区域
.section-header {
  padding: 0 $spacing-page $spacing-element;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

// 选项区域
.options-section {
  padding: 0 $spacing-page;
  display: flex;
  flex-direction: column;
  gap: $spacing-element;
}

.option-card {
  display: flex;
  align-items: center;
  padding: $spacing-element $spacing-page;
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  border: 2rpx solid transparent;
  transition: all $transition-base;
  box-shadow: $shadow-sm;

  &:active {
    transform: scale(0.98);
  }

  &.active {
    border-color: $color-primary;
    background-color: rgba($color-primary, 0.05);
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.option-icon {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-bg-page;
  border-radius: $border-radius-base;
  margin-right: $spacing-element;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-text-sm;
}

.option-name {
  font-size: $font-size-lg;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.option-desc {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}

.option-check {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-primary;
  border-radius: $border-radius-round;
}

.check-icon {
  font-size: $font-size-sm;
  color: $color-text-white;
}

// 血池提示
.blood-pool-tip {
  margin: $spacing-element $spacing-page;
  padding: $spacing-element;
  background-color: rgba($color-error, 0.1);
  border-radius: $border-radius-base;
  border-left: 4rpx solid $color-error;
}

.tip-text {
  font-size: $font-size-sm;
  color: $color-error;
}

// 底部操作
.entry-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-page;
  padding-bottom: calc($spacing-page + env(safe-area-inset-bottom));
  background-color: $color-bg-card;
  border-top: 1rpx solid $color-border-light;
}

.btn-start,
.btn-disabled {
  width: 100%;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-lg;
  border: none;

  &::after {
    display: none;
  }
}

.btn-start {
  background-color: $color-primary;

  &[disabled] {
    background-color: $color-border;
  }
}

.btn-disabled {
  background-color: $color-border;
}

.btn-text {
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $color-text-white;
}
</style>
