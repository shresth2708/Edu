const redis = require('redis');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

// Helper functions
const cacheGet = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis GET error:', error);
    return null;
  }
};

const cacheSet = async (key, value, ttl = 3600) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Redis SET error:', error);
    return false;
  }
};

const cacheDel = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis DEL error:', error);
    return false;
  }
};

const cacheFlush = async () => {
  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    logger.error('Redis FLUSH error:', error);
    return false;
  }
};

module.exports = {
  redisClient,
  cacheGet,
  cacheSet,
  cacheDel,
  cacheFlush,
};
