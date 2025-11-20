# EduPro+ API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5001/api/v1`  
**Generated:** November 20, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Health Check](#health-check)
4. [Auth Endpoints](#auth-endpoints)
5. [User Management](#user-management)
6. [Course Management](#course-management)
7. [Enrollment](#enrollment)
8. [Live Classes](#live-classes)
9. [Tests & Quizzes](#tests--quizzes)
10. [Payments](#payments)
11. [Dashboard](#dashboard)
12. [Analytics](#analytics)
13. [Notifications](#notifications)
14. [AI Services](#ai-services)
15. [Error Handling](#error-handling)
16. [Rate Limiting](#rate-limiting)

---

## Overview

The EduPro+ API is a RESTful API that provides comprehensive educational platform functionality including user management, course delivery, live classes, assessments, payments, and AI-powered features.

### Base Configuration

- **Protocol:** HTTP/HTTPS
- **Port:** 5001 (development)
- **API Version:** v1
- **Content-Type:** application/json
- **Authentication:** JWT Bearer Token

### Quick Start

```bash
# Health check
curl -X GET http://localhost:5001/health

# Register user
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass@123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+919876543210",
    "role": "STUDENT"
  }'

# Login
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass@123"
  }'
```

---

## Authentication

All protected endpoints require a JWT access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Types

1. **Access Token** - Short-lived (7 days), used for API authentication
2. **Refresh Token** - Long-lived (30 days), used to obtain new access tokens

### User Roles

- `STUDENT` - Regular students enrolled in courses
- `TEACHER` - Instructors who create and manage courses
- `PARENT` - Parents monitoring student progress
- `ADMIN` - Platform administrators with full access

---

## Health Check

### Check System Health

Check the status of all backend services.

**Endpoint:** `GET /health`

**Authentication:** None

**Request:**
```bash
curl -X GET http://localhost:5001/health
```

**Success Response (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2025-11-20T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "services": {
    "database": "connected",
    "redis": "connected",
    "mongodb": "connected"
  }
}
```

**Error Response (503 Service Unavailable):**
```json
{
  "status": "ERROR",
  "message": "Service unavailable"
}
```

---

## Auth Endpoints

### 1. Register New User

Create a new user account with role-specific profile.

**Endpoint:** `POST /api/v1/auth/register`

**Authentication:** None

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass@123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "role": "STUDENT"
}
```

**Field Validation:**
- `email`: Valid email format, unique
- `password`: Min 8 chars, must include uppercase, lowercase, number, special char
- `phone`: Valid phone number with country code (optional)
- `role`: STUDENT | TEACHER | PARENT | ADMIN

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+919876543210",
      "role": "STUDENT",
      "isActive": true,
      "isEmailVerified": false,
      "referralCode": "JOHN-DOE-A1B2",
      "createdAt": "2025-11-20T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

*400 Bad Request - Validation Error:*
```json
{
  "success": false,
  "message": "Password does not meet requirements",
  "errors": [
    "Password must be at least 8 characters",
    "Password must contain uppercase letter"
  ]
}
```

*409 Conflict - User Exists:*
```json
{
  "success": false,
  "message": "User with this email or phone already exists"
}
```

---

### 2. User Login

Authenticate user and receive access tokens.

**Endpoint:** `POST /api/v1/auth/login`

**Authentication:** None

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "SecurePass@123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT",
      "isActive": true,
      "isEmailVerified": true,
      "profileImage": null,
      "lastLogin": "2025-11-20T00:00:00.000Z",
      "studentProfile": {
        "id": "uuid-here",
        "grade": null,
        "xp": 0,
        "level": 1,
        "badges": []
      }
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

*401 Unauthorized - Invalid Credentials:*
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

*403 Forbidden - Account Deactivated:*
```json
{
  "success": false,
  "message": "Account is deactivated. Please contact support."
}
```

---

### 3. Get Current User

Retrieve authenticated user's profile information.

**Endpoint:** `GET /api/v1/auth/me`

**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:5001/api/v1/auth/me \
  -H 'Authorization: Bearer <access_token>'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "isActive": true,
    "isEmailVerified": true,
    "phone": "+919876543210",
    "profileImage": "https://cdn.example.com/avatar.jpg",
    "studentProfile": {
      "id": "uuid-here",
      "grade": "10",
      "school": "ABC High School",
      "xp": 1250,
      "level": 3,
      "badges": ["early_bird", "quick_learner"]
    }
  }
}
```

---

### 4. Refresh Access Token

Obtain a new access token using refresh token.

**Endpoint:** `POST /api/v1/auth/refresh-token`

**Authentication:** None

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

---

### 5. Logout

Invalidate user session and tokens.

**Endpoint:** `POST /api/v1/auth/logout`

**Authentication:** Required

**Request:**
```bash
curl -X POST http://localhost:5001/api/v1/auth/logout \
  -H 'Authorization: Bearer <access_token>'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 6. Verify Email

Verify email address using OTP.

**Endpoint:** `POST /api/v1/auth/verify-email`

**Authentication:** Required

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

---

### 7. Resend OTP

Request a new OTP for email verification.

**Endpoint:** `POST /api/v1/auth/resend-otp`

**Authentication:** Required

**Request:**
```bash
curl -X POST http://localhost:5001/api/v1/auth/resend-otp \
  -H 'Authorization: Bearer <access_token>'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

**Note:** OTP is valid for 10 minutes. Check server logs for OTP in development mode.

---

### 8. Forgot Password

Request password reset OTP.

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Authentication:** None

**Request Body:**
```json
{
  "email": "student@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email"
}
```

**Note:** For security, this endpoint always returns success even if email doesn't exist.

---

### 9. Reset Password

Reset password using OTP.

**Endpoint:** `POST /api/v1/auth/reset-password`

**Authentication:** None

**Request Body:**
```json
{
  "email": "student@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass@123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses:**

*400 Bad Request - Invalid OTP:*
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

*400 Bad Request - Weak Password:*
```json
{
  "success": false,
  "errors": [
    "Password must be at least 8 characters",
    "Password must contain a special character"
  ]
}
```

---

### 10. Change Password

Change password for authenticated user.

**Endpoint:** `POST /api/v1/auth/change-password`

**Authentication:** Required

**Request Body:**
```json
{
  "oldPassword": "SecurePass@123",
  "newPassword": "NewSecurePass@456"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### 11. Verify OTP (Generic)

Verify OTP for various purposes (email, phone, password reset).

**Endpoint:** `POST /api/v1/auth/verify-otp`

**Authentication:** None

**Request Body:**
```json
{
  "email": "student@example.com",
  "otp": "123456",
  "purpose": "email"
}
```

**Purpose Options:**
- `email` - Email verification
- `password_reset` - Password reset
- `phone` - Phone verification

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "userId": "uuid-here"
  }
}
```

---

## User Management

### 1. Get All Users

Retrieve list of all users (Admin only).

**Endpoint:** `GET /api/v1/users`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `role` (optional): Filter by role
- `search` (optional): Search by name or email
- `isActive` (optional): Filter by active status

**Request:**
```bash
curl -X GET 'http://localhost:5001/api/v1/users?page=1&limit=20&role=STUDENT' \
  -H 'Authorization: Bearer <access_token>'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User routes",
  "data": {
    "users": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "pages": 0
    }
  }
}
```

**Note:** Detailed implementation pending. Returns placeholder response.

---

### 2. Get User by ID

Retrieve specific user details.

**Endpoint:** `GET /api/v1/users/:id`

**Authentication:** Required

**Request:**
```bash
curl -X GET http://localhost:5001/api/v1/users/uuid-here \
  -H 'Authorization: Bearer <access_token>'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }
}
```

---

### 3. Update User Profile

Update authenticated user's profile.

**Endpoint:** `PATCH /api/v1/users/me`

**Authentication:** Required

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "bio": "Aspiring software engineer",
  "profileImage": "https://cdn.example.com/avatar.jpg"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Aspiring software engineer"
  }
}
```

---

## Course Management

### 1. Get All Courses

Retrieve list of available courses.

**Endpoint:** `GET /api/v1/courses`

**Authentication:** Optional (public courses visible without auth)

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by category
- `level` (optional): Filter by difficulty (BEGINNER, INTERMEDIATE, ADVANCED)
- `search` (optional): Search by title or description
- `sort` (optional): Sort by (popular, newest, price)

**Request:**
```bash
curl -X GET 'http://localhost:5001/api/v1/courses?category=programming&level=BEGINNER'
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Course routes",
  "data": {
    "courses": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0
    }
  }
}
```

**Note:** Detailed implementation pending.

---

### 2. Get Course by ID

Retrieve detailed course information.

**Endpoint:** `GET /api/v1/courses/:id`

**Authentication:** Optional

**Request:**
```bash
curl -X GET http://localhost:5001/api/v1/courses/uuid-here
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Introduction to Python Programming",
    "description": "Learn Python from scratch",
    "thumbnail": "https://cdn.example.com/course-thumbnail.jpg",
    "price": 2999,
    "discountedPrice": 1999,
    "level": "BEGINNER",
    "language": "English",
    "duration": 3600,
    "category": "Programming",
    "teacher": {
      "id": "uuid-here",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "sections": [
      {
        "id": "uuid-here",
        "title": "Getting Started",
        "order": 1,
        "lessons": [
          {
            "id": "uuid-here",
            "title": "Introduction to Python",
            "type": "VIDEO",
            "duration": 600,
            "order": 1
          }
        ]
      }
    ],
    "totalStudents": 150,
    "rating": 4.5,
    "totalReviews": 45
  }
}
```

---

### 3. Create Course (Teacher Only)

Create a new course.

**Endpoint:** `POST /api/v1/courses`

**Authentication:** Required (Teacher role)

**Request Body:**
```json
{
  "title": "Introduction to Python Programming",
  "description": "Learn Python from scratch",
  "category": "Programming",
  "level": "BEGINNER",
  "language": "English",
  "price": 2999,
  "thumbnail": "https://cdn.example.com/thumbnail.jpg"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": "uuid-here",
    "title": "Introduction to Python Programming",
    "status": "DRAFT"
  }
}
```

---

### 4. Update Course

Update course details.

**Endpoint:** `PATCH /api/v1/courses/:id`

**Authentication:** Required (Course owner or Admin)

**Request Body:**
```json
{
  "title": "Updated Course Title",
  "price": 3499,
  "status": "PUBLISHED"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "id": "uuid-here",
    "title": "Updated Course Title"
  }
}
```

---

### 5. Delete Course

Delete a course.

**Endpoint:** `DELETE /api/v1/courses/:id`

**Authentication:** Required (Course owner or Admin)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## Enrollment

### 1. Enroll in Course

Enroll student in a course.

**Endpoint:** `POST /api/v1/enrollments`

**Authentication:** Required (Student role)

**Request Body:**
```json
{
  "courseId": "uuid-here",
  "paymentId": "uuid-here"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Enrollment routes",
  "data": {
    "enrollmentId": "uuid-here",
    "courseId": "uuid-here",
    "studentId": "uuid-here",
    "enrolledAt": "2025-11-20T00:00:00.000Z",
    "progress": 0
  }
}
```

---

### 2. Get My Enrollments

Get all enrollments for authenticated student.

**Endpoint:** `GET /api/v1/enrollments/my-courses`

**Authentication:** Required (Student role)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "uuid-here",
        "courseId": "uuid-here",
        "progress": 45,
        "lastAccessedAt": "2025-11-20T00:00:00.000Z",
        "course": {
          "title": "Introduction to Python",
          "thumbnail": "https://cdn.example.com/thumb.jpg"
        }
      }
    ]
  }
}
```

---

### 3. Update Lesson Progress

Mark lesson as completed and update progress.

**Endpoint:** `POST /api/v1/enrollments/:enrollmentId/progress`

**Authentication:** Required

**Request Body:**
```json
{
  "lessonId": "uuid-here",
  "completed": true,
  "timeSpent": 600
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Progress updated",
  "data": {
    "lessonProgress": {
      "completed": true,
      "completedAt": "2025-11-20T00:00:00.000Z"
    },
    "courseProgress": 55,
    "xpEarned": 50
  }
}
```

---

## Live Classes

### 1. Get Upcoming Live Classes

Get scheduled live classes.

**Endpoint:** `GET /api/v1/live-classes`

**Authentication:** Required

**Query Parameters:**
- `status` (optional): upcoming | live | completed
- `courseId` (optional): Filter by course

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Live class routes",
  "data": {
    "classes": [
      {
        "id": "uuid-here",
        "title": "Python Basics - Session 1",
        "scheduledAt": "2025-11-21T10:00:00.000Z",
        "duration": 60,
        "status": "upcoming",
        "meetingLink": null,
        "course": {
          "title": "Introduction to Python"
        }
      }
    ]
  }
}
```

---

### 2. Schedule Live Class (Teacher)

Schedule a new live class.

**Endpoint:** `POST /api/v1/live-classes`

**Authentication:** Required (Teacher role)

**Request Body:**
```json
{
  "courseId": "uuid-here",
  "title": "Python Basics - Session 1",
  "description": "Introduction to variables and data types",
  "scheduledAt": "2025-11-21T10:00:00.000Z",
  "duration": 60,
  "maxParticipants": 50
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Live class scheduled",
  "data": {
    "id": "uuid-here",
    "title": "Python Basics - Session 1",
    "meetingLink": "https://meet.example.com/xyz-abc-123"
  }
}
```

---

### 3. Join Live Class

Get meeting link to join live class.

**Endpoint:** `POST /api/v1/live-classes/:id/join`

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "meetingLink": "https://meet.example.com/xyz-abc-123",
    "password": "123456",
    "startTime": "2025-11-21T10:00:00.000Z"
  }
}
```

---

## Tests & Quizzes

### 1. Get Tests for Course

Retrieve all tests for a specific course.

**Endpoint:** `GET /api/v1/tests?courseId=:courseId`

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Test routes",
  "data": {
    "tests": [
      {
        "id": "uuid-here",
        "title": "Python Fundamentals Quiz",
        "type": "QUIZ",
        "duration": 30,
        "totalMarks": 100,
        "passingMarks": 40,
        "totalQuestions": 20
      }
    ]
  }
}
```

---

### 2. Get Test Details

Get detailed test information including questions.

**Endpoint:** `GET /api/v1/tests/:id`

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "title": "Python Fundamentals Quiz",
    "description": "Test your Python knowledge",
    "type": "QUIZ",
    "duration": 30,
    "totalMarks": 100,
    "questions": [
      {
        "id": "uuid-here",
        "questionText": "What is Python?",
        "type": "MCQ",
        "marks": 5,
        "options": [
          { "id": "opt1", "text": "A programming language", "order": 1 },
          { "id": "opt2", "text": "A snake", "order": 2 }
        ]
      }
    ]
  }
}
```

---

### 3. Submit Test

Submit test answers for evaluation.

**Endpoint:** `POST /api/v1/tests/:id/submit`

**Authentication:** Required

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "uuid-here",
      "selectedOptions": ["opt1"]
    },
    {
      "questionId": "uuid-here",
      "answer": "Python is a high-level programming language"
    }
  ],
  "timeSpent": 1800
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Test submitted successfully",
  "data": {
    "submissionId": "uuid-here",
    "score": 85,
    "totalMarks": 100,
    "percentage": 85,
    "passed": true,
    "correctAnswers": 17,
    "wrongAnswers": 3,
    "xpEarned": 100
  }
}
```

---

### 4. Create Test (Teacher)

Create a new test for a course.

**Endpoint:** `POST /api/v1/tests`

**Authentication:** Required (Teacher role)

**Request Body:**
```json
{
  "courseId": "uuid-here",
  "title": "Python Fundamentals Quiz",
  "type": "QUIZ",
  "duration": 30,
  "totalMarks": 100,
  "passingMarks": 40,
  "questions": [
    {
      "questionText": "What is Python?",
      "type": "MCQ",
      "marks": 5,
      "options": [
        { "text": "A programming language", "isCorrect": true },
        { "text": "A snake", "isCorrect": false }
      ]
    }
  ]
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Test created successfully",
  "data": {
    "id": "uuid-here",
    "title": "Python Fundamentals Quiz"
  }
}
```

---

## Payments

### 1. Create Payment Order

Initialize payment for course enrollment.

**Endpoint:** `POST /api/v1/payments/create-order`

**Authentication:** Required

**Request Body:**
```json
{
  "courseId": "uuid-here",
  "couponCode": "SAVE20"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment routes",
  "data": {
    "orderId": "order_xyz123",
    "amount": 1999,
    "currency": "INR",
    "courseId": "uuid-here",
    "paymentGateway": "razorpay",
    "key": "rzp_test_key"
  }
}
```

---

### 2. Verify Payment

Verify payment after successful transaction.

**Endpoint:** `POST /api/v1/payments/verify`

**Authentication:** Required

**Request Body:**
```json
{
  "orderId": "order_xyz123",
  "paymentId": "pay_abc456",
  "signature": "signature_hash",
  "courseId": "uuid-here"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "uuid-here",
    "status": "SUCCESS",
    "enrollmentId": "uuid-here"
  }
}
```

---

### 3. Get Payment History

Retrieve user's payment history.

**Endpoint:** `GET /api/v1/payments/history`

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "uuid-here",
        "amount": 1999,
        "status": "SUCCESS",
        "method": "UPI",
        "createdAt": "2025-11-20T00:00:00.000Z",
        "course": {
          "title": "Introduction to Python"
        }
      }
    ]
  }
}
```

---

### 4. Process Refund (Admin)

Process refund for a payment.

**Endpoint:** `POST /api/v1/payments/:id/refund`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "reason": "Course cancelled by instructor"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "refundId": "rfnd_xyz123",
    "amount": 1999,
    "status": "PROCESSING"
  }
}
```

---

## Dashboard

### 1. Student Dashboard

Get student dashboard data.

**Endpoint:** `GET /api/v1/dashboard/student`

**Authentication:** Required (Student role)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Dashboard routes",
  "data": {
    "stats": {
      "enrolledCourses": 5,
      "completedCourses": 2,
      "totalXP": 1250,
      "level": 3,
      "currentStreak": 7,
      "badges": ["early_bird", "quick_learner", "top_scorer"]
    },
    "recentCourses": [
      {
        "id": "uuid-here",
        "title": "Introduction to Python",
        "progress": 65,
        "lastAccessed": "2025-11-20T00:00:00.000Z"
      }
    ],
    "upcomingClasses": [
      {
        "id": "uuid-here",
        "title": "Python Basics - Session 2",
        "scheduledAt": "2025-11-21T10:00:00.000Z"
      }
    ],
    "pendingTests": [
      {
        "id": "uuid-here",
        "title": "Python Fundamentals Quiz",
        "dueDate": "2025-11-22T23:59:59.000Z"
      }
    ]
  }
}
```

---

### 2. Teacher Dashboard

Get teacher dashboard data.

**Endpoint:** `GET /api/v1/dashboard/teacher`

**Authentication:** Required (Teacher role)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalCourses": 8,
      "totalStudents": 350,
      "totalRevenue": 125000,
      "avgRating": 4.7
    },
    "recentEnrollments": [
      {
        "studentName": "John Doe",
        "courseName": "Python Programming",
        "enrolledAt": "2025-11-20T00:00:00.000Z"
      }
    ],
    "upcomingClasses": [
      {
        "id": "uuid-here",
        "title": "Live Session - Python Basics",
        "scheduledAt": "2025-11-21T10:00:00.000Z",
        "registeredStudents": 25
      }
    ],
    "pendingReviews": 5
  }
}
```

---

### 3. Admin Dashboard

Get admin dashboard with platform statistics.

**Endpoint:** `GET /api/v1/dashboard/admin`

**Authentication:** Required (Admin role)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 5000,
      "totalCourses": 150,
      "totalRevenue": 2500000,
      "activeUsers": 1200
    },
    "recentUsers": [],
    "topCourses": [],
    "revenueChart": []
  }
}
```

---

## Analytics

### 1. Get Course Analytics

Get analytics for a specific course.

**Endpoint:** `GET /api/v1/analytics/course/:courseId`

**Authentication:** Required (Teacher/Admin)

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Analytics routes",
  "data": {
    "totalEnrollments": 150,
    "completionRate": 68,
    "avgRating": 4.5,
    "totalRevenue": 299850,
    "enrollmentTrend": [
      { "date": "2025-11-01", "count": 10 },
      { "date": "2025-11-02", "count": 15 }
    ],
    "topPerformingLessons": [],
    "studentEngagement": {
      "avgTimeSpent": 3600,
      "avgProgress": 55
    }
  }
}
```

---

### 2. Get Student Performance

Get performance analytics for a student.

**Endpoint:** `GET /api/v1/analytics/student/:studentId`

**Authentication:** Required (Student/Parent/Teacher/Admin)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overallProgress": 65,
    "coursesCompleted": 3,
    "coursesInProgress": 2,
    "totalXP": 1250,
    "testScores": {
      "average": 82,
      "highest": 95,
      "lowest": 68
    },
    "learningStreak": 7,
    "timeSpent": 25200,
    "strongSubjects": ["Python", "Mathematics"],
    "weakSubjects": ["Chemistry"]
  }
}
```

---

## Notifications

### 1. Get Notifications

Retrieve user notifications.

**Endpoint:** `GET /api/v1/notifications`

**Authentication:** Required

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `unreadOnly`: true/false

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification routes",
  "data": {
    "notifications": [
      {
        "id": "uuid-here",
        "type": "COURSE_ENROLLMENT",
        "title": "New Enrollment",
        "message": "You have been enrolled in Python Programming",
        "isRead": false,
        "createdAt": "2025-11-20T00:00:00.000Z",
        "data": {
          "courseId": "uuid-here"
        }
      }
    ],
    "unreadCount": 5
  }
}
```

---

### 2. Mark as Read

Mark notification(s) as read.

**Endpoint:** `PATCH /api/v1/notifications/:id/read`

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 3. Mark All as Read

Mark all notifications as read.

**Endpoint:** `PATCH /api/v1/notifications/read-all`

**Authentication:** Required

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## AI Services

### 1. Generate Course Content

Use AI to generate course content.

**Endpoint:** `POST /api/v1/ai/generate-content`

**Authentication:** Required (Teacher role)

**Request Body:**
```json
{
  "type": "lesson",
  "topic": "Python Variables and Data Types",
  "level": "BEGINNER",
  "duration": 600
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "AI routes",
  "data": {
    "content": "Introduction to Python Variables...",
    "keyPoints": [
      "Variables store data",
      "Python is dynamically typed"
    ],
    "examples": [
      "x = 10",
      "name = 'John'"
    ]
  }
}
```

---

### 2. AI Doubt Resolution

Get AI-powered answers to student doubts.

**Endpoint:** `POST /api/v1/ai/resolve-doubt`

**Authentication:** Required

**Request Body:**
```json
{
  "courseId": "uuid-here",
  "question": "What is the difference between list and tuple in Python?"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "answer": "Lists are mutable while tuples are immutable...",
    "references": [
      {
        "lessonId": "uuid-here",
        "title": "Python Data Structures"
      }
    ],
    "confidence": 0.95
  }
}
```

---

### 3. Generate Quiz Questions

AI-generated quiz questions.

**Endpoint:** `POST /api/v1/ai/generate-quiz`

**Authentication:** Required (Teacher role)

**Request Body:**
```json
{
  "topic": "Python Functions",
  "difficulty": "INTERMEDIATE",
  "questionCount": 10,
  "questionTypes": ["MCQ", "TRUE_FALSE"]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "questionText": "What is a function in Python?",
        "type": "MCQ",
        "options": [
          { "text": "A reusable block of code", "isCorrect": true },
          { "text": "A variable", "isCorrect": false }
        ],
        "explanation": "Functions are reusable blocks of code..."
      }
    ]
  }
}
```

---

### 4. Personalized Learning Path

Get AI-recommended learning path.

**Endpoint:** `GET /api/v1/ai/learning-path`

**Authentication:** Required (Student role)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recommendedCourses": [
      {
        "courseId": "uuid-here",
        "title": "Advanced Python Concepts",
        "reason": "Based on your progress in Python Basics",
        "priority": 1
      }
    ],
    "skillGaps": ["Object-Oriented Programming", "Error Handling"],
    "estimatedCompletionTime": 40
  }
}
```

---

## Error Handling

All API endpoints follow a consistent error response format:

### Error Response Structure

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed technical error (development only)",
  "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Authentication required or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Common Error Scenarios

#### 1. Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

#### 2. Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid or expired token. Please login again."
}
```

#### 3. Authorization Error (403)
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

#### 4. Resource Not Found (404)
```json
{
  "success": false,
  "message": "Course not found"
}
```

#### 5. Conflict Error (409)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse and ensure fair usage.

### Rate Limit Configuration

- **Window:** 15 minutes (900 seconds)
- **Max Requests:** 100 requests per window per IP address
- **Authenticated Users:** Higher limits may apply

### Rate Limit Headers

Every API response includes rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1637395200
```

### Rate Limit Exceeded Response (429)

```json
{
  "success": false,
  "message": "Too many requests, please try again later.",
  "retryAfter": 300
}
```

### Best Practices

1. **Monitor Headers:** Check `X-RateLimit-Remaining` to avoid hitting limits
2. **Implement Exponential Backoff:** Wait before retrying failed requests
3. **Cache Responses:** Cache GET responses when possible
4. **Batch Operations:** Use batch endpoints when available
5. **Use Webhooks:** For real-time updates instead of polling

---

## Additional Notes

### Date & Time Format

All timestamps use ISO 8601 format in UTC:

```
2025-11-20T00:00:00.000Z
```

### Pagination

List endpoints support pagination with query parameters:

```
GET /api/v1/courses?page=2&limit=20
```

**Response includes pagination metadata:**
```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": true
  }
}
```

### File Uploads

File upload endpoints use `multipart/form-data`:

```bash
curl -X POST http://localhost:5001/api/v1/courses/:id/thumbnail \
  -H 'Authorization: Bearer <token>' \
  -F 'file=@/path/to/image.jpg'
```

**Supported formats:**
- Images: JPG, PNG, GIF (max 5MB)
- Videos: MP4, MOV, AVI (max 500MB)
- Documents: PDF, DOCX (max 10MB)

### Webhook Events

Available webhook events for real-time notifications:

- `course.enrolled` - New course enrollment
- `payment.success` - Payment completed
- `test.submitted` - Test submission
- `class.started` - Live class started
- `achievement.unlocked` - Badge/achievement earned

### CORS Configuration

CORS is enabled for the configured frontend URL. For development:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

### Security Headers

All responses include security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## Support & Resources

- **API Issues:** Report to dev@edupro.com
- **Status Page:** https://status.edupro.com
- **Changelog:** https://docs.edupro.com/changelog
- **Postman Collection:** Available on request

---

**Documentation Version:** 1.0.0  
**Last Updated:** November 20, 2025  
**API Version:** v1
