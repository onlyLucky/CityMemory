<template>
  <view class="question-card">
    <!-- 题目类型标签 -->
    <view class="question-card__header">
      <view class="question-card__tag" :class="`question-card__tag--${question.question_type}`">
        {{ questionTypeLabel }}
      </view>
      <view v-if="question.difficulty" class="question-card__difficulty">
        {{ difficultyLabel }}
      </view>
    </view>

    <!-- 题目内容 -->
    <view class="question-card__content">
      <text class="question-card__text">{{ question.question_content }}</text>

      <!-- 题目图片 -->
      <image
        v-if="question.question_image"
        :src="question.question_image"
        class="question-card__image"
        mode="widthFix"
        @click="handleImagePreview"
      />
    </view>

    <!-- 选项列表 -->
    <view class="question-card__options">
      <view
        v-for="option in question.options"
        :key="option.key"
        class="question-card__option"
        :class="{
          'question-card__option--selected': selectedOption === option.key,
          'question-card__option--correct': showAnswer && option.key === question.correct_answer,
          'question-card__option--wrong': showAnswer && selectedOption === option.key && selectedOption !== question.correct_answer,
          'question-card__option--disabled': disabled
        }"
        @click="handleSelect(option.key)"
      >
        <view class="question-card__option-key">{{ option.key }}</view>
        <text class="question-card__option-value">{{ option.value }}</text>

        <!-- 正确标记 -->
        <view v-if="showAnswer && option.key === question.correct_answer" class="question-card__option-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </view>

        <!-- 错误标记 -->
        <view v-if="showAnswer && selectedOption === option.key && selectedOption !== question.correct_answer" class="question-card__option-icon question-card__option-icon--wrong">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </view>
      </view>
    </view>

    <!-- 知识点解释 -->
    <view v-if="showAnswer && question.knowledge_point" class="question-card__knowledge">
      <view class="question-card__knowledge-title">知识点</view>
      <text class="question-card__knowledge-text">{{ question.knowledge_point }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Question } from '@/types/question'
import { QuestionType, Difficulty } from '@/constants/enums'

/**
 * 题目卡片组件
 * 显示题目内容、选项和答题反馈
 */

interface Props {
  /** 题目对象 */
  question: Question
  /** 是否显示答案 */
  showAnswer?: boolean
  /** 是否禁用选项 */
  disabled?: boolean
  /** 已选选项 */
  selectedOption?: string
}

const props = withDefaults(defineProps<Props>(), {
  showAnswer: false,
  disabled: false,
  selectedOption: ''
})

const emit = defineEmits<{
  (e: 'select', optionKey: string): void
}>()

// 题目类型标签
const questionTypeLabel = computed(() => {
  const typeMap: Record<number, string> = {
    [QuestionType.CITY_TO_PROVINCE]: '城市对应省份',
    [QuestionType.CITY_TO_COUNTRY]: '城市对应国家',
    [QuestionType.ANCIENT_TO_MODERN]: '古称对应今称',
    [QuestionType.FLAG_TO_COUNTRY]: '国旗对应国家'
  }
  return typeMap[props.question.question_type] || '未知类型'
})

// 难度标签
const difficultyLabel = computed(() => {
  const difficultyMap: Record<number, string> = {
    [Difficulty.EASY]: '简单',
    [Difficulty.NORMAL]: '普通',
    [Difficulty.HARD]: '困难'
  }
  return difficultyMap[props.question.difficulty] || ''
})

// 选择选项
const handleSelect = (optionKey: string) => {
  if (!props.disabled && !props.showAnswer) {
    emit('select', optionKey)
  }
}

// 预览图片
const handleImagePreview = () => {
  if (props.question.question_image) {
    uni.previewImage({
      urls: [props.question.question_image]
    })
  }
}
</script>

<style lang="scss" scoped>
.question-card {
  background-color: $color-bg-card;
  border-radius: $border-radius-lg;
  padding: $spacing-page;
  box-shadow: $shadow-sm;

  &__header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 24rpx;
  }

  &__tag {
    padding: 8rpx 16rpx;
    border-radius: $border-radius-sm;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    background-color: rgba($color-primary, 0.1);
    color: $color-primary;
  }

  &__difficulty {
    padding: 8rpx 16rpx;
    border-radius: $border-radius-sm;
    font-size: $font-size-xs;
    background-color: $color-bg-page;
    color: $color-text-secondary;
  }

  &__content {
    margin-bottom: 32rpx;
  }

  &__text {
    font-size: $font-size-lg;
    line-height: $line-height-loose;
    color: $color-text-primary;
    display: block;
    margin-bottom: 24rpx;
  }

  &__image {
    width: 100%;
    border-radius: $border-radius-base;
    margin-top: 16rpx;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  &__option {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
    padding: 20rpx 24rpx;
    border-radius: $border-radius-base;
    border: 2rpx solid $color-border;
    background-color: $color-bg-card;
    transition: all $transition-fast;
    position: relative;

    &:active {
      transform: scale(0.98);
    }

    &--selected {
      border-color: $color-primary;
      background-color: rgba($color-primary, 0.05);
    }

    &--correct {
      border-color: $color-success;
      background-color: rgba($color-success, 0.05);
    }

    &--wrong {
      border-color: $color-error;
      background-color: rgba($color-error, 0.05);
    }

    &--disabled {
      opacity: 0.7;
      pointer-events: none;
    }
  }

  &__option-key {
    width: 48rpx;
    height: 48rpx;
    border-radius: $border-radius-sm;
    background-color: $color-bg-page;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $color-text-secondary;
    flex-shrink: 0;

    .question-card__option--selected & {
      background-color: $color-primary;
      color: $color-text-white;
    }

    .question-card__option--correct & {
      background-color: $color-success;
      color: $color-text-white;
    }

    .question-card__option--wrong & {
      background-color: $color-error;
      color: $color-text-white;
    }
  }

  &__option-value {
    flex: 1;
    font-size: $font-size-base;
    line-height: $line-height-normal;
    color: $color-text-primary;
    padding-top: 8rpx;
  }

  &__option-icon {
    width: 40rpx;
    height: 40rpx;
    background-color: $color-success;
    border-radius: $border-radius-round;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 24rpx;
      height: 24rpx;
      color: $color-text-white;
    }

    &--wrong {
      background-color: $color-error;
    }
  }

  &__knowledge {
    margin-top: 32rpx;
    padding: 24rpx;
    background-color: rgba($color-info, 0.05);
    border-radius: $border-radius-base;
    border-left: 4rpx solid $color-info;
  }

  &__knowledge-title {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-info;
    margin-bottom: 12rpx;
  }

  &__knowledge-text {
    font-size: $font-size-sm;
    line-height: $line-height-normal;
    color: $color-text-secondary;
  }
}
</style>
