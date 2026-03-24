import mongoose from 'mongoose';
import { MONGODB_CONFIG } from '@/constants/config';
import { logger } from '@/utils/logger';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_CONFIG.uri);
    logger.info('MongoDB连接成功');
  } catch (error) {
    logger.error('MongoDB连接失败', error);
    throw error;
  }
};

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB连接错误', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB连接断开');
});

export default mongoose;
