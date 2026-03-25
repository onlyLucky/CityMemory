import Redis from 'ioredis';
import config from './index';
import { logger } from './logger';

let redis: Redis | null = null;

export const initRedis = async (): Promise<Redis> => {
  if (redis) {
    return redis;
  }

  redis = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
    db: config.redis.db,
    retryStrategy: (times: number) => {
      if (times > 3) {
        logger.error('Redis连接重试次数超过限制');
        return null;
      }
      return Math.min(times * 200, 2000);
    },
    maxRetriesPerRequest: 3,
  });

  return new Promise((resolve, reject) => {
    redis!.on('connect', () => {
      logger.info('Redis连接成功');
      resolve(redis!);
    });

    redis!.on('error', (error) => {
      logger.error('Redis连接错误:', error);
      reject(error);
    });

    redis!.on('close', () => {
      logger.warn('Redis连接关闭');
    });
  });
};

export const getRedis = (): Redis => {
  if (!redis) {
    throw new Error('Redis未初始化');
  }
  return redis;
};

export const closeRedis = async (): Promise<void> => {
  if (redis) {
    redis.disconnect();
    redis = null;
    logger.info('Redis连接已关闭');
  }
};

export const redisKeys = {
  userTicket: (userId: number) => `user:ticket:${userId}`,
  userSession: (userId: number) => `user:session:${userId}`,
  gameSession: (sessionId: string) => `game:session:${sessionId}`,
  levelQuestions: (levelId: number) => `level:questions:${levelId}`,
  userProgress: (userId: number) => `user:progress:${userId}`,
  rankingList: (type: string) => `ranking:${type}`,
  dailyStats: (date: string) => `stats:daily:${date}`,
  captcha: (sessionId: string) => `captcha:${sessionId}`,
  adminToken: (adminId: number) => `admin:token:${adminId}`,
  rateLimit: (ip: string) => `rate:${ip}`,
};

export const redisUtils = {
  async get<T>(key: string): Promise<T | null> {
    const client = getRedis();
    const data = await client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  },

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const client = getRedis();
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      await client.setex(key, ttl, data);
    } else {
      await client.set(key, data);
    }
  },

  setex: async function(key: string, ttl: number, value: unknown): Promise<void> {
    const client = getRedis();
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    await client.setex(key, ttl, data);
  },

  async del(key: string): Promise<void> {
    const client = getRedis();
    await client.del(key);
  },

  async exists(key: string): Promise<boolean> {
    const client = getRedis();
    return (await client.exists(key)) === 1;
  },

  async expire(key: string, ttl: number): Promise<void> {
    const client = getRedis();
    await client.expire(key, ttl);
  },

  async ttl(key: string): Promise<number> {
    const client = getRedis();
    return await client.ttl(key);
  },

  async incr(key: string): Promise<number> {
    const client = getRedis();
    return await client.incr(key);
  },

  async decr(key: string): Promise<number> {
    const client = getRedis();
    return await client.decr(key);
  },

  async hset(key: string, field: string, value: unknown): Promise<void> {
    const client = getRedis();
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    await client.hset(key, field, data);
  },

  async hget<T>(key: string, field: string): Promise<T | null> {
    const client = getRedis();
    const data = await client.hget(key, field);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  },

  async hgetall<T>(key: string): Promise<Record<string, T>> {
    const client = getRedis();
    const data = await client.hgetall(key);
    const result: Record<string, T> = {};
    for (const [field, value] of Object.entries(data)) {
      try {
        result[field] = JSON.parse(value) as T;
      } catch {
        result[field] = value as unknown as T;
      }
    }
    return result;
  },

  async zadd(key: string, score: number, member: string): Promise<void> {
    const client = getRedis();
    await client.zadd(key, score, member);
  },

  async zrange<T>(
    key: string,
    start: number,
    stop: number,
    withScores = false,
  ): Promise<T[]> {
    const client = getRedis();
    const args: (string | number)[] = [key, start, stop];
    if (withScores) {
      args.push('WITHSCORES');
    }
    const data = await client.zrange(args as [string, number, number, string?]);
    return data as unknown as T[];
  },

  async zrevrange<T>(
    key: string,
    start: number,
    stop: number,
    withScores = false,
  ): Promise<T[]> {
    const client = getRedis();
    const args: (string | number)[] = [key, start, stop];
    if (withScores) {
      args.push('WITHSCORES');
    }
    const data = await client.zrevrange(args as [string, number, number, string?]);
    return data as unknown as T[];
  },

  async zscore(key: string, member: string): Promise<number | null> {
    const client = getRedis();
    const score = await client.zscore(key, member);
    return score ? parseFloat(score) : null;
  },

  async zrank(key: string, member: string): Promise<number | null> {
    const client = getRedis();
    const rank = await client.zrank(key, member);
    return rank;
  },
};
