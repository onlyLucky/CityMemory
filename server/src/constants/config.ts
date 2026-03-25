export const APP_CONFIG = {
  APP_NAME: '城迹',
  APP_VERSION: '1.0.0',
  API_PREFIX: '/api/v1',
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const JWT_CONFIG = {
  HEADER_PREFIX: 'Bearer',
  TOKEN_EXPIRES_IN: '7d',
  REFRESH_TOKEN_EXPIRES_IN: '30d',
} as const;

export const GAME_CONFIG = {
  INITIAL_TICKETS: 5,
  MAX_TICKETS: 10,
  TICKET_RECOVERY_INTERVAL: 30 * 60 * 1000,
  STAR_REWARD_PER_LEVEL: 3,
  QUESTION_TIME_LIMIT: 30,
  LEVEL_TIME_LIMIT: 600,
} as const;

export const WECHAT_CONFIG = {
  LOGIN_URL: 'https://api.weixin.qq.com/sns/jscode2session',
  GRANT_TYPE: 'authorization_code',
} as const;

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  UPLOAD_DIR: 'uploads',
} as const;

export const REDIS_KEY_PREFIX = {
  USER: 'user:',
  ADMIN: 'admin:',
  TICKET: 'ticket:',
  GAME: 'game:',
  RANKING: 'ranking:',
  CAPTCHA: 'captcha:',
  SESSION: 'session:',
} as const;

export const DATE_FORMAT = {
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
} as const;
