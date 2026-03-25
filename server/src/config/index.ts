import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
}

interface MongoConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  authSource: string;
}

interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

interface WechatConfig {
  appId: string;
  secret: string;
}

interface AppConfig {
  nodeEnv: string;
  port: number;
  host: string;
}

interface LogConfig {
  level: string;
  dir: string;
}

interface UploadConfig {
  dir: string;
  maxFileSize: number;
}

interface PaginationConfig {
  defaultPageSize: number;
  maxPageSize: number;
}

interface GameConfig {
  initialTickets: number;
  ticketRecoveryInterval: number;
  maxTickets: number;
  starRewardPerLevel: number;
}

interface Config {
  app: AppConfig;
  mysql: DatabaseConfig;
  mongodb: MongoConfig;
  redis: RedisConfig;
  jwt: JwtConfig;
  wechat: WechatConfig;
  log: LogConfig;
  upload: UploadConfig;
  pagination: PaginationConfig;
  game: GameConfig;
}

const config: Config = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
  },
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'city_memory',
    connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT || '10', 10),
  },
  mongodb: {
    host: process.env.MONGODB_HOST || 'localhost',
    port: parseInt(process.env.MONGODB_PORT || '27017', 10),
    user: process.env.MONGODB_USER || '',
    password: process.env.MONGODB_PASSWORD || '',
    database: process.env.MONGODB_DATABASE || 'city_memory',
    authSource: process.env.MONGODB_AUTH_SOURCE || 'admin',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  wechat: {
    appId: process.env.WECHAT_APPID || '',
    secret: process.env.WECHAT_SECRET || '',
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || 'logs',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  },
  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '20', 10),
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),
  },
  game: {
    initialTickets: parseInt(process.env.INITIAL_TICKETS || '5', 10),
    ticketRecoveryInterval: parseInt(process.env.TICKET_RECOVERY_INTERVAL || '1800000', 10),
    maxTickets: parseInt(process.env.MAX_TICKETS || '10', 10),
    starRewardPerLevel: parseInt(process.env.STAR_REWARD_PER_LEVEL || '3', 10),
  },
};

export default config;
