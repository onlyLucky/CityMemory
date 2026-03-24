import { createClient, RedisClientType } from 'redis';
import { REDIS_CONFIG } from '@/constants/config';
import { logger } from '@/utils/logger';

let redisClient: RedisClientType;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      socket: {
        host: REDIS_CONFIG.host,
        port: REDIS_CONFIG.port,
      },
      password: REDIS_CONFIG.password,
      database: REDIS_CONFIG.db,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis客户端错误', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis连接成功');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Redis连接失败', error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis客户端未初始化');
  }
  return redisClient;
};

export default redisClient;
