const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('role').isIn(['TEACHER', 'STUDENT', 'PARENT']).withMessage('Invalid role'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long'),
];

const resetPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
];

// Routes
router.post('/register', authRateLimiter, registerValidation, authController.register);
router.post('/login', authRateLimiter, loginValidation, authController.login);
router.post('/logout', auth, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/verify-email', auth, authController.verifyEmail);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', auth, authController.resendOTP);
router.post('/forgot-password', resetPasswordValidation, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', auth, changePasswordValidation, authController.changePassword);
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
