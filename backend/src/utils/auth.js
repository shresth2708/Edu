const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate JWT token
const generateToken = (userId, type = 'access') => {
  const secret = type === 'refresh' ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
  const expiresIn = type === 'refresh' ? process.env.JWT_REFRESH_EXPIRE : process.env.JWT_EXPIRE;

  return jwt.sign({ userId, type }, secret, { expiresIn });
};

// Verify JWT token
const verifyToken = (token, type = 'access') => {
  const secret = type === 'refresh' ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate random string (for OTP, referral codes, etc.)
const generateRandomString = (length = 6, type = 'numeric') => {
  if (type === 'numeric') {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  if (type === 'alphanumeric') {
    return crypto.randomBytes(length).toString('hex').substring(0, length).toUpperCase();
  }
  
  return crypto.randomBytes(length).toString('hex');
};

// Generate unique referral code
const generateReferralCode = (firstName, lastName) => {
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  const random = generateRandomString(6, 'alphanumeric');
  return `${initials}${random}`;
};

// Sanitize user data (remove sensitive info)
const sanitizeUser = (user) => {
  const sanitized = { ...user };
  delete sanitized.password;
  delete sanitized.twoFactorEnabled;
  return sanitized;
};

// Generate OTP
const generateOTP = () => {
  return generateRandomString(6, 'numeric');
};

// Validate password strength
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generateRandomString,
  generateReferralCode,
  sanitizeUser,
  generateOTP,
  validatePasswordStrength,
};
