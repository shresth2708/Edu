require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

const logger = require('./utils/logger');
const prisma = require('./config/database');
const mongoConnect = require('./config/mongodb');
const redisClient = require('./config/redis');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const liveClassRoutes = require('./routes/liveClass.routes');
const testRoutes = require('./routes/test.routes');
const paymentRoutes = require('./routes/payment.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const notificationRoutes = require('./routes/notification.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();
const server = http.createServer(app);

// Socket.io setup for real-time features
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Rate limiting
app.use('/api/', rateLimiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      services: {
        database: 'connected',
        redis: redisClient.redisClient.isReady ? 'connected' : 'disconnected',
        mongodb: 'connected'
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      message: 'Service unavailable'
    });
  }
});

// API routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/courses`, courseRoutes);
app.use(`/api/${API_VERSION}/enrollments`, enrollmentRoutes);
app.use(`/api/${API_VERSION}/live-classes`, liveClassRoutes);
app.use(`/api/${API_VERSION}/tests`, testRoutes);
app.use(`/api/${API_VERSION}/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/dashboard`, dashboardRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${API_VERSION}/ai`, aiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`New socket connection: ${socket.id}`);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    logger.info(`Socket ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    logger.info(`Socket ${socket.id} left room ${roomId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, closing server gracefully...');
  
  server.close(async () => {
    try {
      await prisma.$disconnect();
      await redisClient.redisClient.quit();
      logger.info('All connections closed. Server shut down gracefully.');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to databases
    await prisma.$connect();
    logger.info('PostgreSQL connected via Prisma');
    
    await mongoConnect();
    logger.info('MongoDB connected');
    
    // Connect to Redis
    await redisClient.redisClient.connect();
    logger.info('Redis connected');
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`🚀 EduPro+ Backend Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api/${API_VERSION}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };
