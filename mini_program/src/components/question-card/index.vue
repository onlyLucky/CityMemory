<template>
  <view class="question-card">
    <view class="question-header">
      <view class="question-type">{{ questionTypeText }}</view>
      <view class="question-progress">{{ progress }}</view>
    </view>

    <view class="question-content">
      <text v-if="question.questionImage" class="question-image">{{ question.questionImage }}</text>
      <text class="question-text">{{ question.questionContent }}</text>
    </view>

    <view class="question-options">
      <view
        v-for="option in question.options"
        :key="option.key"
        class="option-item"
        :class="{
          'selected': selectedOption === option.key,
          'correct': showAnswer && option.key === question.correctAnswer,
          'wrong': showAnswer && selectedOption === option.key && option.key !== question.correctAnswer,
          'disabled': disabled || showAnswer
        }"
        @tap="handleOptionTap(option.key)"
      >
        <view class="option-key">{{ option.key }}</view>
        <view class="option-value">{{ option.value }}</view>
        <view v-if="showAnswer && option.key === question.correctAnswer" class="option-icon">✓</view>
        <view v-if="showAnswer && selectedOption === option.key && option.key !== question.correctAnswer" class="option-icon wrong">✗</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Question } from '@/types'
import { QUESTION_TYPES } from '@/constants/config'

interface Props {
  question: Question
  progress: string
  showAnswer?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAnswer: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'select', option: string): void
}>()

const selectedOption = ref('')

const questionTypeText = computed(() => {
  const typeMap: Record<number, string> = {
    [QUESTION_TYPES.CITY_TO_PROVINCE]: '城市猜省份',
    [QUESTION_TYPES.CITY_TO_COUNTRY]: '城市猜国家',
    [QUESTION_TYPES.ANCIENT_TO_MODERN]: '古称猜今名',
    [QUESTION_TYPES.FLAG_TO_COUNTRY]: '国旗猜国家'
  }
  return typeMap[props.question.questionType] || '未知题型'
})

const handleOptionTap = (key: string) => {
  if (props.disabled || props.showAnswer) return
  selectedOption.value = key
  emit('select', key)
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.question-card {
  background: #fff;
  border-radius: $radius-lg;
  padding: $spacing-xl;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
}

.question-type {
  padding: $spacing-xs $spacing-sm;
  background: rgba(46, 125, 50, 0.1);
  color: $primary-color;
  border-radius: $radius-sm;
  font-size: $font-size-sm;
  font-weight: 500;
}

.question-progress {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.question-content {
  margin-bottom: $spacing-xl;
}

.question-image {
  display: block;
  font-size: 120rpx;
  text-align: center;
  margin-bottom: $spacing-lg;
}

.question-text {
  font-size: $font-size-lg;
  color: $text-primary;
  line-height: 1.6;
  display: block;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.option-item {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  background: #f5f5f5;
  border-radius: $radius-md;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  position: relative;

  &.selected {
    border-color: $primary-color;
    background: rgba(46, 125, 50, 0.05);
  }

  &.correct {
    border-color: $success-color;
    background: rgba(76, 175, 80, 0.1);
  }

  &.wrong {
    border-color: $error-color;
    background: rgba(244, 67, 54, 0.1);
  }

  &.disabled {
    opacity: 0.6;
  }

  &:not(.disabled):active {
    transform: scale(0.98);
  }
}

.option-key {
  width: 60rpx;
  height: 60rpx;
  background: $primary-color;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-md;
  font-weight: bold;
  margin-right: $spacing-md;
  flex-shrink: 0;
}

.option-value {
  flex: 1;
  font-size: $font-size-md;
  color: $text-primary;
}

.option-icon {
  position: absolute;
  right: $spacing-lg;
  font-size: 40rpx;
  font-weight: bold;

  &.wrong {
    color: $error-color;
  }
}
</style>
