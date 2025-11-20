const { validationResult } = require('express-validator');
const prisma = require('../config/database');
const { AppError } = require('../middleware/errorHandler');
const {
  generateToken,
  hashPassword,
  comparePassword,
  generateReferralCode,
  sanitizeUser,
  generateOTP,
  validatePasswordStrength,
} = require('../utils/auth');
const { cacheSet, cacheDel } = require('../config/redis');
const logger = require('../utils/logger');

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password, phone, firstName, lastName, role } = req.body;

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors,
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new AppError('User with this email or phone already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate referral code
    const referralCode = generateReferralCode(firstName, lastName);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        referralCode,
      },
    });

    // Create role-specific profile
    if (role === 'TEACHER') {
      await prisma.teacherProfile.create({
        data: { userId: user.id },
      });
    } else if (role === 'STUDENT') {
      await prisma.studentProfile.create({
        data: { userId: user.id },
      });
    } else if (role === 'PARENT') {
      await prisma.parentProfile.create({
        data: { userId: user.id },
      });
    }

    // Generate tokens
    const accessToken = generateToken(user.id);
    const refreshToken = generateToken(user.id, 'refresh');

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Generate and cache OTP for email verification
    const otp = generateOTP();
    await cacheSet(`email_otp:${user.id}`, otp, 600); // 10 minutes

    // TODO: Send verification email with OTP
    logger.info(`OTP for user ${user.email}: ${otp}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        teacherProfile: true,
        studentProfile: true,
        parentProfile: true,
      },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated. Please contact support.', 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate tokens
    const accessToken = generateToken(user.id);
    const refreshToken = generateToken(user.id, 'refresh');

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      // Delete refresh token
      await prisma.refreshToken.deleteMany({
        where: {
          userId: req.user.id,
        },
      });

      // Invalidate access token in cache
      await cacheSet(`blacklist:${token}`, true, 86400); // 24 hours
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Generate new access token
    const newAccessToken = generateToken(decoded.userId);

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        teacherProfile: true,
        studentProfile: true,
        parentProfile: true,
      },
    });

    res.status(200).json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email with OTP
// @route   POST /api/v1/auth/verify-email
// @access  Private
const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      throw new AppError('OTP is required', 400);
    }

    // Get OTP from cache
    const cachedOTP = await cacheGet(`email_otp:${req.user.id}`);

    if (!cachedOTP || cachedOTP !== otp) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    // Update user
    await prisma.user.update({
      where: { id: req.user.id },
      data: { isEmailVerified: true },
    });

    // Delete OTP from cache
    await cacheDel(`email_otp:${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP (generic)
// @route   POST /api/v1/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, purpose } = req.body;

    if (!email || !otp || !purpose) {
      throw new AppError('Email, OTP, and purpose are required', 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const cachedOTP = await cacheGet(`${purpose}_otp:${user.id}`);

    if (!cachedOTP || cachedOTP !== otp) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    await cacheDel(`${purpose}_otp:${user.id}`);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: { userId: user.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/v1/auth/resend-otp
// @access  Private
const resendOTP = async (req, res, next) => {
  try {
    const otp = generateOTP();
    await cacheSet(`email_otp:${req.user.id}`, otp, 600);

    // TODO: Send OTP via email
    logger.info(`New OTP for user ${req.user.email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a reset link will be sent',
      });
    }

    const otp = generateOTP();
    await cacheSet(`password_reset_otp:${user.id}`, otp, 600);

    // TODO: Send reset email with OTP
    logger.info(`Password reset OTP for ${email}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const cachedOTP = await cacheGet(`password_reset_otp:${user.id}`);

    if (!cachedOTP || cachedOTP !== otp) {
      throw new AppError('Invalid or expired OTP', 400);
    }

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        errors: passwordValidation.errors,
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await cacheDel(`password_reset_otp:${user.id}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   POST /api/v1/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    const isPasswordValid = await comparePassword(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        errors: passwordValidation.errors,
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  verifyEmail,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  changePassword,
};
