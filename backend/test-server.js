// Simple test server without database dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

// Mock users storage
const users = [];
const tokens = {};

// Helper functions
const generateToken = () => {
  return 'mock_token_' + Math.random().toString(36).substr(2, 9);
};

const hashPassword = (password) => {
  return 'hashed_' + password;
};

const comparePassword = (plain, hashed) => {
  return hashed === 'hashed_' + plain;
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'test',
    services: {
      database: 'mocked',
      redis: 'mocked',
      mongodb: 'mocked'
    }
  });
});

// Register
app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, firstName, lastName, phone, role } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
      errors: ['email, password, firstName, and lastName are required']
    });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  const user = {
    id: 'user_' + Date.now(),
    email,
    password: hashPassword(password),
    firstName,
    lastName,
    phone: phone || null,
    role: role || 'STUDENT',
    isActive: true,
    isEmailVerified: false,
    referralCode: `${firstName.toUpperCase()}-${lastName.toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  const accessToken = generateToken();
  const refreshToken = generateToken();
  
  tokens[accessToken] = user.id;

  const { password: _, ...sanitizedUser } = user;

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please verify your email.',
    data: {
      user: sanitizedUser,
      accessToken,
      refreshToken
    }
  });
});

// Login
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  if (!comparePassword(password, user.password)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const accessToken = generateToken();
  const refreshToken = generateToken();
  
  tokens[accessToken] = user.id;

  const { password: _, ...sanitizedUser } = user;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: sanitizedUser,
      accessToken,
      refreshToken
    }
  });
});

// Get current user
app.get('/api/v1/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const token = authHeader.split(' ')[1];
  const userId = tokens[token];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const { password: _, ...sanitizedUser } = user;

  res.status(200).json({
    success: true,
    data: sanitizedUser
  });
});

// Logout
app.post('/api/v1/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    delete tokens[token];
  }

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// Refresh token
app.post('/api/v1/auth/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  const newAccessToken = generateToken();
  
  res.status(200).json({
    success: true,
    data: {
      accessToken: newAccessToken
    }
  });
});

// Forgot password
app.post('/api/v1/auth/forgot-password', (req, res) => {
  const { email } = req.body;

  res.status(200).json({
    success: true,
    message: 'Password reset OTP sent to your email'
  });
});

// Reset password
app.post('/api/v1/auth/reset-password', (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Email, OTP, and new password are required'
    });
  }

  const user = users.find(u => u.email === email);
  if (user) {
    user.password = hashPassword(newPassword);
  }

  res.status(200).json({
    success: true,
    message: 'Password reset successfully'
  });
});

// Change password
app.post('/api/v1/auth/change-password', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Old password and new password are required'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Mock other routes
app.get('/api/v1/users', (req, res) => {
  res.json({
    success: true,
    message: 'User routes',
    data: { users: users.map(u => ({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role })) }
  });
});

app.get('/api/v1/courses', (req, res) => {
  res.json({
    success: true,
    message: 'Course routes',
    data: { courses: [] }
  });
});

app.get('/api/v1/enrollments', (req, res) => {
  res.json({ success: true, message: 'Enrollment routes' });
});

app.get('/api/v1/live-classes', (req, res) => {
  res.json({ success: true, message: 'Live class routes' });
});

app.get('/api/v1/tests', (req, res) => {
  res.json({ success: true, message: 'Test routes' });
});

app.get('/api/v1/payments', (req, res) => {
  res.json({ success: true, message: 'Payment routes' });
});

app.get('/api/v1/dashboard', (req, res) => {
  res.json({ success: true, message: 'Dashboard routes' });
});

app.get('/api/v1/analytics', (req, res) => {
  res.json({ success: true, message: 'Analytics routes' });
});

app.get('/api/v1/notifications', (req, res) => {
  res.json({ success: true, message: 'Notification routes' });
});

app.get('/api/v1/ai', (req, res) => {
  res.json({ success: true, message: 'AI routes' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Test Server running on port ${PORT}`);
  console.log(`📊 Environment: test`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1\n`);
});
