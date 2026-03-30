// MongoDB索引初始化脚本

db = db.getSiblingDB('city_memory');

// 用户进度集合索引
db.user_progress.createIndex({ userId: 1 }, { unique: true });
db.user_progress.createIndex({ totalStars: -1 });
db.user_progress.createIndex({ updateTime: -1 });

// 游戏记录集合索引
db.game_record.createIndex({ userId: 1, levelId: 1 });
db.game_record.createIndex({ userId: 1, startTime: -1 });
db.game_record.createIndex({ levelId: 1, stars: -1 });
db.game_record.createIndex({ sessionId: 1 }, { unique: true });
db.game_record.createIndex({ createTime: -1 });

// 关卡会话集合索引
db.level_session.createIndex({ sessionId: 1 }, { unique: true });
db.level_session.createIndex({ userId: 1, levelId: 1, status: 1 });
db.level_session.createIndex({ startTime: 1 }, { expireAfterSeconds: 7200 });

// 答题失败记录集合索引
db.answer_fail_record.createIndex({ userId: 1, questionId: 1 }, { unique: true });
db.answer_fail_record.createIndex({ userId: 1, levelId: 1 });
db.answer_fail_record.createIndex({ lastFailTime: -1 });

print('MongoDB indexes created successfully');
