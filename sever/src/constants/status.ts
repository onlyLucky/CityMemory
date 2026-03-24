export const STATUS_CODE = {
  SUCCESS: 0,
  ERROR: 1,
} as const;

export const QUESTION_TYPE = {
  CITY_TO_PROVINCE: 1,
  CITY_TO_COUNTRY: 2,
  ANCIENT_TO_MODERN: 3,
  FLAG_TO_COUNTRY: 4,
} as const;

export const LEVEL_STATUS = {
  ENABLED: 1,
  DISABLED: 0,
} as const;

export const USER_LEVEL_STATUS = {
  UNLOCKED: 1,
  COMPLETED: 2,
} as const;

export const QUESTION_STATUS = {
  ENABLED: 1,
  DISABLED: 0,
  PENDING: 2,
} as const;

export const ADMIN_STATUS = {
  ENABLED: 1,
  DISABLED: 0,
} as const;

export const ITEM_TYPE = {
  TICKET: 'ticket',
  ITEM: 'item',
} as const;

export const RANK_TYPE = {
  STAR: 'star',
  LEVEL: 'level',
} as const;

export const FEEDBACK_TYPE = {
  SUGGESTION: 'suggestion',
  BUG: 'bug',
  COMPLAINT: 'complaint',
  OTHER: 'other',
} as const;

export const FEEDBACK_STATUS = {
  PENDING: 'pending',
  PROCESSED: 'processed',
  CLOSED: 'closed',
} as const;

export const TICKET_CONFIG = {
  ADVENTURE_MAX: 30,
  ADVENTURE_RECOVER_INTERVAL: 600,
  RANDOM_MAX: 3,
  RANDOM_DAILY_RESET: true,
} as const;

export const STAR_CONFIG = {
  MAX: 6,
  MIN: 0.5,
  STEP: 0.5,
} as const;

export const LEVEL_CONFIG = {
  QUESTION_COUNT: 10,
  PASS_RATE: 0.6,
} as const;

export const RANDOM_MODE_CONFIG = {
  INITIAL_BLOOD: 10,
  BLOOD_POOL_BONUS: 3,
  DIFFICULTY_MULTIPLIER: {
    EASY: 1.0,
    MEDIUM: 1.5,
    HARD: 2.0,
  },
  QUESTION_COUNT: {
    EASY: 10,
    MEDIUM: 15,
    HARD: 20,
  },
} as const;
