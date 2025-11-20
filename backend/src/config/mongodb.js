const mongoose = require('mongoose');
const logger = require('../utils/logger');

const mongoConnect = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);

    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

module.exports = mongoConnect;
