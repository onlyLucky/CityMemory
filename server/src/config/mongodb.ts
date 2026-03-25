import mongoose from 'mongoose';
import config from './index';

let isConnected = false;

export const initMongoDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  const { host, port, user, password, database, authSource } = config.mongodb;

  let uri: string;
  if (user && password) {
    uri = `mongodb://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}?authSource=${authSource}`;
  } else {
    uri = `mongodb://${host}:${port}/${database}`;
  }

  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('MongoDB数据库连接成功');

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB连接错误:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB连接断开');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB重新连接成功');
      isConnected = true;
    });
  } catch (error) {
    console.error('MongoDB数据库连接失败:', error);
    throw error;
  }
};

export const getMongoConnection = (): mongoose.Connection => {
  return mongoose.connection;
};

export const closeMongoDB = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB数据库连接已关闭');
  }
};
