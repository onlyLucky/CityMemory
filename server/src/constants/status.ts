export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const USER_STATUS = {
  NORMAL: 0,
  BANNED: 1,
  DELETED: 2,
} as const;

export const GENDER = {
  UNKNOWN: 0,
  MALE: 1,
  FEMALE: 2,
} as const;

export const REGION_TYPE = {
  COUNTRY: 1,
  PROVINCE: 2,
  CITY: 3,
} as const;

export const LEVEL_STATUS = {
  LOCKED: 0,
  UNLOCKED: 1,
  COMPLETED: 2,
} as const;

export const QUESTION_TYPE = {
  SINGLE_CHOICE: 1,
  MULTI_CHOICE: 2,
  TRUE_FALSE: 3,
  FILL_BLANK: 4,
  IMAGE_CHOICE: 5,
  AUDIO_CHOICE: 6,
} as const;

export const DIFFICULTY = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXPERT: 4,
} as const;

export const ITEM_TYPE = {
  TICKET: 1,
  HINT: 2,
  SKIP: 3,
  TIME_EXTEND: 4,
  SHIELD: 5,
} as const;

export const ITEM_STATUS = {
  OFF_SHELF: 0,
  ON_SHELF: 1,
  SOLD_OUT: 2,
} as const;

export const ADMIN_STATUS = {
  NORMAL: 0,
  DISABLED: 1,
  DELETED: 2,
} as const;

export const ROLE_STATUS = {
  DISABLED: 0,
  ENABLED: 1,
} as const;

export const FEEDBACK_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  RESOLVED: 2,
  CLOSED: 3,
} as const;

export const FEEDBACK_TYPE = {
  BUG: 1,
  SUGGESTION: 2,
  COMPLAINT: 3,
  OTHER: 4,
} as const;

export const RECOMMEND_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  EXPIRED: 2,
} as const;

export const TICKET_CHANGE_TYPE = {
  PURCHASE: 1,
  CONSUME: 2,
  SYSTEM_GIFT: 3,
  LEVEL_REWARD: 4,
} as const;
